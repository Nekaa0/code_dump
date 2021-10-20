<template>
  <div>
    <navigation></navigation>
    <main>
      <div class="landing-page">
        <div class="landing-page__image">
          <img src="https://res.cloudinary.com/tix-africa/image/upload/v1614692956/jola-and-fk-iswis_hnkolz.png" alt="jola and fk">
        </div>
        <div class="landing-page__text">
          <div class="landing-page-text__body">
            <header class="landing-page__header">
              <h1 class="landing-page-header__title">tix.africa x iswis</h1>
              <h4 class="landing-page-header__subtitle">
                list, share and collect payments for live or virtual events with
                our online ticketing tools.
              </h4>
            </header>
            <div class="u-visible--hide-on-mobile">
              <div class="sign-in--form">
                <login-form
                  @complete="goToApp"
                  emailLabel="email"
                  passwordLabel="password"
                />
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
                fun facts about jola and fk
              </h4>
              <ul>
                <li>
                  <h5 value="1" @click="openDetail" :class="{'orange--header': currentDetail === '1'}">what is your favourite ice cream flavour?</h5>
                  <p v-if="currentDetail === '1'">
                    jola: depends on the day but i’m mostly a sucker for vanilla.
                  </p>
                  <p v-if="currentDetail === '1'">
                    fk: stracciatella.
                  </p>
                </li>
                <li>
                  <h5 value="2" @click="openDetail" :class="{'orange--header': currentDetail === '2'}">what is your favourite drink?</h5>
                  <p v-if="currentDetail === '2'">
                    jola: believe it or not, a dirty chapman. preferably with a
                    shot of vodka.
                  </p>
                  <p v-if="currentDetail === '2'">
                    fk: tough. a glass of rose champagne probably. i can’t pick a cocktail.
                  </p>
                </li>
                <li>
                  <h5 value="3" @click="openDetail" :class="{'orange--header': currentDetail === '3'}">if you tweet that you’re eating this particular thing, your
                    friends and family will know you’ve been kidnapped
                  </h5>
                  <p v-if="currentDetail === '3'">
                    jola: golden morn or custard. yuck.
                  </p>
                  <p v-if="currentDetail === '3'">
                    fk: lol there are so many: amala, pizza, burgers, cheese, fish, all malt drinks.
                  </p>
                </li>
                <li>
                  <h5 value="4" @click="openDetail" :class="{'orange--header': currentDetail === '4'}">what is a country you’re looking forward to visiting?</h5>
                  <p v-if="currentDetail === '4'">
                    jola: south korea. i really want to see the city of seoul.
                  </p>
                  <p v-if="currentDetail === '4'">
                    fk: mexico.
                  </p>
                </li>
                <li>
                  <h5 value="5" @click="openDetail" :class="{'orange--header': currentDetail === '5'}">what is your favourite snack?</h5>
                  <p v-if="currentDetail === '5'">
                    jola: percy pigs
                  </p>
                  <p v-if="currentDetail === '5'">
                    fk: chin chin
                  </p>
                </li>
              </ul>
            </div>
            <div class="footer-block">
              <el-footer></el-footer>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import LoginForm from '@/components/Auth/LoginForm';

export default {
  name: 'Iswis',
  components: {
    LoginForm,
  },
  data() {
    return {
      currentDetail: null,
    };
  },
  methods: {
    openDetail(event) {
      if (this.currentDetail === event.srcElement.attributes[1].value) {
        this.currentDetail = null;
        return;
      }
      this.currentDetail = null;
      switch (event.srcElement.attributes[1].value) {
        case '1':
          this.currentDetail = '1';
          break;
        case '2':
          this.currentDetail = '2';
          break;
        case '3':
          this.currentDetail = '3';
          break;
        case '4':
          this.currentDetail = '4';
          break;
        case '5':
          this.currentDetail = '5';
          break;
        default:
          this.currentDetail = null;
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
  @media screen and (max-width: 800px) {
    flex-direction: column;
  }
  &__image {
    width: 50%;
    height: 100%;
    position: fixed;
    @media screen and (max-width: 800px) {
      position: relative;
      width: 60%;
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
    @media screen and (max-width: 800px) {
      position: unset;
      width: 100%;
      max-width: 100%;
      padding: 2rem;
    }
  }
  &-text__body {
    height: 100%;
  }
  &-header {
    &__title {
      padding-top: 8.5rem;
      margin-bottom: 2rem;
      @media screen and (max-width: 800px) {
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
      @media screen and (max-width: 800px) {
        font-size: 1.5rem;
        font-weight: normal;
      }
    }
  }
  &__download-icons {
    margin-top: 2rem;
    margin-bottom: 4rem;
    a:first-child {
      margin-right: 1.6rem;
    }
  }
  &__download-icon {
    display: inline-block;
  }
  &__faq {
    border-top: 1px solid rgba($color: $--color-black, $alpha: 0.1);
    padding-top: 2rem;
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
  }
}
.orange--header {
  color: $--color-pink;
}
.footer-block {
  margin-top: 5.3rem;
  margin-bottom: 2.4rem;
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
