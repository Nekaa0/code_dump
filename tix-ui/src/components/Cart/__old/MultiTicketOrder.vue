<template>
  <section>
    <div v-for="ticket in cart" :key="ticket.id">
      <cart-ticket :data="ticket" @update="updateCart" />
    </div>
    <el-form v-if="ticketsInCart.length" :model="formData" :rules="rules" ref="checkoutForm" class="checkout-form">
      <ul class="cart">
        <li class="cart-item" v-for="ticket in ticketsInCart" :key="ticket.id">
          <div class="cart-item__name">
            {{ ticket.count }} * {{ ticket.name }}
          </div>
          <div class="cart-item__amount">
            {{ ticket.price * ticket.count | currency('NGN', 0, { spaceBetweenAmountAndSymbol: true })}}
          </div>
        </li>
        <li class="cart-item">
          <div class="cart-item__name"><b>total - {{ticketCount}} ticket{{ticketCount === 1 ? '' : 's' }}</b></div>
          <div class="cart-item__amount">
            {{ total | currency('NGN', 0, { spaceBetweenAmountAndSymbol: true })}}
          </div>
        </li>
      </ul>
      <el-form-item label="email address" prop="buyer">
        <el-input v-model="formData.buyer" placeholder="" />
      </el-form-item>
      <el-form-item label="confirm email address" prop="buyerConfirmation">
        <el-input v-model="formData.buyerConfirmation" placeholder="" />
      </el-form-item>
      <el-row>
        <el-button native-type="submit" type="primary" @click.prevent="completeOrder" :disabled="ticketsInCart.length === 0" :loading="processing">
          <span v-if="total">pay {{ total | currency('NGN', 0, { spaceBetweenAmountAndSymbol: true })}}</span>
          <span v-else>get tickets</span>
        </el-button>
      </el-row>
    </el-form>
  </section>
</template>

<script>
import { Popup } from 'paystack-js';
import CartTicket from './CartTicket';
import CREATE_ORDER from '@/graphql/CreateOrder.gql';
import BUY_ORDER from '@/graphql/BuyOrder.gql';

export default {
  name: 'multi-cart',
  components: {
    CartTicket,
  },
  props: {
    tickets: Array,
    event: String,
  },
  data() {
    const isSameAsBuyer = (rule, value, callback) => {
      if (value !== this.formData.buyer) {
        callback(new Error('passwords must match'));
      } else {
        callback();
      }
    };

    return {
      processing: false,
      cart: this.tickets.map(ticket => Object.assign({ count: 0 }, ticket)),
      formData: {},
      rules: {
        buyer: [
          { required: true, type: 'email', trigger: 'change', message: 'please enter a valid email address' },
        ],
        buyerConfirmation: [
          { required: true, validator: isSameAsBuyer, trigger: 'change', message: 'confirm that this is the same as the email address' },
        ],
      },
    };
  },
  computed: {
    ticketsInCart() {
      return this.cart.filter(ticket => ticket.count > 0);
    },
    ticketCount() {
      return this.ticketsInCart.reduce((sum, ticket) => ticket.count + sum, 0);
    },
    total() {
      const amounts = this.ticketsInCart.map(ticket => ticket.count * ticket.price);
      return amounts.reduce((amount, sum) => sum + amount, 0);
    },
  },
  methods: {
    updateCart(value) {
      const ticket = this.cart.find(t => t.id === value.id);
      if (ticket) ticket.count = value.count;
    },
    completeOrder() {
      this.$refs.checkoutForm.validate((valid) => {
        const purchase = Object.assign({ tickets: this.ticketsInCart }, this.formData);
        if (valid) {
          this.processing = true;
          const ticketToOrder = this.cart[0]; // For now, we'll only consider the first ticket
          createOrder(ticketToOrder.id, ticketToOrder.count).then((response) => {
            ticketToOrder.order = response.data.createOrder;
            return this.payForOrder(response.data.createOrder);
          }).catch((error) => {
            this.processing = false;
            ErrorHandler.throwGraphQLError(error);
          });
        } else {
          this.$message.error('please review the errors and try again');
        }
      });
    },
    createOrder(ticket, quantity) {
      return this.$apollo.mutate({
        mutation: CREATE_ORDER,
        variables: {
          ticket,
          quantity,
        },
      });
    },
    payForOrder(order) {
      payWithPaystack().then(response => this.$apollo.mutate({
        mutation: BUY_ORDER,
        variables: {
          order: order.id,
          buyer: order.buyer,
          reference: response.reference,
        },
      }));
    },
    payWithPaystack() {
      return new Promise((resolve, reject) => {
        const params = {
          key: process.env.PAYSTACK_PUBLIC_KEY,
          amount: this.activeOrder.price * 100,
          email: this.activeOrder.buyer,
        };
        const myPopup = new Popup();
        try {
          const transaction = myPopup.newTransaction(params);
          transaction.on('success', response => resolve);
        } catch(e) {
          reject(e);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.checkout-form {
  margin-top: 20px;
  padding: 20px 0;
  border-top: solid 1px rgba($color: #000000, $alpha: 0.05);

  .cart {
    margin-bottom: 30px;
    &-item {
      display: flex;
      padding: 20px 0;
      border-bottom: 1px solid rgba($color: #000000, $alpha: 0.05);
      &__name {
        flex: 1;
      }
      &__amount {
        width: 200px;
        font-weight: bold;
        text-align: right;
      }
    }
  }
}
</style>
