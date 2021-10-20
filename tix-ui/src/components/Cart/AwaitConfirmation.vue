<template>
  <section>
    <cart-header title="checkout" message="awaiting confirmation" :image="image" />
    <div class="summary">
      <p>hi {{ buyerFirstName }},</p>
      <p>almost there! We haven’t received a definite payment status but we’ll get it soon.</p>
      <p>you will receive an email with your tickets as soon as your transaction status is confirmed.</p>
      <p>if your account has already been debited but you don’t receive an order confirmation in 12 hours, please send us at email at 
        <a href="mailto:support@tix.africa">support@tix.africa</a>
      </p>
    </div>
  </section>
</template>

<script>
import CartHeader from '@/components/Cart/CartHeader';

export default {
  props: {
    buyerFirstName: String,
  },
  components: {
    CartHeader,
  },
  data() {
    return {
      image: 'approval.svg',
    };
  },
  methods: {
    awaitConfirmation() {
      const socket = new WebSocket(process.env.ACTION_CABLE_URL);
      socket.onmessage = (event) => {
        console.log(event);
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.summary {
  padding: 0 5rem;
  font-weight: 300;
  font-size: 14px;
  p {
    margin-bottom: 1.5rem;
    text-transform: lowercase;
  }
  a {
    color: $color-orange;
    font-weight: 500;
  }
}
</style>