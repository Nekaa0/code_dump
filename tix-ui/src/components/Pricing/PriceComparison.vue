<template>
  <div class="price--comparison">
    <div class="price--comp__feature mb-sticky">
      <div class="price--comp__feature--list">
        <h2>full feature list</h2>
      </div>
      <div class="price--comp__feature--free">
        <h2>tix free</h2>
        <small>free forever</small>
      </div>
      <div class="price--comp__feature--free">
        <h2>tix pro</h2>
        <small>{{ tixProPricing }}</small>
      </div>
    </div>
    <div class="price--comp" v-for="(option, index) in features" :key="index">
      <div class="price--comp__title">
        <tix-pro-star :color="`${index % 2 === 0 ? '#038595' : '#FC6435'}`" :height="24" :width="24" />
        <p>{{ option.title }}</p>
      </div>
      <div class="price--comp__feature">
        <div class="price--comp__feature--list">
          <div v-for="(feature, index) in option.feature" :key="index">
            <a v-if="feature.link" :href="feature.link" target="__blank">{{ feature.title }}</a>
            <span v-else>{{ feature.title }}</span>
            <span>
              <el-tooltip :content="feature.info" placement="top" v-if="feature.info">
                <img src="@/assets/info.svg" alt="Info" />
              </el-tooltip>
            </span>
          </div>
        </div>
        <div class="price--comp__feature--free">
          <div v-for="(free, index) in option.free" :key="index">
            <p v-if="free.text">{{ free.text }}</p>
            <span v-if="free.verified" class="check">
              <img src="@/assets/check.svg" alt="Check">
            </span>
            <p v-else-if="!free.verified && !free.text">-</p>
          </div>
        </div>
        <div class="price--comp__feature--free">
          <div v-for="(pro, index) in option.pro" :key="index">
            <p v-if="pro.text">{{ pro.text }}</p>
            <span v-if="pro.verified" class="check">
              <img src="@/assets/check.svg" alt="Check">
            </span>
            <p v-else-if="!pro.verified && !pro.text">-</p>
          </div>
        </div>
      </div>
    </div>

    <p class="price--comp__footer">
      have questions?
      <router-link :to="{name: ''}">contact us</router-link>
    </p>
  </div>
</template>

<script>
import { Tooltip } from 'element-ui';
import TixProStar from '@/components/Global/Icons/TixProStar';

