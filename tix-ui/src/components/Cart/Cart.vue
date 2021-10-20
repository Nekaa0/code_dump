<template>
  <section>
    <transition name="fade" mode="out-in">
      <!-- <await-confirmation /> -->
      <choose-ticket
        v-if="!order"
        :timeout="sessionTimeout"
        :onlyFreeTickets="onlyFreeTickets"
        :windowWidth="windowWidth"
        :event="event"
        :tickets="tickets"
        :schedule="schedule"
        :inviteeId="inviteeId"
        :paymentError="paymentError"
        :automatedDiscount="automatedDiscount"
        :currency="currency"
        @cancel="removeOrder"
        @back="$emit('back')"
        @complete="updateOrder"
        @pay="payForOrder"
        @orderCost="setOrderCost"
      />
      <div v-else>
        <transition name="fade" mode="out-in">
          <order-complete
            v-if="order.status === 'complete' || paymentComplete"
            :onlyFreeTickets="onlyFreeTickets"
            :event="event"
            :windowWidth="windowWidth"
            :currency="currency"
            v-bind="receiptData"
            @back="$emit('back')"
            @newOrder="removeOrder"
          />
          <pay-for-order
            v-else
            v-bind="order"
            :timeout="sessionTimeout"
            :inviteeId="inviteeId"
            :closeCart="closeCart"
            :orderCost="orderCost"
            :event="event"
            :currency="currency"
            @cancel="removeOrder"
            @complete="updatePaymentStatus"
            @keepCart="keepCart"
          />
        </transition>
      </div>
    </transition>
  </section>
</template>

<script>
import ChooseTicket from '@/components/Cart/ChooseTicket';
import PayForOrder from '@/components/Cart/PayForOrder';
import OrderComplete from '@/components/Cart/OrderComplete';
import AwaitConfirmation from '@/components/Cart/AwaitConfirmation';
import SESSION_TIMEOUT from '@/graphql/FetchSessionTimeout.gql';
import Payment from '@/mixins/Payment';

export default {
  name: 'cart',
  mixins: [Payment],
  components: {
    ChooseTicket,
    PayForOrder,
    OrderComplete,
    AwaitConfirmation,
  },
  props: {
    tickets: Array,
    event: Object,
    inviteeId: String,
    step: String,
    closeCart: Boolean,
    schedule: Array,
    discounts: Array,
  },
  data() {
    return {
      order: null,
      windowWidth: window.innerWidth,
      timeout: {},
      paymentComplete: false,
      orderCost: null,
      paymentError: false,
    };
  },
  created() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
    });
  },
  apollo: {
    timeout: {
      query: SESSION_TIMEOUT,
      update: data => data.fetchSessionTimeout,
      fetchPolicy: 'network-only',
    },
  },
  watch: {
    status(value) {
      if (value === 'open') this.$emit('changeStep', 'pay');
      if (value === 'complete') this.$emit('complete');
    },
  },
  computed: {
    sessionTimeout() {
      return this.timeout ? this.timeout : { sessionTimeout: 600 };
    },
    automatedDiscount() {
      return this.discounts.length > 0 ? this.discounts[0] : null;
    },
    status() {
      return this.order && this.order.status;
    },
    receiptData() {
      if (!this.order) return {};
      return Object.assign({
        event: this.event,
      }, this.order);
    },
    onlyFreeTickets() {
      let onlyFree = true;
      this.tickets.forEach((ticket) => {
        if (Number(ticket.price) !== 0) {
          onlyFree = false;
        }
      });
      return onlyFree;
    },
    paymentProvider() {
      return this.event.user.paymentProvider;
    },
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    updateOrder(order) {
      this.order = order;
    },
    updatePaymentStatus(paymentStatus) {
      this.paymentComplete = (paymentStatus === 'success' || paymentStatus === 'successful' || paymentStatus === 'completed');
    },
    removeOrder() {
      this.order = null;
      this.$emit('reset');
      this.paymentComplete = false;
    },
    keepCart() {
      this.$emit('keepCart');
    },
    payForOrder(order) {
      this.paymentError = false;
      const payment = this.paymentProvider === 'paystack' ? this.loadPaystackCheckout : this.loadFlutterwaveCheckout;
      payment(order)
        .then((response) => {
          this.updateOrder(order);
          this.updatePaymentStatus(response.status);
        })
        .catch((error) => {
          console.log(error);
          this.paymentError = true;
        });
    },
    setOrderCost(cost) {
      this.orderCost = cost;
    },
  },
};
</script>

<style lang="scss" scoped>
section {
  height: 100%;
  overflow: auto;
  position: relative;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
