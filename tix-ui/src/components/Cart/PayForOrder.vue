<template>
  <section>
    <div class="frame">
      <div class="summary">
        <p>hi {{ buyerFirstName.toLowerCase() }},</p>
        <p>we’ve reserved your ticket{{ quantity > 1 ? 's' : '' }} please make payment within
          <span class="summary__timer">{{ formattedCountdown }}</span>
          to secure your tickets.
        </p>
      </div>
      <order-summary :ticketsPurchased="ticketsPurchased" :price="price" :orderCost="orderCost" :currency="currency" />
      <el-row>
        <el-button type="default" @click.prevent="cancel" :loading="cancelling" :disabled="processing">
          <span>back</span>
        </el-button>
        <el-button native-type="submit" type="primary" @click.prevent="payForOrder" :loading="processing || !paystackPopup" :disabled="processing || cancelling || !paystackPopup">
          <span v-if="!processing">pay - {{ totalCost | currency(currency, 0, { spaceBetweenAmountAndSymbol: true })}}</span>
        </el-button>
      </el-row>
    </div>
  </section>
</template>

<script>
import * as ActionCable from 'actioncable';
import OrderSummary from '@/components/Cart/OrderSummary';
import CartHeader from '@/components/Cart/CartHeader';
import Payment from '@/mixins/Payment';

export default {
  name: 'pay-for-order',
  mixins: [Payment],
  components: {
    CartHeader,
    OrderSummary,
  },
  props: {
    id: String,
    shortId: String,
    status: String,
    quantity: [Number, String],
    buyerEmail: String,
    buyerFirstName: String,
    buyerLastName: String,
    buyerPhoneNumber: String,
    price: [Number, String],
    ticketSchedules: Object,
    qrCodes: Array,
    qrCodeNos: Array,
    createdAt: [Number, String],
    inviteeId: String,
    timeout: Object,
    closeCart: Boolean,
    event: Object,
    order: Object,
    orderCost: Object,
  },
  data() {
    return {
      cancelling: false,
      processing: false,
      cable: null,
      timer: null,
      countdown: this.timeout.sessionTimeout,
    };
  },
  beforeDestroy() {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  },
  created() {
    if (this.status === 'complete') {
      this.$emit('complete', this.$props);
    } else {
      this.timer = setInterval(() => {
        this.countdown = this.countdown - 1;
        if (this.countdown === 0) {
          window.clearInterval(this.timer);
          this.countdown = null;
          this.timeoutExpired();
        }
      }, 1000);
      this.cable = ActionCable.createConsumer(`${process.env.ACTION_CABLE_URL}/cable?order=${this.id}`);
      this.cable.subscriptions.create({ channel: 'OrderChannel' }, {
        connected(response) {
          console.log('connected: ', response);
        },
        received(response) {
          console.log('received: ', response);
        },
      });
    }
  },
  computed: {
    successMessage() {
      return 'checkout';
    },
    formattedCountdown() {
      return new Date(this.countdown * 1000).toISOString().substr(14, 5);
    },
    ticketsPurchased() {
      return this.ticketSchedules.edges.map(value => value.node);
    },
    paymentProvider() {
      return this.event.user.paymentProvider;
    },
    totalCost() {
      return this.orderCost.subtotal;
    },
  },
  methods: {
    payForOrder() {
      this.processing = true;
      const order = {
        id: this.id,
        buyerFirstName: this.buyerFirstName,
        buyerLastName: this.buyerLastName,
        buyerEmail: this.buyerEmail,
        buyerPhoneNumber: this.buyerPhoneNumber,
        inviteeId: this.inviteeId,
        price: this.price,
      };
      const payment = this.paymentProvider === 'paystack' ? this.loadPaystackCheckout : this.loadFlutterwaveCheckout;
      payment(order)
        .then((response) => {
          this.$emit('complete', response.status);
          this.processing = false;
        })
        .catch((error) => {
          console.log(error);
          this.processing = false;
        });
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
        this.emitCancel();
      }).catch(() => {
        this.cancelling = false;
        this.$emit('keepCart');
      });
    },
    emitCancel() {
      this.$message({
        type: 'error',
        message: 'order cancelled',
      });
      this.$emit('cancel');
    },
  },
  watch: {
    closeCart(val) {
      if (val) {
        this.cancel();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.frame {
  padding: 0 5rem;
}
.summary {
  margin-bottom: 3.5rem;
  &__item {
    padding: 20px 0;
    margin: 0 0 20px;
    border: solid 1px rgba($color: #000000, $alpha: 0.07);
    border-width: 1px 0;
    font-weight: bold;
    i {
      float: right;
      color: $color-green;
    }
  }
  @include keyframes(highlightTimer) {
    0%, 80% {
      background: #fff2ef;
    }
  }
  p {
    font-size: 14px;
    font-weight: 300;
    margin-bottom: 1.5rem;
  }
  &__timer {
    font-weight: bold;
    width: 4.6rem;
    text-align: center;
    display: inline-block;
    color: $color-orange;
    @include animation('highlightTimer 5s');
  }
}
</style>