export default {
  props: {
    tixProPricing: String,
    countryFees: Object,
  },
  components: {
    ElTooltip: Tooltip,
    TixProStar,
  },
  data() {
    return {
    };
  },
  computed: {
    proPricingText() {
      return `${this.countryFees.proPercentage} ${this.countryFees.flatFee ? `+ ${this.countryFees.currency} ${this.countryFees.flatFee}` : ''}`.toLowerCase();
    },
    freePricingText() {
      return `${this.countryFees.freePercentage} ${this.countryFees.flatFee ? `+ ${this.countryFees.currency} ${this.countryFees.flatFee}` : ''}`.toLowerCase();
    },
    features() {
      return [
        {
          title: 'event types',
          feature: [
            {
              title: 'free events',
            },
            {
              title: 'paid events',
            },
            {
              title: 'private (invite only) events',
            },
            {
              title: 'recurring events',
              link: 'https://intercom.help/tixafrica/en/articles/5191777-how-to-create-a-recurring-event',
              info: 'create one listing for an event that occurs over multiple recurring days',
            },
            {
              title: '1:1 events',
              // link: 'https://intercom.help/tixafrica/en/articles/5191778-how-to-create-a-1-1-event',
              info: 'create one on one sessions where attendees can book personal free/paid time with you',
            },
          ],
          free: [
            {
              text: 'unlimited',
            },
            {
              text: 'unlimited',
            },
            {
              text: 'unlimited',
            },
            {
              verified: false,
            },
            {
              verified: false,
            },
          ],
          pro: [
            {
              text: 'unlimited',
            },
            {
              text: 'unlimited',
            },
            {
              text: 'unlimited',
            },
            {
              verified: true,
            },
            {
              text: 'coming soon',
            },
          ],
        },
        {
          title: 'selling tickets',
          feature: [
            {
              title: 'fee per free ticket',
            },
            {
              title: 'fee per paid ticket',
            },
            {
              title: 'pass online ticket fees to attendees',
            },
            {
              title: 'ability to manage ticket inventory',
            },
          ],
          free: [
            {
              text: 'free',
            },
            {
              text: this.freePricingText,
            },
            {
              verified: true,
            },
            {
              verified: true,
            },
          ],
          pro: [
            {
              text: 'free',
            },
            {
              text: this.proPricingText,
            },
            {
              verified: true,
            },
            {
              verified: true,
            },
          ],
        },
        {
          title: 'virtual events',
          feature: [
            {
              title: 'basic zoom integration',
              info: 'we\'re integrated directly to zoom so you can create a zoom link with for up to 100 guests with just your tix account',
            },
            {
              title: 'premium zoom integration',
              info: 'connect your zoom account to automatically generate zoom event links in your tix events',
            },
          ],
          free: [
            {
              verified: true,
            },
            {
              verified: false,
            },
          ],
          pro: [
            {
              verified: true,
            },
            {
              verified: true,
            },
          ],
        },
        {
          title: 'customizations',
          feature: [
            {
              title: 'custom event page url',
            },
            {
              title: 'custom fields on check out form',
            },
            {
              title: 'customizable order confirmation email',
            },
          ],
          free: [
            {
              verified: true,
            },
            {
              text: '1',
            },
            {
              verified: true,
            },
          ],
          pro: [
            {
              verified: true,
            },
            {
              text: 'unlimited',
            },
            {
              verified: true,
            },
          ],
        },
        {
          title: 'tracking and management',
          feature: [
            {
              title: 'discount codes',
            },
            {
              title: 'detailed export of all data',
            },
            {
              title: 'sales summary dashboard',
            },
            {
              title: 'mobile apps for attendee check in',
              link: 'http://onelink.to/hde9dq',
            },
            {
              title: 'manage waitlist for sold out events',
            },
          ],
          free: [
            {
              text: '1',
            },
            {
              verified: true,
            },
            {
              verified: true,
            },
            {
              verified: true,
            },
            {
              verified: false,
            },
          ],
          pro: [
            {
              verified: true,
            },
            {
              verified: true,
            },
            {
              verified: true,
            },
            {
              verified: true,
            },
            {
              text: 'coming soon',
            },
          ],
        },
        {
          title: 'promotion and growth',
          feature: [
            {
              title: 'social sharing tools',
            },
            {
              title: 'emails to attendees',
            },
            {
              title: 'automated event reminders',
            },
            {
              title: 'search engine optimisation',
            },
            {
              title: 'public listing on tix for event discovery',
            },
          ],
          free: [
            {
              verified: true,
            },
            {
              verified: true,
            },
            {
              verified: true,
            },
            {
              verified: true,
            },
            {
              verified: true,
            },
          ],
          pro: [
            {
              verified: true,
            },
            {
              verified: true,
            },
            {
              verified: true,
            },
            {
              verified: true,
            },
            {
              verified: true,
            },
          ],
        },
        {
          title: 'support and security',
          feature: [
            {
              title: 'email and chat support',
            },
            {
              title: 'phone support',
            },
            {
              title: 'card payments',
              info: 'attendees can make a secure online payments using their visa, mastercard or verve cards and have their payment confirmed instantly',
            },
            {
              title: 'bank transfer payments',
              info: 'attendees can make a bank transfer to our virtual account and have their payment confirmed instantly',
            },
            {
              title: 'ussd payments',
              info: 'attendees can make an offline payment using ussd and have their payment confirmed instantly',
            },
            {
              title: 'secure payment processing (PCI-DSS 3.2 Level 1 compliance)',
              info: 'this is the highest, most stringent level of certification possible in the global payments industry',
            },
          ],
          free: [
            {
              verified: true,
            },
            {
              verified: false,
            },
            {
              verified: true,
            },
            {
              verified: true,
            },
            {
              verified: true,
            },
            {
              verified: true,
            },
          ],
          pro: [
            {
              verified: true,
            },
            {
              verified: true,
            },
            {
              verified: true,
            },
            {
              verified: true,
            },
            {
              verified: true,
            },
            {
              verified: true,
            },
          ],
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
.price--comparison {
  margin-top: 3rem;
}
.price--comp {
  font-weight: 300;
  font-size: 18px;
  margin-bottom: 4rem;
  &__title {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    p {
      margin-left: 1rem;
    }
  }
  &__feature {
    display: flex;
    justify-content: space-between;
    a {
      color: $color-orange;
      text-decoration: underline;
    }
    a, span, p {
      line-height: 1.5;
    }
    h2 {
      font-weight: normal;
      font-size: 20px;
    }
    small {
      font-weight: 300;
      font-size: 14px;
    }
    &--list {
      width: 50%;
      div {
        padding: 0.75rem 0;
        border-bottom: 0.5px solid rgba($color-orange, 0.3);
      }
    }
    &--free {
      width: 25%;
      text-align: center;
      div {
        padding: 0.75rem 0;
        border-bottom: 0.5px solid rgba($color-orange, 0.3);
      }
    }
  }
  .check {
    line-height: 0;
    img {
      height: 23px;
    }
  }
  &__footer {
    text-align: center;
    font-weight: 300;
    font-size: 20px;

    a {
      color: $color-orange;
      font-weight: 400;
    }
  }
}
.mb-sticky {
  margin-bottom: 3rem;
  padding-top: 3rem;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 100;
  background-color: white;
}
</style>
