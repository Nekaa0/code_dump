<template>
  <div class="alert" v-bind:class="classObject">
    <div class="alert__icon"></div>
    <div class="alert-content">
      <div class="alert__title">{{ title }}</div>
      <div class="alert__description">{{ description }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: String,
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      classObject: {
        'alert--error': this.type === 'error',
        'alert--success': this.type === 'success',
      },
    };
  },
};
</script>

<style lang="scss" scoped>
$--color-white: #ffffff;
$--color-danger: #fa5555;

.alert {
  width: 100%;
  margin: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 3px;
  position: relative;
  background-color: #fff;
  overflow: hidden;
  opacity: 1;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-transition: opacity .2s;
  transition: opacity .2s;
  color: $--color-danger;
  padding: 20px 24px;
  &__icon {
    font-family: element-icons!important;
    speak: none;
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    vertical-align: baseline;
    display: inline-block;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 2.8rem;
    width: 28px;
    &:before {
      content: "\E62C";
    }
  }
  &-content {
    display: table-cell;
    padding: 0 8px 0 15px;
    margin: 0 auto;
  }
  &__title {
    font-size: 1.7rem;
    line-height: 17px;
    font-weight: bold;
  }
  &__description {
    font-size: 1.4rem;
    margin: 5px 0 0;
    line-height: 1.5;
    color: $--color-danger;
  }
  &--error {
    background-color: mix($--color-white, $--color-danger, 90%);
    color: $--color-danger;

    .alert__description {
      color: $--color-danger;
    }
  }
}
</style>
