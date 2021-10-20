<template>
  <div class="pricing--cards">
    <el-col :xs="24" :sm="24" :md="12">
      <div class="pricing--cards__content">
        <div class="pricing--cards__content__light-blue">
          <h1 class="pricing--cards__content__title">{{lightBlueCard.title}}</h1>
            <el-row class="pricing--cards__content__list" v-for="(content, index) in lightBlueCard.contents" :key="index">
              <el-col :xs="3" :sm="2"><img src="@/assets/check-circle.svg" alt="check circle"></el-col>
              <el-col :xs="21" :sm="22">{{content.title}}</el-col>
            </el-row>
            <div class="pricing__button">
              <router-link class="u-button" :to="{name: ''}">contact sales</router-link>
            </div>
        </div>
      </div>
    </el-col>
  </div>
</template>

<script>
export default {
  name: 'light-blue-card',
  props: {
    lightBlueCard: {
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
  .pricing--cards {
    font-weight: 300;
    margin-top: 2.6rem;
    font-size: 1.8rem;
    &__content {
      margin-left: 8%;
      @media screen and (max-width: 960px) {
        width: 90%;
        font-size: 1.2rem;
        margin: 0 auto;
      }
      &__title {
        margin: 0;
        padding-bottom: 3.1rem;
        span {
          font-size: 12px;
        }
        @media screen and (max-width: 767px) {
          padding-bottom: 2.5rem;
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
      &__light-blue {
        background: $--background-color-light-blue;
        padding: 4.5rem 10% 2.9rem;
        line-height: 1.5em;
        box-shadow: $--box-shadow-gray;
        @media screen and (max-width: 960px) {
          box-shadow: 1rem 1rem $--background-color-gray;
          padding: 3.9rem 10% 2.2rem;
        }
      }
      &__list {
        margin-bottom: 1rem;
        img {
          @media screen and (max-width: 767px) {
            width: 2rem;
          }
        }
      }
    }
  }
</style>
