<template>
  <div>
    <navigation></navigation>
    <main>
      <div class="u-bounds">
        <header class="pricing--header">
          <h1>simple, straightforward pricing</h1>
          <div class="pricing--header__select">
            <p>select country</p>
            <select v-model="selectedCountry">
              <option 
                v-for="(option, index) in tixCountries"
                :key="index"
                :value="option.country"
              >
              {{ option.countryLong }}
              </option>
            </select>
          </div>
        </header>
        <div>
          <div class="pricing--cards">
            <div class="pricing--image">
              <img src="@/assets/landing.png" alt="Tix Pricing">
            </div>
            <div class="pricing--carousel">
              <span class="pricing--carousel__btn rotate" v-if="showArrowLeft" @click="previous">
                <img src="@/assets/chevron-right.svg" alt="Chevron">
              </span>
              <pricing-card :pricing="pricing[Math.abs(index) % pricing.length]" />
              <span class="pricing--carousel__btn" v-if="showArrowRight" @click="next">
                <img src="@/assets/chevron-right.svg" alt="Chevron">
              </span>
            </div>
          </div>
          <div class="pricing--mobile">
            <pricing-card v-for="(option, index) in pricing" :key="index" :pricing="option" />
          </div>
          <div class="pricing--compare">
            <div @click="compare(showComparison)">
              <span>{{ showComparison ? 'hide' : 'compare' }} all our features</span>
              <img src="@/assets/arrow2.svg" alt="Arrow">
            </div>
          </div>
        </div>
        <transition name="fade">
          <div class="mt" v-show="showComparison" ref="compare">
            <header class="pricing--header">
              <h1>compare features</h1>
            </header>
            <price-comparison :tixProPricing="tixProPricing" :countryFees="countryFees" />
          </div>
        </transition>
        <div class="footer-block">
          <el-footer></el-footer>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import PricingCard from '@/components/Pricing/PricingCard';
import PriceComparison from '@/components/Pricing/PriceComparison';
import { countriesFees } from '@/helpers/auth';

export default {
  components: {
    PricingCard,
    PriceComparison,
  },
  mounted() {
    window.setInterval(() => { this.count += 1; }, 1000);
  },
  data() {
    return {
      index: 0,
      count: 0,
      showComparison: false,
      selectedCountry: 'NG',
    };
  },
  computed: {
    showArrowLeft() {
      return Math.abs(this.index) % this.pricing.length !== 0;
    },
    showArrowRight() {
      return Math.abs(this.index) % this.pricing.length !== 2;
    },
    proPricingText() {
      return `${this.countryFees.proPercentage} ${this.countryFees.flatFee ? `+ ${this.countryFees.currency} ${this.countryFees.flatFee} fee` : ''} per paid ticket`.toLowerCase();
    },
    freePricingText() {
      return `${this.countryFees.freePercentage} ${this.countryFees.flatFee ? `+ ${this.countryFees.currency} ${this.countryFees.flatFee} fee` : ''} per paid ticket`.toLowerCase();
    },
    tixProPricing() {
      return `${this.countryFees.currency} ${this.countryFees.monthlyPlan}/month`.toLowerCase();
    },
    pricing() {
      return [
        {
          title: 'tix free',
          color: 'pink',
          subtitle: 'free forever',
          contents: [
            { title: 'unlimited free events' },
            { title: 'unlimited paid events' },
            { title: 'unlimited ticket types' },
            { title: 'private (invite only) events' },
            { title: 'custom event page url' },
            { title: 'custom field on check out form' },
            { title: 'detailed exports of all data' },
            { title: 'mobile app for attendee check in' },
            { title: this.freePricingText },
          ],
        },
        {
          title: 'tix pro',
          color: 'yellow',
          subtitle: this.tixProPricing,
          contents: [
            { title: 'everything on the free plan plus:' },
            { title: this.proPricingText },
            { title: 'recurring event types' },
            { title: '1:1 event types' },
            { title: 'discount codes' },
            { title: 'waitlists' },
            { title: 'premium zoom integration' },
          ],
        },
        {
          title: 'custom add ons',
          color: 'light-blue',
          button: true,
          contents: [
            { title: 'event staffing' },
            { title: 'assigned seat ticketing' },
            { title: 'event wristbands' },
            { title: 'equipment rentals' },
            { title: 'apis and white labelling' },
            { title: 'rfid access control' },
            { title: 'rfid cashless payments' },
          ],
        },
      ];
    },
    tixCountries() {
      return countriesFees;
    },
    countryFees() {
      return this.tixCountries.find(val => val.country === this.selectedCountry);
    },
  },
  methods: {
    compare(val) {
      this.showComparison = !this.showComparison;
      if (!val) {
        const compare = this.$refs.compare;
        this.$nextTick(() => {
          compare.scrollIntoView({ behavior: 'smooth' });
        });
      }
    },
    next() {
      this.index += 1;
      this.count = 1;
    },
    previous() {
      this.index -= 1;
      this.count = 1;
    },
  },
  watch: {
    count() {
      if (this.count % 10 === 0) {
        this.next();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .u-bounds {
    padding-top: 1.8rem;
    padding-bottom: 0;
  }
  .pricing--header {
    text-align: center;
    margin-top: 2em;
    font-weight: 300;
    h2 {
      margin-top: 1.8rem;
    }
    &__select {
      margin-top: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      p {
        margin-right: 2.5rem;
      }
      select {
        background-color: $color-orange;
        color: white;
        border-color: $color-orange;
        padding: 0.5rem 0;
        font-size: 16px;
        border-radius: none;
      }
      @media screen and (max-width: 767px) {
        p, select {
          font-size: 12px;
        }
      }
    }
  }
  .pricing--cards {
    display: flex;
    justify-content: space-between;
  }
  .pricing--image {
    margin-top: 2.6rem;
    width: 45%;
    img {
      width: 100%
    }
    @media screen and (max-width: 767px) {
      display: none;
    }
  }
  .pricing--carousel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 45%;
    &__btn {
      cursor: pointer;
    }
    @media screen and (max-width: 767px) {
      display: none;
    }
  }
  .pricing--compare {
    margin-top: 2rem;
    margin-left: 57%;
    div {
      cursor: pointer;
    }
    span {
      font-size: 14px;
      color: $secondary-color;
      margin-right: 7.5px;
    }
    @media screen and (max-width: 767px) {
      display: none;
    }
  }
  .pricing--mobile {
    display: none;
    @media screen and (max-width: 767px) {
      display: block;
    }
  }
  .rotate {
    transform: rotate(180deg);
  }
  .footer-block {
    width: 46%;
    margin: 7.1rem 0 3.5rem auto;
    @media screen and (max-width: 767px) {
      width: 70%;
      margin-left: 0;
    }
    @media screen and (max-width: 480px) {
      width: 100%;
    }
  }
  .mt {
    margin-top: 6rem;
  }
</style>
