<template>
  <div class="why-tix__content">
    <h1 class="why-tix__content__header">event management should never be hard</h1>
    <div>
      <div class="why-tix__content__group" v-for="(content, index) in contents" :key="index">
        <p class="why-tix__content__group__header">{{content.title}}</p>
        <p class="why-tix__content__group__detail">{{content.detail}}</p>
      </div>
    </div>
    <div class="why-tix__content__arrow">
        <img src="@/assets/hr.svg" alt="arrow">
    </div>
    <div class="why-tix__content__features">
      <router-link :to="{name: 'Pricing'}" >see all our features <span><el-arrow></el-arrow></span></router-link>
    </div>
    <div class="footer-block">
      <el-footer></el-footer>
    </div>
  </div>
</template>
<script>
import ElArrow from '@/components/Global/Arrow';

export default {
  components: {
    ElArrow,
  },
  name: 'why-tix',
  props: {
    contents: {
      type: Array,
    },
  },
};
</script>
<style lang="scss" scoped>
  .why-tix__content {
    margin-top: 4rem;
    padding: 3em 3em 3.5rem;
    padding-right: 18.75%;
    font-weight: 300;
    @media screen and (max-width: 960px) {
      padding: 1.5em;
    }
    @media screen and (min-width: 600px) and (max-width: 960px) {
      width: 70%;
    }
    &__header {
      margin-bottom: 0.9rem;
    }
    &__group {
      margin-top: 1.4em;
      font-size: 1.8rem;
        @media screen and (max-width: 960px) {
          font-size: 1.2rem;
        }
        p {
          margin: 0;
        }
      &__header {
        padding: 0px;
        color: $--color-pink;
        text-decoration: underline;
      }
      &__detail {
        line-height: 2rem;
      }
    }
    &__arrow {
      font-size: 3rem;
    }
    &__features {
      margin-top: 2.3rem;
      margin-bottom: 10.5rem;
      color: $--color-green;
      font-weight: normal;
      font-size: 1.4rem;
    }
    .footer-block {
      @media screen and (min-width: 1200px) {
        position: absolute;
      }
    }
  }
</style>
