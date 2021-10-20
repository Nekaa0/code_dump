<template>
  <div class="pricing--card">
    <div class="pricing--card__content">
      <div class="pricing--card__content__body" :class="pricing.color">
        <p class="pricing--card__content__title">{{pricing.title}} <span v-if="pricing.subtitle"> - {{pricing.subtitle}}</span></p>
        <div class="pricing--card__content__list" v-for="(content, index) in pricing.contents" :key="index">
          <span><img src="@/assets/check-circle.svg" alt="check circle"></span>
          <p>{{content.title}}</p>
        </div>
        <div class="pricing__button" v-if="pricing.button">
          <router-link class="u-button" :to="{name: ''}">contact sales</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pricing: {
      type: Object,
    },
  },
};
</script>
<style lang="scss" scoped>
  .pricing__button {
    text-align: center;
    margin-top: 3.7rem;
  }
  .u-button {
    background: $--color-white;
    color: $--color-pink;
    width: 16.2rem;
    height: 4.2rem;
    line-height: 1.8;
  }
  .pricing--card {
    font-weight: 300;
    margin-top: 2.6rem;
    font-size: 1.8rem;
    margin-left: 2rem;
    margin-right: 3.5rem;
    width: 90%;
    @media screen and (max-width: 767px) {
      width: 100%;
      margin-left: 0;
      margin-right: 0;
      margin-bottom: 75px;
    }
    &__content {
      @media screen and (max-width: 960px) {
        width: 90%;
        font-size: 1.2rem;
        margin: 0 auto;
      }
      &__title {
        margin: 0;
        padding-bottom: 3.1rem;
        font-size: 28px;
        span {
          font-size: 18px;
        }
        @media screen and (max-width: 767px) {
          padding-bottom: 2.5rem;
          font-size: 16px;
          span {
            font-size: 12px;
          }
        }
      }
      &__subtitle {
        color: $--color-white;
        padding: 3.1rem 0 1.2rem;
        @media screen and (min-width: 767px) {
          width: 32rem;
        }
        @media screen and (max-width: 767px) {
          padding-top: 2.5rem;
        }
      }
      &__body {
        height: 470px;
        padding: 4.5rem 10% 2.9rem;
        line-height: 1.5em;
        box-shadow: $--box-shadow-gray;
        @media screen and (max-width: 767px) {
          height: auto;
        }
        @media screen and (max-width: 960px) {
          box-shadow: 2rem 2rem rgba(#F2F2F2, 0.7);
          padding: 3.9rem 10% 2.2rem;
        }
      }
      &__list {
        margin-bottom: 0.5rem;
        display: flex;
        span {
          margin-right: 1rem;
          img {
            @media screen and (max-width: 767px) {
              width: 2rem;
            }
          }
        }
      }
    }
  }
  .pink {
    background:$--background-color-pink;
  }
  .light-blue {
    background: $--background-color-light-blue;
  }
  .yellow {
    background: $--background-color-yellow;
  }
</style>
