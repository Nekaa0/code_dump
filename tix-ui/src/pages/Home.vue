<template>
  <div>
    <navigation></navigation>
    <main>
      <div>
        <div id="landing" class="landing">
          <div class="landing-page">
            <div class="landing-page__image">
              <div class="el-landing-web u-visible--hide-on-mobile">
                <el-landing></el-landing>
              </div>
              <div class="el-landing-mobile u-visible--mobile">
                <el-mobile-landing></el-mobile-landing>
              </div>
            </div>
            <div class="landing-page__text">
              <div class="landing-page-text__body">
                <header class="landing-page__header">
                  <h1 class="landing-page-header__title">tix.africa is a self-service ticketing platform for event creators</h1>
                  <h4 class="landing-page-header__subtitle">
                    create, share and collect payments for live or virtual events with our online ticketing tools.
                  </h4>
                </header>
                <div class="u-visible--hide-on-mobile">
                  <div class="sign-in--form">
                    <login-form @complete="goToApp" emailLabel="email" passwordLabel="password" />
                  </div>
                </div>
                <div class="u-visible--mobile">
                  <router-link class="u-button u-button--large" :to="{name: 'Signup'}">sign up</router-link>
                </div>
                <div class="landing-page__download-icons">
                  <a
                    class="landing-page__download-icon"
                    href="https://apps.apple.com/us/app/tix-africa/id1513743943"
                    target="_blank"
                  >
                    <img src="https://res.cloudinary.com/tix-africa/image/upload/v1614689087/development/apple-store_d5vskb.png" />
                  </a>
                  <a
                    class="landing-page__download-icon"
                    href="https://play.google.com/store/apps/details?id=africa.tix.app&hl=de&gl=US"
                    target="_blank"
                  >
                    <img src="https://res.cloudinary.com/tix-africa/image/upload/v1614689135/development/google-play-store_wbplyw.png " />
                  </a>
                </div>
                <div class="landing-page__faq">
                  <h4 class="landing-page-faq__header">
                    questions you might have
                  </h4>
                  <ul>
                    <li v-for="(faq, index) in faqs" :key="index">
                      <h5 :value="index" @click="openDetail" :class="{'orange--header': currentDetail === index}">
                        {{ faq.question }}
                      </h5>
                      <p v-if="currentDetail === index" v-html="faq.answer" />
                    </li>
                  </ul>
                  <router-link class="landing-page-faq__more" :to="{name: 'Faq'}">
                    <span>more questions</span>
                    <el-arrow></el-arrow>
                  </router-link>
                </div>
                <div class="footer-block">
                  <el-footer></el-footer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import ElLanding from '@/components/Global/Landing';
import ElMobileLanding from '@/components/Global/MobileLanding';
import ElArrow from '@/components/Global/Arrow';
import LoginForm from '@/components/Auth/LoginForm';

export default {
  components: {
    ElLanding,
    ElMobileLanding,
    ElArrow,
    LoginForm,
  },
  data() {
    return {
      faqsMore: false,
      currentDetail: null,
      faqs: [
        { question: 'who can use tix.africa?',
          answer: 'tix.africa is available to anyone, anywhere to create free events. all you need is an email address.',
        },
        { question: 'what if I want to organise a paid event?',
          answer: 'listing paid events is currently only available in nigeria, we will be expanding to more african countries in 2021.',
        },
        { question: 'how much does it cost to use tix.africa?',
          answer: 'technically, tix is free to use. we charge you nothing to create a free event and sell tickets. however, if you’re charging your guests a fee, we take a percentage of the value of the ticket as a transaction processing fee. if you upgrade to tix pro, we charge lower transaction processing fees on paid tickets. compare our pricing packages <a href="/pricing">here</a>.',
        },
        {
          question: 'what is tix pro?',
          answer: 'as a pro user, you get everything on the free plan plus lower transaction processing fees, recurring event types, waitlists, 1:1 events, unlimited custom fields, discount codes and premium zoom integration for 4,000 ngn a month.',
        },
        {
          question: 'why does tix.africa cost more than a payment gateway like Paystack?',
          answer: 'we charge a little higher than payment gateways because we offer more value to event organizers. asides selling tickets, we offer tools to manage admissions, zoom integration, email marketing, data collection and other specialized products all without leaving the app. we also remit part of the fees to our payment processor - Paystack so their fee is included in our transaction processing fees.',
        },
        {
          question: 'can i make my guests pay the transaction processing fee instead?',
          answer: 'yes. for your guests to pay the transaction processing fee, all you need to do is select “transfer fees to guests” when setting up your event.',
        },
      ],
    };
  },
  methods: {
    showMoreFaqs() {
      this.faqsMore = !this.faqsMore;
    },
    openDetail(event) {
      // eslint-disable-next-line
      if (this.currentDetail == event.srcElement.attributes[1].value) {
        this.currentDetail = null;
        return;
      }
      this.currentDetail = null;
      switch (event.srcElement.attributes[1].value) {
        case '0':
          this.currentDetail = 0;
          break;
        case '1':
          this.currentDetail = 1;
          break;
        case '2':
          this.currentDetail = 2;
          break;
        case '3':
          this.currentDetail = 3;
          break;
        case '4':
          this.currentDetail = 4;
          break;
        case '5':
          this.currentDetail = 5;
          break;
        default:
          this.currentDetail = null;
          break;
      }
    },
    goToApp() {
      const redirect = this.$route.query.redirect || { name: 'ListEvents' };
      this.$router.push(redirect);
    },
  },
};
</script>

