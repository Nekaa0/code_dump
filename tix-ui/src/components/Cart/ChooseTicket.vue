<template>
  <section>
    <cart-step :step="cartStep" @cancel="back" />
    <cart-header title="checkout" message="choose a ticket below" @back="back" />
    <el-form :model="formData" :rules="rules" ref="ChooseTicket" class="order-form">
      <div class="order-form__container" v-if="prevStep">
        <el-form-item prop="ticket">
          <cart-ticket-list :options="tickets" v-model="formData.ticket" :windowWidth="windowWidth" :event="event" :schedule="schedule" :currency="currency" />
        </el-form-item>
      </div>
      <div class="order-form__container" v-if="!nextStep">
        <el-button native-type="submit" type="primary" @click.prevent="next" :disabled="nextButtonDisabled()">
          <span>next</span>
        </el-button>
      </div>
      <div class="horizontal--line" />
      <cart-header message="contact information" @back="back" />
      <div v-show="nextStep">
        <div class="order-form__container">
          <cart-timeout v-if="showTimeout" :timeout="timeout" :start="showTimeout" :showName="false" :quantity="sumOfQuantities" @expired="timeoutExpired" :onlyFreeTickets="onlyFreeTickets || !total" />
          <el-form-item label="your email address" prop="buyerEmail" :hidden="selectedTicketIsInviteOnly">
            <el-input type="email" v-model.trim="formData.buyerEmail" placeholder="email address" />
          </el-form-item>
          <el-form-item label="your first name" prop="buyerFirstName">
            <el-input type="email" v-model.trim="formData.buyerFirstName" placeholder="first name" />
          </el-form-item>
          <el-form-item label="your last name" prop="buyerLastName">
            <el-input type="email" v-model.trim="formData.buyerLastName" placeholder="last name" />
          </el-form-item>
          <el-form-item label="your phone number" prop="buyerPhoneNumber">
            <el-input type="tel" v-model.trim="formData.buyerPhoneNumber" placeholder="your phone number" />
          </el-form-item>
        </div>
        <order-recipients v-if="!inviteeId" :selectedTicketsInfo="selectedTicketsInfo()" :tickets="tickets" @emitOrderRecipients="getOrderRecipients" />
        <additional-questions :tickets="tickets" :selectedTickets="selectedTicketsInfo()" @emitOrderAnswersData="getOrderAnswersData" />
        <div class="horizontal--line" />
        <div class="order-form__container order-form__discount" :class="{success: discountSuccess, error: discountError}">
          <el-form-item label="enter discount code">
            <el-input v-model.trim="discountCode" :disabled="disableDiscount">
              <span :class="{error: discountError}" slot="append" @click.prevent="discountButton">{{ discountText }}</span>
            </el-input>
            <p class="message" :class="{error: discountError}" v-if="showDiscountMessage">{{ discountMessage }}</p>
          </el-form-item>
        </div>
        <div class="order-form__container order-btn__web" v-if="windowWidth > mobileBreakpoint">
          <el-button native-type="submit" type="primary" @click.prevent="orderTicket" :disabled="isOrderFormDisabled()" :loading="processing">
            <span>order ticket{{sumOfQuantities > 1 ? 's' : ''}}</span>
          </el-button>
        </div>
        <div class="order-form__container" v-else>
          <el-button type="default" @click.prevent="cancel" :loading="cancelling" :disabled="processing">
            <span>back</span>
          </el-button>
          <el-button v-if="!total" native-type="submit" type="primary" @click.prevent="orderTicket" :disabled="isOrderFormDisabled()" :loading="processing">
            <span>order ticket{{sumOfQuantities > 1 ? 's' : ''}}</span>
          </el-button>
          <el-button v-else native-type="submit" type="primary" @click.prevent="payForTicket" :disabled="isOrderFormDisabled()" :loading="processing">
            <span>pay</span>
          </el-button>
        </div>
      </div>
    </el-form>
  </section>
</template>

<script>
import { InputNumber } from 'element-ui';
import * as ActionCable from 'actioncable';
import gql from 'graphql-tag';
import CREATE_ORDER from '@/graphql/CreateOrder.gql';
import VERIFY_DISCOUNT from '@/graphql/VerifyDiscountCode.gql';
import FETCH_ORDER_COST from '@/graphql/FetchOrderCost.gql';
import ErrorHandler from '@/helpers/error-handler';
import CartTicketList from '@/components/Cart/CartTicketList';
import CartHeader from '@/components/Cart/CartHeader';
import CartStep from '@/components/Cart/CartStep';
import CartTimeout from '@/components/Cart/CartTimeout';
import { validation } from '@/helpers/utility';
import AdditionalQuestions from './CartAdditionalQuestions';
import OrderRecipients from './OrderRecipients/OrderRecipients';

