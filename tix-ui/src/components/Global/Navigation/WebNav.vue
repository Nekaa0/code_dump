<template>
  <ul class="nav-web-list">
    <li class="nav-web-link" :class="{active: '/why_tix' == this.$route.path}"><router-link :to="{name: 'WhyTix'}" >why tix.africa?</router-link></li>
    <li class="nav-web-link"  :class="{active: '/pricing' == this.$route.path}"><router-link :to="{name: 'Pricing'}" >pricing</router-link></li>
    <li class="nav-web-link"  :class="{active: '/product' == this.$route.path}"><router-link :to="{name: 'Product'}" >product</router-link></li>
    <li class="nav-web-link"><a target="_blank" href="https://medium.com/tixdotafrica">blog</a></li>
    <li v-if="!isPage('login')"><router-link class="u-button u-button--medium nav-right-link" :to="{name: 'Login'}">sign in</router-link></li>
    <li v-else><router-link class="u-button u-button--medium nav-right-link" :to="{name: 'Signup'}" >sign up</router-link></li>
  </ul>
</template>

<script>

export default {
  name: 'web-nav',
  methods: {
    isPage(route) {
      return this.$route.path === `/${route}`;
    },
  },
};
</script>

<style lang="scss" scoped>
  .nav {
    &-web-list {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-left: 0;
      padding-left: 0;
      justify-content: space-between;
    }
    &-web-link{
      text-align: center;
      font-size: 1.125em;
      font-weight: normal;
      height: 2rem;
      &:hover {
        border-bottom: 1px solid rgba($color: $--color-pink, $alpha: 0.5);
      }
    }
  }
  .active {
    border-bottom: 1px solid $--color-pink;
  }
</style>