<style lang="scss" scoped>
.landing-page {
  position: relative;
  display: flex;
  @media screen and (max-width: 767px) {
    flex-direction: column;
  }
  &__image {
    width: 50%;
    height: 100%;
    position: fixed;
    overflow: hidden;
    svg {
      max-width: 100%;
      height: auto;
    }
    @media screen and (max-width: 767px) {
      position: relative;
      width: 100%;
      margin: 1rem auto;
      img {
        border-radius: 4px;
      }
    }
  }
  &__text {
    width: 50%;
    max-width: 51.4rem;
    position: absolute;
    left: 53.8%;
    height: 100%;
    @media screen and (max-width: 1100px) {
      max-width: 42rem;
    }
    @media screen and (max-width: 767px) {
      position: unset;
      width: 100%;
      max-width: 100%;
      padding: 0 2.3rem 0 2.9rem;
    }
  }
  &-header {
    &__title {
      padding-top: 9.5rem;
      margin-bottom: 2rem;
      @media screen and (max-width: 767px) {
        font-size: 2rem;
        font-weight: 500;
        padding-bottom: 2rem;
        margin-bottom: 0;
        padding-top: 0;
      }
    }
    &__subtitle {
      margin: 0;
      max-width: 45rem;
      margin-block: 0;
      line-height: 1.2;
      @media screen and (max-width: 767px) {
        font-size: 1.5rem;
        font-weight: normal;
      }
    }
  }
  &__download-icons {
    margin: 2rem 0;
    @media screen and (max-width: 767px) {
      margin-bottom: 7rem;
    }
    a:first-child {
      margin-right: 1.6rem;
    }
  }
  &__download-icon {
    display: inline-block;
  }
  &__faq {
    max-width: 43rem;
    border-top: 1px solid rgba($color: $--color-black, $alpha: 0.1);
    padding-top: 2rem;
    @media screen and (max-width: 767px) {
      padding-top: 3.5rem;
    }
    li {
      margin-bottom: 1.2rem;
      &:last-of-type {
        margin-bottom: 0;
      }
    }
    h5 {
      cursor: pointer;
      outline: none;
      font-weight: 300;
      margin: 0;
      &::-webkit-details-marker {
        display: none;
      }
      &:hover {
        color: $--color-pink;
      }
      &:before {
        content: '+';
        translate: 0.3s;
        margin-right: 5px;
      }
    }
    p {
      font-size: 1.4rem;
      margin: 5px 0;
      color: $--color-black;
      font-weight: 300;
      line-height: 1.2;
      padding-left: 1.5rem;
    }
  }
  &-faq {
    &__header {
      color: $color-orange;
      margin-bottom: 1rem;
    }
    &__more {
      display: block;
      margin-top: 2.6rem;
      font-size: 1.4rem;
      color: $--color-green;
      svg {
        margin-left: 2rem;
      }
      @media screen and (max-width: 767px) {
        margin-left: 1.1rem;
      }
    }
  }
}
.orange--header {
  color: $--color-pink;
}
.footer-block {
  margin-top: 5.3rem;
  padding-bottom: 2.4rem;
  @media screen and (max-width: 767px) {
    padding-bottom: 3.5rem;
  }
}
  .el-landing-mobile {
    display: none;
    @media screen and (max-width: 1200px) {
      display: flex;
      justify-content: center;
    }
  }
  .u-button--large {
    width: 15rem;
    font-weight: 500;
    line-height: 1.2;
    font-size: 2rem;
    margin: 3.5rem 0 0;
  }
</style>
