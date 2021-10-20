<template>
  <span>
    <button
      class="subscription__link"
      @click.prevent="restartSubscription"
      >
      {{ text }}
    </button>
    <span key="loader">
      <span
      v-loading="loading"
      v-loading.fullscreen="loading"
      >
      </span>
    </span>
  </span>
</template>

<script>
import SubscriptionPlan from '@/mixins/SubscriptionPlan';
import Auth from '@/helpers/auth';
import FETCH_TIX_PLANS from '@/graphql/TixPro/FetchTixPlans.gql';
import CREATE_CANCELLATION from '@/graphql/TixPro/CreateCancellation.gql';
import ErrorHandler from '@/helpers/error-handler';
import FETCH_CANCELLATION_REASONS from '@/graphql/TixPro/FetchCancellationReasons.gql';
import Payment from '@/mixins/Payment';

export default {
  name: 'subscription-link',
  props: {
    text: String,
    frequency: String,
  },
  mixins: [SubscriptionPlan, Payment],
  data() {
    return {
      user: Auth.currentUser,
      plans: [],
      loading: false,
      cancellationReasons: [],
    };
  },
  computed: {
    userPlan() {
      return this.frequency === 'monthly' ? this.monthly : this.annually;
    },
    monthly() {
      return this.plans.length > 0 ? this.plans.find(plan => plan.interval === 'monthly') : { plan_code: '' };
    },
    annually() {
      return this.plans.length > 0 ? this.plans.find(plan => plan.interval === 'annually') : { plan_code: '' };
    },
  },
  apollo: {
    plans: {
      query: FETCH_TIX_PLANS,
      update: data => data.fetchPaystackSubscriptionPlans,
      fetchPolicy: 'network-only',
    },
    cancellationReasons: {
      query: FETCH_CANCELLATION_REASONS,
      update: data => data.cancellationReasons,
      fetchPolicy: 'network-only',
    },
  },
  methods: {
    otherCancellationReasonID() {
      const other = this.cancellationReasons.find(c => c.reason === 'other');
      return other.id;
    },
    restartSubscription() {
      this.loading = true;
      if (['in_grace_period', 'pro'].includes(this.subscription)) {
        this.$apollo.mutate({
          mutation: CREATE_CANCELLATION,
          variables: {
            cancellationReason: this.otherCancellationReasonID(),
            customCancellationReason: 'restart subscription',
          },
        }).then(() => {
          this.loading = false;
          this.subscribe();
        }).catch((error) => {
          this.loading = false;
          ErrorHandler.throwGraphQLError(error);
        });
      }
    },
    subscribe() {
      const { plan_code } = this.userPlan;
      this.loadPaystackPlanPayment(plan_code)
        .then((response) => {
          if (response.status === 'success') {
            this.$router.go();
          }
        }).catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.subscription {
  &__link {
    color: $color-orange;
    font-size: 1.4rem;
    line-height: 1.2;
    border: none;
    background: $--color-white;
    padding: 0;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
