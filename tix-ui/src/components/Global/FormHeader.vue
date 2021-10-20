<template>
  <div class="form-header">
    <div class="form-header--return" @click="goBack()" v-if="backButton">
      <svg width="20" height="15" viewBox="0 0 20 15" xmlns="http://www.w3.org/2000/svg"><title>Shape</title><path d="M19.013 6.462H3.353l4.87-4.803c.26-.243.363-.604.272-.942-.092-.34-.364-.602-.71-.688-.35-.087-.717.018-.962.273L.286 6.747c-.38.375-.38.98 0 1.356l6.537 6.444c.386.36.997.357 1.377-.01.38-.37.39-.966.024-1.347l-4.872-4.8h15.66c.546 0 .988-.432.988-.964s-.442-.964-.987-.964z" fill-rule="nonzero" fill="#000"/></svg>
    </div>
    <div class="form-header--text">
      <h2 class="form-header--text__title">{{title}}</h2>
      <h4 class="form-header--text__subtitle">{{subtitle}}</h4>
    </div>
    <div class="form-header--step" v-if="step">
      {{step.current}} of {{step.total}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    subtitle: String,
    backButton: Boolean,
    step: Object,
  },
  methods: {
    goBack() {
      this.$emit('back');
    },
  },
};
</script>

<style lang="scss" scoped>
  .form-header {
    position: relative;
    display: flex;
    @media screen and (min-width: 768px) {
      border: none;
      box-shadow: none;
    }
    &--return {
      width: 35px;
      flex: 0 0 1;
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    &--text {
      text-align: center;

      &__title {
        font-size: 2.8rem;
        font-weight: 300;
        margin: 0;
        @media screen and (max-width: 768px) {
          font-size: 1.6rem;
        }
      }
      &__subtitle {
        font-weight: 300;
        font-size: 2rem;
        opacity: 0.5;
        width: max-content;
        @media screen and (max-width: 768px) {
          font-size: 1.4rem;
        }
      }
    }
    &--step {
      width: 4rem;
      flex: 0 0 1;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      color: $color-muted;
      @media screen and (min-width: 1024px) {
        width: 6rem;
      }
    }
    h3 {
      margin-bottom: 5px;
    }
    &--step {
      margin: 0;
      font-size: 1.4rem;
      font-weight: normal;
      @media screen and (min-width: 1024px) {
        font-size: 1.6rem;
      }
    }
  }
</style>
