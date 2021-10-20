<template>
  <div class="nav-mobile">
    <ul class="nav-mobile-list">
      <li class="nav-link"><router-link :to="{name: 'WhyTix'}" >why tix.africa?</router-link></li>
      <li class="nav-link"><router-link :to="{name: 'Pricing'}" >pricing</router-link></li>
      <li class="nav-link"><router-link :to="{name: 'Product'}" >product</router-link></li>
      <li class="nav-link"><a target="_blank" href="https://medium.com/tixdotafrica">blog</a></li>
      <li><img src="@/assets/tixcustomers.svg" alt="Tix Customers"></li>
      <li><router-link class="u-button u-button--large" :to="{name: 'Signup'}">sign up</router-link></li>
      <li class="nav-signup-link"><router-link :to="{name: 'Login'}" >log in</router-link></li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'mobile-nav',
};
</script>

<style lang="scss" scoped>
  .nav-mobile {
    position: absolute;
    top: 100%;
    left: 0px;
    width: 100%;
    height: 100vh;
    margin: 0px;
    background: $--color-white;
    box-shadow: inset 0 2px 15px -9px rgba(68, 57, 57, 0.5);
    &-list {
      text-align: center;
      margin: 7rem 0;
      padding-bottom: 7rem;
      background: $--color-white;
    }
    img {
      padding-bottom: 5.1rem;
    }
  }
  .u-button--large {
    width: 15rem;
    font-weight: 500;
    line-height: 1.2;
    font-size: 2rem;
  }
  .nav-link {
    font-size: 1.8rem;
    line-height: 1.8rem;
    font-weight: normal;
    margin-bottom: 5.2rem;
  }
  .nav-signup-link {
    font-size: 2rem;
    padding-top: 3.2rem;
  }
</style>
