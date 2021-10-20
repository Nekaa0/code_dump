<template>
  <div class="billings-tab__header">
    <div v-if="inGracePeriod">
      <h2 class="billings-tab-plan__description">
        we are unable to renew your subscription,
        please update your payment card
        <span>
          <subscription-link
          :frequency="frequency"
          :text="'here'"
          />
        </span>
        to restart your subscription.
      </h2>
      <h2 class="billings-tab-plan__description">
        <div class="skeleton-animation" v-if="!nextBillingRetryDate"></div>
        <span v-else>
          we will attempt to charge your card again on {{ formatNextBillingRetryDate }}.
        </span>
      </h2>
    </div>
    <billing-downgrade
      v-else-if="downgradedUser"
      :nextPaymentDate="nextPaymentDate"
    />
    <div v-else>
      <h2 class="billings-tab-plan__description">
        <div class="skeleton-animation" v-if="isFetching"></div>
        <div class="skeleton-animation skeleton-animation-sm" v-if="isFetching"></div>
        <span v-else>
          you’re on the
          {{ freePlan ? "free" : "tix pro" }}
          plan
          <span v-if="!freePlan">for {{ billingPrice }}</span>
          and are charged
          {{ freePlan ? "nothing per month" : `${frequency}` }}.
        </span>
      </h2>
      <h2 class="billings-tab-plan__description" v-if="freePlan">
        subscribe to pro to get everything on the free plan plus 
        lower transaction processing fees on paid tickets and more 
        event management tools. check out our pricing packages 
        <router-link :to="{ name: 'Pricing' }" class="active-link"
          >here</router-link
        >.
      </h2>
      <h2 class="billings-tab-plan__description" :class="{ 'billings-tab-header__pro-only' : freePlan }">
        <div class="skeleton-animation" v-if="isFetching"></div>
        <div class="skeleton-animation skeleton-animation-sm" v-if="isFetching"></div>
        <span v-else>
          your subscription will renew on {{ formatNextPaymentDate }} and will be
          charged to your card ending in {{ last_four_digits }}.
        </span>
      </h2>
    </div>
    <a href="https://paystack.com/pay/9iqlioarx-" target="__blank" v-if="showHiddenLink">Subscribe to hourly plan</a>
  </div>
</template>

<script>
import SubscriptionPlan from '@/mixins/SubscriptionPlan';
import { formatToMoney, formatDate } from '@/helpers/utility';
import Country from '@/mixins/Country';
import BillingDowngrade from './Downgrade';
import SubscriptionLink from '../../Global/TixPro/SubscriptionLink';

export default {
  name: 'billings-plan-header',
  props: {
    amount: String,
    frequency: String,
    nextPaymentDate: Number,
    last_four_digits: String,
    nextBillingRetryDate: Number,
  },
  mixins: [SubscriptionPlan, Country],
  components: {
    BillingDowngrade,
    SubscriptionLink,
  },
  computed: {
    showHiddenLink() {
      return window.location.href.indexOf('tix-staging.netlify.app') !== -1;
    },
    isFetching() {
      if (!this.freePlan) {
        return !this.nextPaymentDate;
      }
      return false;
    },
    billingPrice() {
      return formatToMoney(this.amount, this.currency, 0);
    },
    formatNextPaymentDate() {
      return formatDate(this.nextPaymentDate);
    },
    formatNextBillingRetryDate() {
      return formatDate(this.nextBillingRetryDate);
    },
  },
};
</script>
