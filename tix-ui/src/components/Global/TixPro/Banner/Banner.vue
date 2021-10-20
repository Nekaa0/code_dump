<template>
  <transition name="fade">
    <div class="tix-pro">
      <div class="hide-on-desktop">
        <navigation v-if="bannerInfo.openMobileBannerView"></navigation>
      </div>
      <div class="tix-pro-banner">
        <div class="tix-pro__description">
          <header class="tix-pro-banner__header">
            <div class="tix-pro-banner__header__title">
              <span class="tix-pro-star">
                <tix-pro-icon :width="34" :height="33" />
              </span>
              <h2>{{ bannerInfo.header }}</h2>
            </div>
          </header>
          <div>
            <h5 class="tix-pro-banner-list__header">on the tix pro plan, you get access to our most loved features including:</h5>
            <ul class="tix-pro-banner-list">
              <li v-for="(feature, index) in proFeatures" :key="index">
                <check-icon />
                {{ feature }}
              </li>
            </ul>
          </div>
          <p class="tix-pro-cost__text">tix pro costs {{ currency }}{{ countryFees.monthlyPlan }} per month. you can pay monthly or annually and cancel at any time.</p>
          <button class="u-button u-button--medium" @click.prevent="upgradeTopro">{{ bannerInfo.buttonText }}</button>
          <a href="" class="close-modal" @click.prevent="closeBanner">continue on tix free</a>
          <el-dialog width="664px"
            :visible.sync="openBillingPopup"
            :append-to-body="true"
            >
              <billing-popup :isPhone="bannerInfo.isPhone" />
          </el-dialog>
          <transition name="fade">
            <billing-popup v-if="bannerInfo.isPhone & openMobileBillingView" :isPhone="bannerInfo.isPhone" @back="openMobileBillingView = false" />
          </transition>
        </div>
        <div class="tix-pro__images">
          <div class="tix-pro-images__mobile">
            <img src="https://res.cloudinary.com/tix-africa/image/upload/v1615976231/tix-pro-checkout-additional-questions-mobile_lely7m.png" alt="tix pro checkout additional questions mobile">
          </div>
          <div class="tix-pro-images__desktop">
            <img src="https://res.cloudinary.com/tix-africa/image/upload/v1615976231/tix-pro-checkout-additional-questions-desktop_uccoxa.png" alt="tix pro checkout additional questions desktop">
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { Dialog } from 'element-ui';
import Country from '@/mixins/Country';
import TixProIcon from '../../Icons/TixProIcon';
import CheckIcon from '../../Icons/CheckIcon';
import BillingPopup from '../BillingPopup/Index';

export default {
  name: 'banner-body',
  mixins: [Country],
  props: {
    bannerInfo: Object,
  },
  components: {
    TixProIcon,
    CheckIcon,
    BillingPopup,
    ElDialog: Dialog,
  },
  data() {
    return {
      openBillingPopup: false,
      openMobileBillingView: false,
    };
  },
  computed: {
    proPricingText() {
      return `${this.countryFees.proPercentage} ${this.countryFees.flatFee ? `+ ${this.currency} ${this.countryFees.flatFee} fee` : ''} per paid ticket`;
    },
    proFeatures() {
      return [
        'no fees on free tickets',
        this.proPricingText,
        'create recurring events',
        'multiple custom fields on checkout',
      ];
    },
  },
  methods: {
    openProBanner() {
      if (!this.bannerInfo.isPhone) {
        this.openBillingPopup = true;
      } else {
        this.openMobileBillingView = true;
      }
    },
    upgradeTopro() {
      this.openProBanner();
    },
    closeBanner() {
      this.$emit('closeBanner');
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
  @media screen and (min-width: 600px) {
    display: none;
  }
}
.tix-pro {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: white;
  z-index:  50;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  &__images {
    position: relative;
    height: 30rem;
    background-image: url('../../../../assets/grey-mesh.svg');
  }
  &-images {
    &__mobile {
      position: absolute;
      left: 2.9rem;
      z-index: 5;
      top: 1rem;
    }
    &__desktop {
      position: absolute;
      top: 4rem;
      right: 0;
    }
  }
  &-star {
    height: 17px;
    width: 17.88px;
    svg {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  &__description {
    border-radius: 0 0 9px 9px;
  }
  &-banner {
    display: -webkit-box;
    flex-direction: column-reverse;
    padding: 2rem 2rem 3rem;
    overflow: auto;
    &__header {
      &__title {
        display: flex;
        align-items: center;
        margin-bottom: 2.3rem;
        h2 {
          margin-left: 1.2rem;
        }
      }
    }
    &-list {
      padding: 0;
      list-style-type: none;
      &__header {
        margin-bottom: 1.8rem;
      }
      li {
        margin-bottom: 1.3rem;
        font-size: 1.2rem;
        svg {
          margin-right: 7px;
        }
      }
    }
  }
  &-cost {
    &__text {
      font-size: 1.2rem;
      margin-bottom: 2.9rem;
    }
  }
}
.u-button {
  display: block;
  margin: 0 auto;
  padding: 0 2.6rem;
  width: max-content;
}
.close-modal {
  text-align: center;
  display: block;
  margin-top: 1.1rem;
  opacity: 0.5;
}
@media screen and (min-width: 600px) {
  .tix-pro {
    all: unset;
    &-star {
      height: 2rem;
      width: 2rem;
    }
    &__images {
      width: 100%;
      height: auto;
      max-width: 33rem;
    }
    &-images {
      &__mobile {
        left: 2.9rem;
        z-index: 5;
        top: 8.4rem;
      }
      &__desktop {
        top: 13rem;
        right: 9px;
      }
    }
    &-banner {
      display: flex;
      flex-direction: row;
      margin: -6rem 0 -3rem;
      border-radius: 9px;
      justify-content: space-between;
      background-color: white;
      position: relative;
      overflow: hidden;
      padding: 0;
      font-size: 1.2rem;
    }
    &__description {
      width: 100%;
      max-width: 33.4rem;
      border-radius: 9px 0 0 9px;
      padding: 3.4rem 4rem 2.6rem 2.6rem;
      margin: 0 -3.2rem 0 -2.1rem;
      height: 100%;
    }
    &-banner {
      &-list {
        &__header {
          display: block;
          font-weight: 300;
          margin-bottom: 1.8rem;
          font-size: 1.2rem;
        }
      }
      &__header {
        &__title {
          margin-bottom: 1.5rem;
          h2 {
            font-size: 1.6rem;
          }
        }
      }
    }
    &-cost {
      &__text {
        margin-bottom: 1.5rem;
        padding-bottom: 1.1rem;
        border-bottom: 0.5px solid rgba(0, 0, 0, 0.2);
        max-width: 37rem;
        font-size: 1.2rem;
      }
    }
  }
}
</style>
