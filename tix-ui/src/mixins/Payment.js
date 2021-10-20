import PaystackPop from '@paystack/inline-js';
import Scripts from './Scripts';

const Payment = {
  mixins: [Scripts],
  mounted() {
    this.paystackPopup = true;
    this.loadScript('/static/scripts/flutterwave.js').then(() => {
      this.flutterwavePopup = true;
    });
  },
  data() {
    return {
      popup: null,
      paystackPopup: false,
      flutterwavePopup: false,
    };
  },
  computed: {
    currency() {
      return this.event.user.currencyShortForm || 'NGN';
    },
    country() {
      return this.event.user.country || 'NG';
    },
    payStackKey() {
      if (this.country === 'GH') return process.env.PAYSTACK_GH_PUBLIC_KEY;
      else if (this.country === 'ZA') return process.env.PAYSTACK_SA_PUBLIC_KEY;
      return process.env.PAYSTACK_NG_PUBLIC_KEY;
    },
  },
  methods: {
    loadPaystackPlanPayment(code) {
      return new Promise((resolve, reject) => {
        try {
          const params = {
            key: this.payStackKey,
            email: this.currentUser.email,
            plan: code,
            onSuccess(response) {
              resolve(response);
            },
            onCancel() {
              reject();
            },
          };
          this.popup = new PaystackPop();
          this.popup.newTransaction(params);
        } catch (e) {
          reject(e);
        }
      });
    },
    loadPaystackCheckout(orderInfo) {
      return new Promise((resolve, reject) => {
        try {
          const params = {
            key: this.payStackKey,
            amount: orderInfo.price * 100,
            email: orderInfo.buyerEmail,
            currency: this.currency,
            metadata: {
              payment_type: 'order',
              data: {
                order_id: orderInfo.id,
                invitee_id: orderInfo.inviteeId,
                buyer_email: orderInfo.buyerEmail,
              },
            },
            onSuccess(response) {
              resolve(response);
            },
            onCancel() {
              reject();
            },
          };
          this.popup = new PaystackPop();
          this.popup.newTransaction(params);
        } catch (e) {
          reject(e);
          this.$emit('keepCart');
        }
      });
    },
    loadFlutterwaveCheckout(orderInfo) {
      return new Promise((resolve, reject) => {
        try {
          const inviteeID = orderInfo.inviteeID ? orderInfo.inviteeID : '';
          const params = {
            public_key: process.env.FLUTTERWAVE_PUBLIC_KEY,
            tx_ref: orderInfo.id,
            amount: orderInfo.price,
            currency: this.currency,
            country: this.country,
            customer: {
              email: orderInfo.buyerEmail,
              phone_number: orderInfo.buyerPhoneNumber,
              name: `${orderInfo.buyerFirstName} ${orderInfo.buyerLastName} | ${inviteeID}`,
            },
            meta: {
              order_id: orderInfo.id,
              invitee_id: inviteeID,
              buyer_email: orderInfo.buyerEmail,
            },
            callback(response) {
              resolve(response);
              setTimeout(() => {
                document.getElementsByName('checkout')[0].setAttribute('style', 'position:fixed;top:0;left:0;z-index:-1;border:none;opacity:0;pointer-events:none;width:100%;height:100%;');
                document.body.style.overflow = '';
              }, 1000);
            },
            onclose() {
              reject();
            },
          };
          this.popup = window.FlutterwaveCheckout(params);
        } catch (e) {
          reject(e);
          this.$emit('keepCart');
        }
      });
    },
  },
};

export default Payment;
