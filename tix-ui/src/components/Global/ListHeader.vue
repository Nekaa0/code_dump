<template>
  <div class="list-header">
    <span>{{ message }}</span> <a v-if="cta" @click="$emit('on-click')">{{ cta }}</a>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    message: String,
    cta: String,
  },
};
</script>

<style lang="scss" scoped>
  .list-header {
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 2.3rem 5% 0;
    margin-bottom: 1.1rem;
    span {
      color: $--color-green;
      font-size: 1.4rem;      
      position: absolute;
      left: 5%;
    }
    a {
      color: $color-orange;
    }
  }
</style>
