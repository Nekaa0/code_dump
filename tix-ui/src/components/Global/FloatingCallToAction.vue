<template>
  <div class="floating-cta" :class="classes">
    <el-button @click="$emit('click')" :type="type" :size="size" round >
      <slot></slot>
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'floating-cta',
  props: {
    type: {
      type: String,
      default: 'primary',
    },
    size: {
      type: String,
      default: 'medium',
    },
    admin: {
      type: Boolean,
      default: true,
    },
    bottomOnMobile: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classes() {
      const rootClass = 'floating-cta--';
      const floatClass = `${rootClass}${this.bottomOnMobile ? 'bottom' : 'top'}-on-mobile`;
      return {
        [floatClass]: true,
        'floating-cta--no-profile': !this.admin,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.floating-cta {
  position: fixed;
  top: 0;
  padding: 15px 10px 10px 10px;
  background: white;
  border: solid 1px rgba($color: #000000, $alpha: 0.07);
  border-width: 0 1px 1px;
  box-shadow: 0 1px 2px rgba($color: #000000, $alpha: 0.05);
  border-radius: 0 0 25px 25px;
  z-index: 1000;
  left: calc(50% - 580px);
  @media screen and (max-width: 960px) {
    &--top-on-mobile {
      left: auto;
      right: 70px;
      // padding-top: 10px;
    }
    &--no-profile {
      right: 10px;
    }
    &--bottom-on-mobile {
      left: auto;
      top: auto;
      bottom: 0;
      right: 5px;
      padding: 10px 10px 15px;
      border-width: 1px 1px 0;
      border-radius: 25px 25px 0 0;
    }
  }
}
</style>
