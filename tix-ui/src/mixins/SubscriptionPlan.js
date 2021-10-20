import Auth from '@/helpers/auth';

const SubscriptionPlan = {
  data() {
    return {
      subscription: Auth.subscriptionState(),
    };
  },
  computed: {
    freePlan() {
      return this.subscription === 'free';
    },
    downgradedUser() {
      return this.subscription === 'downgraded';
    },
    inGracePeriod() {
      return this.subscription === 'in_grace_period';
    },
  },
};

export default SubscriptionPlan;
