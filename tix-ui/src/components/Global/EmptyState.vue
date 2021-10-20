<template>
  <div class="empty-state">
    <div class="empty-state-image">
      <img src="@/assets/no-events-404.svg" alt="an owambe-ready woman checking her events calender">
    </div>
    <div class="empty-state-content">
      <h1 class="empty-state-content__header">{{title}}</h1>
      <h2 class="empty-state-content__paragraph">{{instruction}}</h2>
      <router-link class="u-button u-button--medium" :to="{name: targetRoute}">{{buttonText}}</router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    instruction: {
      type: String,
      required: true,
    },
    buttonText: {
      type: String,
      required: true,
    },
    targetRoute: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
  .empty-state {
    display: flex;
    @media screen and (max-width: 992px) {
      display: block;
      text-align: center;
      margin: 2em 2rem;
    }
    &-image {
      overflow:hidden;
      @media screen and (max-width: 992px) {
        margin: 0 auto;
        width: 200px;
        height: 200px;
        border-radius: 10px;
        background: white;
        border: 1px solid #fcfcfc;
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
      }
    }
    &-content {
      max-width: 38em;
      padding-top: 12%;
      padding-left: 13.6%;
      display: flex;
      flex-direction: column;
      &__header {
        font-size: 2.8rem;
        color: $--color-pink;
        line-height: 120%;
      }
      &__paragraph {
        font-size: 2rem;
        line-height: 120%;
        margin: 1.6rem 0 2rem;
      }
      @media screen and (max-width: 992px) {
        padding: 1.875em 0;
        margin: 0 auto;
        align-items: center;   
      }
      @media screen and (width: 1024px) {
        padding-top: 16%;
        max-width: 28em;
      }      
    }
  }
  .u-button {
    width: 12.9rem;
    line-height: 1.2;
  }
</style>