export default {
  name: 'choose-ticket',
  props: {
    tickets: Array,
    event: Object,
    inviteeId: String,
    windowWidth: Number,
    timeout: Object,
    onlyFreeTickets: Boolean,
    schedule: Array,
    paymentError: Boolean,
    automatedDiscount: Object,
    currency: String,
  },
  components: {
    ElInputNumber: InputNumber,
    CartTicketList,
    CartHeader,
    CartStep,
    CartTimeout,
    AdditionalQuestions,
    OrderRecipients,
  },
  created() {
    if (this.windowWidth > this.mobileBreakpoint) {
      this.nextStep = true;
    }
    let total = 2;
    if (!this.onlyFreeTickets) {
      total = 3;
    }
    this.cartStep = {
      title: 'choose ticket',
      current: 1,
      total,
      hasMargin: true,
      showStep: true,
    };
    this.cable = ActionCable.createConsumer(`${process.env.ACTION_CABLE_URL}/cable?order=${this.id}`);
    this.cable.subscriptions.create({ channel: 'OrderChannel' }, {
      connected(response) {
        console.log('connected: ', response);
      },
      received(response) {
        console.log('received: ', response);
      },
    });
    if (this.automatedDiscount) this.formData.discountCode = this.automatedDiscount.id;
  },
  data() {
    const isSameAsBuyer = (rule, value, callback) => {
      if (value !== this.formData.buyer) {
        callback(new Error('Passwords must match'));
      } else {
        callback();
      }
    };
    return {
      mobileBreakpoint: 480,
      cancelling: false,
      processing: false,
      order: null,
      discountCode: '',
      discountText: 'clear',
      discountError: null,
      discountSuccess: null,
      discountMessage: null,
      formData: {
        ticket: null,
        quantity: 0,
        buyerEmail: null,
        buyerFirstName: null,
        buyerLastName: null,
        buyerPhoneNumber: null,
        orderAnswers: null,
        discountCode: null,
        orderRecipients: [],
      },
      baseRules: {
        ticket: [
          { required: true, trigger: 'change', message: 'please choose a ticket' },
        ],
        quantity: [
          { required: true, type: 'number', trigger: 'change', message: 'required' },
        ],
        buyerEmail: [
          { required: true, type: 'email', trigger: 'blur', message: 'please enter a valid email address' },
        ],
        buyerConfirmation: [
          { required: true, type: 'email', validator: isSameAsBuyer, trigger: 'change', message: 'confirm that this is the same as the email address' },
        ],
        buyerFirstName: [
          { required: true, trigger: 'blur', message: 'please enter your first name' },
          { required: true, trigger: 'blur', validator: validation.isAlphabetic, message: 'only alphabets are allowed' },
        ],
        buyerLastName: [
          { required: true, trigger: 'blur', message: 'please enter your last name' },
          { required: true, trigger: 'blur', validator: validation.isAlphabetic, message: 'only alphabets are allowed' },
        ],
        buyerPhoneNumber: [
          { required: true, trigger: 'blur', validator: validation.isNumeric, message: 'please enter a valid phone number' },
        ],
      },
      requiredCustomFieldsAreNotFilled: false,
      allRecipientsFilled: true,
      cartStep: {},
      nextStep: false,
      prevStep: true,
    };
  },
  computed: {
    disableDiscount() {
      return this.selectedTicketsInfo().length === 0;
    },
    showTimeout() {
      return this.windowWidth <= this.mobileBreakpoint && this.cartStep.current === 2;
    },
    rules() {
      return this.selectedTicketIsInviteOnly ?
        Object.assign(this.baseRules, {
          buyerEmail: [{ required: false }],
        }) :
        this.baseRules;
    },
    total() {
      const eachTotal = this.selectedTicketsInfo().map((s) => {
        const ticket = Object.assign({}, this.tickets.find(t => t.id === s.ticket));
        const price = ticket.transferFees ? ticket.priceWithFees : ticket.price;
        return ticket ? price * s.quantity : 0;
      });
      return eachTotal.reduce((acc, curr) => (acc + Number(curr)), 0);
    },
    selectedTicketIsInviteOnly() {
      const selectedTickets = this.selectedTicketsInfo();
      if ((!this.formData.ticket) || (selectedTickets.length !== 1)) return false;

      const ticket = Object.assign({}, this.tickets.find(t => t.id === selectedTickets[0].ticket));
      const isInviteOnly = ticket && ticket.inviteOnly;
      return isInviteOnly;
    },
    sumOfQuantities() {
      const quantities = this.selectedTicketsInfo().map(s => s.quantity);
      return quantities.reduce((acc, curr) => (acc + curr), 0);
    },
    showDiscountMessage() {
      return this.discountError || this.discountSuccess;
    },
  },
  methods: {
    next() {
      this.nextStep = true;
      this.prevStep = false;
      this.cartStep.current += 1;
      this.cartStep.title = 'contact information';
      this.cartStep.hasMargin = false;
    },
    timeoutExpired() {
      const header = 'time limit reached';
      const message = 'your tickets have been released because the order was not completed within the time frame. please re-start your order to continue.';
      this.$confirm(message, header, {
        confirmButtonText: 'restart my order',
        showCancelButton: false,
        showClose: false,
        closeOnPressEscape: false,
        closeOnClickModal: false,
      }).then(() => {
        this.goBack();
        this.emitCancel();
      }).catch(() => {
        this.cancelling = false;
      });
    },
    cancel() {
      const header = 'release tickets';
      const message = 'are you sure you want to cancel? this will cancel the order and release your tickets.';
      this.$confirm(message, header, {
        confirmButtonText: 'yes',
        cancelButtonText: 'go back',
        showClose: false,
      }).then(() => {
        this.goBack();
        this.emitCancel();
      }).catch(() => {
        this.cancelling = false;
      });
    },
    emitCancel() {
      this.$message({
        type: 'error',
        message: 'order cancelled',
      });
      this.$emit('cancel');
    },
    back() {
      this.$emit('back');
    },
    goBack() {
      this.nextStep = false;
      this.prevStep = true;
      this.cartStep.current -= 1;
      this.cartStep.title = 'choose tickets';
      this.cartStep.hasMargin = true;
    },
    saveOrderAnswers() {
      this.formData.orderAnswers = this.formatOrderAnswers(this.formData.orderAnswers);
    },
    formatOrderAnswers(orderAnswers) {
      const answers = [];
      orderAnswers.forEach((orderAnswer) => {
        if (orderAnswer.answer === '') { return; }
        answers.push({
          custom_field: orderAnswer.id,
          answer: orderAnswer.answer,
        });
      });
      return answers;
    },
    getOrderAnswersData(payload) {
      this.formData.orderAnswers = payload[0];
      this.requiredCustomFieldsAreNotFilled = payload[1];
    },
    getOrderRecipients(orderRecipients) {
      this.formData.orderRecipients = orderRecipients.data;
      this.allRecipientsFilled = orderRecipients.allRecipientsFilled;
    },
    getOrderCost(variables) {
      this.$apollo.query({
        query: gql`${FETCH_ORDER_COST}`,
        variables,
        fetchPolicy: 'network-only',
      }).then(({ data }) => {
        this.$emit('orderCost', data.orderCost);
      }).catch((error) => {
        ErrorHandler.throwGraphQLError(error);
      });
    },
    discountButton() {
      return this.discountText === 'add' ? this.validateDiscount() : this.removeDiscount();
    },
    removeDiscount() {
      this.discountCode = '';
      this.formData.discountCode = null;
    },
    validateDiscount() {
      if (this.discountCode && this.selectedTicketsInfo().length > 0) {
        this.discountSuccess = null;
        this.discountError = null;
        this.$apollo.query({
          query: gql`${VERIFY_DISCOUNT}`,
          variables: {
            event: this.event.id,
            code: this.discountCode,
            ticketsInfo: this.selectedTicketsInfo(),
          },
          fetchPolicy: 'network-only',
        }).then(({ data }) => {
          const { validDiscountCode: { isValid, discountCodeId } } = data;
          if (isValid) {
            this.discountSuccess = true;
            this.formData.discountCode = discountCodeId;
            this.discountMessage = 'discount code has been applied to checkout!';
          } else {
            this.discountError = false;
            this.discountMessage = 'sorry, the code is invalid';
          }
        }).catch((error) => {
          this.discountError = true;
          const graphqlError = 'GraphQL error:';
          const index = error.message.indexOf(graphqlError);
          if (index !== -1) {
            this.discountMessage = error.message.slice(index + graphqlError.length).toLowerCase();
          }
          ErrorHandler.throwGraphQLError(error);
        });
      }
    },
    payForTicket() {
      this.saveOrderAnswers();
      const invitee = this.inviteeId ? this.inviteeId : null;
      this.formData = Object.assign(this.formData, {
        invitee,
        ticketsInfo: this.selectedTicketsInfo(),
      });
      this.$refs.ChooseTicket.validate((valid) => {
        if (valid) {
          this.processing = true;
          return this.$apollo.mutate({
            mutation: CREATE_ORDER,
            variables: this.formData,
          }).then((response) => {
            this.getOrderCost(this.formData);
            const { createOrder } = response.data;
            if (Number(createOrder.price) > 0) {
              setTimeout(() => this.$emit('pay', createOrder), 1000);
            } else setTimeout(() => this.$emit('complete', createOrder), 1000);
          }).catch((error) => {
            this.processing = false;
            ErrorHandler.throwGraphQLError(error);
          });
        }
        return this.$message.error('Please review the errors and try again');
      });
    },
    orderTicket() {
      this.saveOrderAnswers();
      const invitee = this.inviteeId ? this.inviteeId : null;
      this.formData = Object.assign(this.formData, {
        invitee,
        ticketsInfo: this.selectedTicketsInfo(),
      });
      this.$refs.ChooseTicket.validate((valid) => {
        if (valid) {
          this.processing = true;
          return this.$apollo.mutate({
            mutation: CREATE_ORDER,
            variables: this.formData,
          }).then((response) => {
            this.getOrderCost(this.formData);
            setTimeout(() => this.$emit('complete', response.data.createOrder), 1000);
          }).catch((error) => {
            this.processing = false;
            ErrorHandler.throwGraphQLError(error);
          });
        }
        return this.$message.error('Please review the errors and try again');
      });
    },
    isOrderFormDisabled() {
      const buyerNameEmpty = !this.formData.buyerFirstName || !this.formData.buyerLastName;
      const buyerContactEmpty = this.selectedTicketIsInviteOnly ?
        (!this.selectedTicketIsInviteOnly || !this.formData.buyerPhoneNumber) :
        (!this.formData.buyerEmail || !this.formData.buyerPhoneNumber);
      const noTicketSelected = this.selectedTicketsInfo().length === 0;
      return (
        noTicketSelected ||
        buyerNameEmpty ||
        buyerContactEmpty ||
        this.requiredCustomFieldsAreNotFilled ||
        !this.allRecipientsFilled
      );
    },
    nextButtonDisabled() {
      return this.selectedTicketsInfo().length === 0;
    },
    selectedTicketsInfo() {
      if (!this.formData.ticket) return [];
      const selectedTickets = this.formData.ticket[0];
      const quantities = this.formData.ticket[1];
      return selectedTickets.map(t => ({
        ticket: t,
        quantity: quantities[t],
        ticketSchedule: this.schedule.find(val => val.ticket === t).id,
      }));
    },
  },
  watch: {
    windowWidth(val) {
      if (val > this.mobileBreakpoint) {
        this.nextStep = true;
        this.prevStep = true;
      } else if (this.cartStep.current === 2) {
        this.nextStep = true;
        this.prevStep = false;
      } else {
        this.nextStep = false;
        this.prevStep = true;
      }
    },
    discountCode(val) {
      if (val) this.discountText = 'add';
      this.discountError = null;
      this.discountSuccess = null;
    },
    discountError(val) {
      if (val) this.discountText = 'clear';
    },
    discountSuccess(val) {
      if (val) this.discountText = 'remove';
    },
    paymentError(val) {
      if (val) this.processing = false;
    },
  },
};
</script>

