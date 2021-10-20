<template>
  <div class="footer">
    <span class="social-icons-wrapper">
      <a href="https://twitter.com/tixdotafrica" target="__blank">
        <font-awesome-icon :icon="faTwitter" class="social-icon" />
      </a>
      <a href="https://www.instagram.com/tixdotafrica/" target="__blank">
        <font-awesome-icon :icon="faInstagram" class="social-icon" />
      </a>
      <a href="https://facebook.com/tixdotafrica" target="__blank">
        <font-awesome-icon :icon="faFacebookF" class="social-icon" />
      </a>
    </span>
    <div class="footer__links">
      <div>
        <router-link :to="{name: 'About'}"  class="footer__element">about&nbsp;&nbsp;</router-link>
        <a target="_blank" href="https://docs.tix.africa/legal-documentation/terms-of-use" class="footer__element">terms of use</a><a target="_blank" href="https://docs.tix.africa/legal-documentation/privacy-policy" class="footer__element hide-border">privacy policy</a>
      </div>
      <span>© {{ currentYear }} - festival coins ltd. all rights reserved.</span>
    </div>
    <!-- <router-link :to="{name: 'About'}">about&nbsp;&nbsp;</router-link>
    <a target="_blank" href="https://docs.tix.africa/legal-documentation/terms-of-use" class="footer__element">terms of use</a><a target="_blank" href="https://docs.tix.africa/legal-documentation/privacy-policy" class="footer__element">privacy policy</a><span class="footer__element">© {{ currentYear }} - festival coins ltd. all rights reserved.</span> -->
  </div>
</template>

<script>
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faTwitter, faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons';

export default {
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      currentYear: moment().year(),
      faTwitter,
      faFacebookF,
      faInstagram,
    };
  },
};
</script>

<style lang="scss" scoped>
  .footer {
    display: flex;
    align-items: flex-end;
    font-size: 0.625em;
    line-height: 1.2;
    opacity: 0.5;
    margin-bottom: -20px;
    &__element {
      border-right: 1px solid $--color-black;
      padding: 0 5px;
      @media screen and (max-width: 450px) {
        // border: none;
        // padding: 0.125em 0;
      }
    }
    &__links {
      display: flex;
      span {
        margin-left: 5px;
      }
      @media screen and (max-width: 450px) {
        flex-direction: column;
        span {
          margin-top: 7.5px;
        }
      }
    }
    @media screen and (max-width: 450px) {
      flex-direction: row-reverse;
      align-items: center;
      .social-icons-wrapper {
        width: 40%;
        margin-bottom: 0.3rem;
      }
    }
    .social-icon {
      color: #fc6435;
      font-size: 14px;
      margin-right: 10px;
      line-height: 2;
    }
    .hide-border {
      @media screen and (max-width: 450px) {
        border: none;
      }
    }
  }
</style>
