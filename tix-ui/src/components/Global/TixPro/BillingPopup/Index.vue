<template>
  <div class="billing">
    <div class="hide-on-desktop">
      <navigation v-if="isPhone"></navigation>
    </div>
    <div class="billing-popup">
      <header class="billing-popup__header">
        <h3>choose your payment frequency</h3>
      </header>
      <div class="billing-popup__plans">
        <section class="billing-popup__section">
          <billing-popup-plan
            :title="'pay monthly'"
            :duration="1"
            :amount="monthlyPrice"
            :plan_code="monthly.plan_code"
            @pay="subscribe"
          />
        </section>
        <section class="billing-popup__section">
          <billing-popup-plan
            :title="'pay annually'"
            :duration="12"
            :amount="annualPrice"
            :plan_code="annually.plan_code"
            @pay="subscribe"
            >
          <p>* get one month free</p>
          </billing-popup-plan>
        </section>
      </div>
      <p class="billing-popup__footer">
        by proceeding you agree for your card to be charged monthly/annually for
        the subscription amount
      </p>
      <el-dialog width="664px"
        :visible.sync="openConfirmation"
        append-to-body
        :before-close="refreshWindow"
        >
          <tix-pro-confirmation />
      </el-dialog>
    </div>
    <div class="billing-close-button__mobile">
      <div class="back-arrow" @click.prevent="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 12H4" stroke="#FC6435" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M10 18L4 12L10 6" stroke="#FC6435" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog } from 'element-ui';
import FETCH_CURRENT_USER from '@/graphql/FetchCurrentUser.gql';
import FETCH_TIX_PLANS from '@/graphql/TixPro/FetchTixPlans.gql';
import Country from '@/mixins/Country';
import Payment from '@/mixins/Payment';
import BillingPopupPlan from './Plan';
import TixProConfirmation from './Confirmation';

export default {
  name: 'billing-popup',
  mixins: [Payment, Country],
  props: {
    isPhone: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    BillingPopupPlan,
    TixProConfirmation,
    ElDialog: Dialog,
  },
  data() {
    return {
      currentUser: {},
      plans: [],
      openConfirmation: false,
    };
  },
  apollo: {
    currentUser: {
      query: FETCH_CURRENT_USER,
      update: data => data.currentUser,
      fetchPolicy: 'network-only',
    },
    plans: {
      query: FETCH_TIX_PLANS,
      update: data => data.fetchPaystackSubscriptionPlans,
      fetchPolicy: 'network-only',
    },
  },
  computed: {
    monthly() {
      return this.plans.length > 0 ? this.plans.find(plan => plan.interval === 'monthly') : { plan_code: '' };
    },
    annually() {
      return this.plans.length > 0 ? this.plans.find(plan => plan.interval === 'annually') : { plan_code: '' };
    },
    monthlyPrice() {
      return `${this.currency} ${this.countryFees.monthlyPlan} per month`;
    },
    annualPrice() {
      return `${this.currency} ${this.countryFees.annualPlan} per year*`;
    },
  },
  methods: {
    goBack() {
      this.$emit('back');
    },
    refreshWindow() {
      window.location.reload();
    },
    subscribe(code) {
      if (this.country !== 'NG') {
        const header = 'tix pro subscription not available';
        const message = `Subscription payments are not yet available in ${this.countryFees.countryLong} contact support@tix.africa for early access.`;
        this.$confirm(message, header, {
          showCancelButton: false,
          showClose: true,
          closeOnPressEscape: true,
          closeOnClickModal: true,
        });
      } else {
        this.loadPaystackPlanPayment(code)
          .then((response) => {
            if (response.status === 'success') {
              this.openConfirmation = true;
            }
          }).catch((error) => {
            console.log(error);
          });
      }
    },
  },
};
</script>

<style lang="scss">
  body {
    @media screen and (max-width: 599px) {
      overflow: hidden;
    }
  }
</style>

<style lang="scss" scoped>
.hide-on-desktop {
  .nav {
    background: white;
  }
  @media screen and (min-width: 600px) {
    display: none;
  }
}
.billing {
  @media screen and (max-width: 599px) {
    position: fixed;
    z-index: 70;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
  }
  @media screen and (min-width: 600px) {
    margin: -6rem -3.2rem -3rem -2.1rem;
    max-width: 66.4rem;
  }
  &-close-button__mobile {
    position: absolute;
    top: 7rem;
    left: 1rem;
    .back-arrow {
      position: sticky;
      z-index: 70;
      position: -webkit-sticky;
    }
    @media screen and (min-width: 600px) {
      display: none;
    }
  }
}
.billing-popup {
  background: #EFEFEF;
  position: fixed;
  overflow: auto;
  top: 5rem;
  left: 0;
  z-index: 50;
  text-align: center;
  padding: 4.8rem 16.5% 10rem;
  height: 100%;
  &__section {
    background: $--color-white;
    border-radius: 6px;
    margin-top: 5.1rem;
    margin-bottom: 2.6rem;
    padding: 5rem 1.9rem 0.3rem;
    &:first-of-type {
      margin: 0;
    }
  }
  &__header {
    display: none;
  }
  &__footer {
    text-align: center;
    font-size: 1rem;
  }
  @media screen and (min-width: 600px) {
    position: relative;
    background: $--color-white;
    border-radius: 9px;
    color: $--color-black;
    font-weight: 300;
    padding: 3.2rem 9% 3.6rem;
    top: 0;
    left: 0;
    &__header {
      display: block;
      padding-bottom: 2.3rem;
      h3 {
        font-size: 1.6rem;
      }
    }
    &__plans {
      display: flex;
      padding-bottom: 3.3rem;
    }
    &__section {
      width: 50%;
      padding-left: 6rem;
      padding-right: 0;
      padding-top: 0;
      margin: 0;
      border-radius: 0;
      &:first-of-type {
        border-right: 0.5px solid rgba(0, 0, 0, 0.25);
        padding-right: 5.7rem;
        padding-left: 0;
        padding-top: 0;
        margin: 0;
      }
    }
    &__footer {
      opacity: 0.7;
    }
  }
}
.u-button {
  width: 12rem;
}
</style>
