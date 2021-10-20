<template>
  <div class="status" :class="{'active': active}" :style="{width: `${size}px`, height: `${size}px`}"></div>
</template>

<script>
export default {
  name: 'status',
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    size: {
      type: Number,
      default: 4,
    },
  },
};
</script>

<style lang="scss" scoped>
.status {
  border-radius: 50%;
  background: $color-muted;
  &.active {
    background: $color-green;
  }
}
</style>