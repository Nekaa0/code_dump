<template>
  <section class="billings-cta__block">
    <h3 class="billings-cta__header">change your subscription</h3>
    <downgrade-to-free v-if="!freePlan" :nextPaymentDate="nextPaymentDate" />
    <upgrade-to-pro v-else />
  </section>
</template>

<script>
import SubscriptionPlan from '@/mixins/SubscriptionPlan';
import DowngradeToFree from './DowngradeToFree';
import UpgradeToPro from './UpgradeToPro';

export default {
  name: 'billing-cta',
  components: {
    DowngradeToFree,
    UpgradeToPro,
  },
  mixins: [SubscriptionPlan],
  props: {
    nextPaymentDate: Number,
  },
  methods: {
    upgradeTopro() {
      if (!this.isPhone) {
        this.openBillingPopup = true;
      } else {
        this.openMobileBillingView = true;
      }
    },
  },
};
</script>

<style lang="scss">
.billings {
  &-cta {
    width: 17.1rem;
    padding: 8px 9px;
    font-size: 1.4rem;
    &__block {
      margin-top: 2rem;
      margin-bottom: 5.2rem;
    }
    &__header {
      font-size: 1.4rem;
      margin-bottom: 2rem;
      font-weight: 400;
    }
  }
}
</style>
