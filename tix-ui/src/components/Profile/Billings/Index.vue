<template>
  <div class="billings-tab">
    <div class="billings-tab-section__header">
      <form-header subtitle="your plan" />
      <div class="horizontal--line">
      </div>
    </div>
    <billings-plan-header
      :amount="amount"
      :nextBillingRetryDate="userSubscription.nextBillingRetryDate"
      :frequency="userSubscription.frequency"
      :nextPaymentDate="userSubscription.nextPaymentDate"
      :last_four_digits="userSubscription.last_four_digits"
    />
    <div>
      <billings-cta
        :frequency="userSubscription.frequency"
        :nextPaymentDate="userSubscription.nextPaymentDate"
      />
    </div>
    <div class="billings-tab-section__header">
      <form-header subtitle="your invoices" />
      <div class="horizontal--line">
      </div>
    </div>
    <billings-invoice />
  </div>
</template>

<script>
import SubscriptionPlan from '@/mixins/SubscriptionPlan';
import gql from 'graphql-tag';
import FormHeader from '@/components/Global/FormHeader';
import { formatKoboToActualValue } from '@/helpers/utility';
import BILLING_DETAILS from '@/graphql/TixPro/FetchBillingDetails.gql';
import BillingsPlanHeader from './PlanHeader';
import BillingsInvoice from './Invoice/Index';
import BillingsCta from './Cta/Index';

export default {
  name: 'billings-section',
  mixins: [SubscriptionPlan],
  components: {
    FormHeader,
    BillingsPlanHeader,
    BillingsInvoice,
    BillingsCta,
  },
  data() {
    return {
      userSubscription: {},
    };
  },
  computed: {
    amount() {
      return this.userSubscription.amount ?
                  formatKoboToActualValue(this.userSubscription.amount) : null;
    },
  },
  mounted() {
    this.fetchBillingDetails();
  },
  methods: {
    fetchBillingDetails() {
      if (!this.freePlan) {
        this.$apollo.query({
          query: gql`${BILLING_DETAILS}`,
          fetchPolicy: 'network-only',
        }).then((response) => {
          this.userSubscription = response.data.fetchSubscription;
        });
      }
    },
  },
};
</script>

<style lang="scss">
.billings-tab {
  max-width: 70rem;
  &__header {
    margin-bottom: 1.5rem;
  }
  &-section {
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1.6rem;
      @media screen and (max-width: 767px) {
        width: max-content; 
        padding-bottom: 0.5em;
        margin-bottom: 1.25em;
        border-bottom: 1px solid $--color-green;
      }
    }
  }
  &-plan {
    &__description {
      text-transform: lowercase;
      font-size: 1.2rem;
      margin: 1.5rem 0;
    }
  }
  @media screen and (min-width: 768px) {
    padding-top: 2.3rem;
    &-plan {
      &__description {
        font-size: 1.4rem;
      }
    }
  }
}
.billings-tab-header__pro-only {
  display: none;
}
.active-link {
  color: $color-orange;
}
.skeleton-animation {
  width: 100%;
  &-sm {
    width: 20%;
    margin-top: 0.2rem;
  }
}
.horizontal--line {
  height: 1px;
  width: 68%;
  background-color: $--color-green;
  @media screen and (max-width: 767px) {
    display: none;
  }
}
</style>
