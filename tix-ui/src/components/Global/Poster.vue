<template>
  <div class="poster" :class="{'poster--fixed': fixed}">
    <img :src="src" :alt="alt">
  </div>
</template>

<script>
export default {
  name: 'poster',
  props: {
    src: String,
    alt: String,
    fixed: Boolean,
    offset: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang="scss" scoped>
.poster {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: (1 / 2) * 100%;
  img {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 80rem;
    object-fit: fill;
  }
}
</style>
