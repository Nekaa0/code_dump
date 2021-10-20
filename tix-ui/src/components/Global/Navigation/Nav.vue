<template>
    <div class="nav">
      <div class="nav-left">
        <div class="nav-logo">
          <router-link :to="home">
            <img src="@/assets/logo.svg" alt="Tix Logo">
          </router-link>
        </div>
      </div>
      <div class="nav-right" v-if="admin">
        <nav-user-actions :user="user" v-if="loggedIn" />
        <div class="nav-content" v-else>
          <div class="nav-mobile" v-if="isMobile">
            <img v-if="!menuClicked" src="@/assets/menu.svg" @click="toggleMenu" alt="Menu Icon">
            <img class="close-button" v-else src="@/assets/close-button.svg" @click="toggleMenu" alt="Close Icon">
              <mobile-nav v-if="showMobileNav" />
          </div>
          <div class="nav-web" v-else>
            <web-nav />
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import IsMobile from '@/mixins/IsMobile';
import Auth from '@/helpers/auth';
import NavUserActions from './NavUserActions';
import MobileNav from './MobileNav';
import WebNav from './WebNav';

export default {
  mixins: [IsMobile],
  components: { NavUserActions, MobileNav, WebNav },
  props: {
    admin: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      loggedIn: Auth.loggedIn(),
      user: Auth.currentUser,
      showMobileNav: false,
      menuClicked: false,
    };
  },
  computed: {
    home() {
      return this.loggedIn ? { name: 'ListEvents' } : { name: 'Home' };
    },
  },
  methods: {
    isPage(route) {
      return this.$route.path === `/${route}`;
    },
    toggleMenu() {
      this.showMobileNav = !this.showMobileNav;
      this.menuClicked = !this.menuClicked;
    },
  },
};
</script>

<style lang="scss" scoped>
  .nav {
    height: 5.3rem;
    padding: 0 2.6rem;
    position: relative;
    display: flex;
    align-items: center;
    z-index: 100;
    color: $--color-pink;
    box-shadow: 0px 4px 29px 5px rgba(0, 0, 0, 0.03);
    @media screen and (min-width: 960px) {
      z-index: 300;
    }
    &-left, &-right , &-logo {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    &-left{
      width: 50%;
    }
    &-right {
      padding-left: 3.4%;
      justify-content: flex-end;
      width: 50%;
    }
    &-content {
      width: 100%;
      .close-button {
        background: #e5e5e5;
      }
    }
    &-logo {
      height: 35px;
      img {
        height: 2.2rem;
      }
    }
    &-mobile {
      float: right;
    }
  }
</style>