<style lang="scss">
.order-form {
  &__discount {
    .el-input-group__append {
      background-color: transparent;
      padding: 0 1rem;
      span.error {
        color: #FF0606;
      }
      span {
        color: $color-orange;
        cursor: pointer;
      }
    }
    .el-input-group--append {
      input {
        border-right-color: transparent !important;
      }
    }
    .el-input__inner:focus {
      border-color:rgba(0,0,0,.2);
    }
  }
  &__discount.success {
    .el-input-group__append {
      border-color: $secondary-color;
    }
    .el-input-group--append {
      input {
        border-color: $secondary-color;
      }
    }
  }
  &__discount.error {
    .el-input-group__append {
      border-color: #FF0606;
    }
    .el-input-group--append {
      input {
        border-color: #FF0606;
      }
    }
  }
}
.is-disabled {
  .el-input-group__append {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #c0c4cc;
    cursor: not-allowed;

    span {
      cursor: inherit;
    }
  }
}
</style>

<style lang="scss" scoped>
header {
  margin: 0;
  padding: 30px 20px 0;
  h3 {
    font-weight: normal;
    font-size: 1.8rem;
  }
}
.order-form {
  &__container {
    padding: 0 5rem;
    @media screen and (max-width: 480px) {
      padding: 0 3rem;
    }
  }
  &__total, &__cta {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  &__total {
    display: none;
    padding: 0 20px;
    span {
      font-size: 1.2rem;
    }
    p {
      font-size: 1.3rem;
      margin: 0;
    }
  }
  &__amount {
    font-weight: bold;
    font-size: 1.6rem;
    margin: 2px 0 0;
  }
  &__discount {
    margin-top: 2rem;
    .message {
      margin-top: 0.5rem;
      font-size: 12px;
      color: $secondary-color;
    }
    .message.error {
      color: #FF0606;
    }
  }
}

.horizontal--line {
  height: 1px;
  background: rgba($color: #000000, $alpha: 0.2);
  width: 100%;
  margin-top: -22px;
  @media screen and (max-width: 480px) {
    display: none;
  }
}
.order-btn__web {
  margin-top: 4rem;
}
</style>
