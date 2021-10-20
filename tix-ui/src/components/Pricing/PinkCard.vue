<template>
  <div class="pricing--card">
    <el-col :xs="24" :sm="24" :md="12">
      <div class="pricing--card__content">
        <div class="pricing--card__content__pink">
          <p class="pricing--card__content__title">
            {{pinkCard.title}}
            <span v-if="pinkCard.subtitle"> - {{pinkCard.subtitle}}</span>
          </p>
          <el-row class="pricing--card__content__list" v-for="(content, index) in pinkCard.contents" :key="index">
            <el-col :xs="3" :sm="2"><img src="@/assets/check-circle.svg" alt="check circle"></el-col>
            <el-col :xs="21" :sm="22">{{content.title}}</el-col>
          </el-row>
        </div>
      </div>
    </el-col>
  </div>
</template>

<script>
export default {
  name: 'pink-card',
  props: {
    pinkCard: {
      type: Object,
    },
  },
};
</script>
<style lang="scss" scoped>
  .pricing--card {
    font-weight: 300;
    margin-top: 2.6rem;
    font-size: 1.8rem;
    &__content {
      margin-right: 8%;
      @media screen and (max-width: 767px) {
        width: 90%;
        font-size: 1.2rem;
        margin: 0 auto;
      }
      &__title {
        margin: 0;
        padding-bottom: 3.1rem;
        span {
          font-size: 18px;
        }
        @media screen and (max-width: 767px) {
          padding-bottom: 2.5rem;
          span {
            font-size: 12px;
          }
        }
      }
      &__pink {
        background:$--background-color-pink;
        padding: 4.9rem 10% 2.2rem;
        line-height: 1.5em;
        box-shadow: $--box-shadow-gray;
        @media screen and (max-width: 767px) {
          box-shadow: 1rem 1rem $--background-color-gray;
          padding-top: 3.9rem;
        }
        @media screen and (max-width: 992px) {
          margin-bottom: 3em;
        }
      }
      &__list {
        margin-bottom: 1rem;
        &:last-of-type {
          margin-bottom: 2.6rem;
        }
        img {
          @media screen and (max-width: 767px) {
            width: 2rem;
          }
        }
      }
    }
  }
</style>
