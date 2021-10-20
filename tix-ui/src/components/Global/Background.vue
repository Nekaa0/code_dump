<template>
  <div class="bg"></div>
</template>

<script>
export default {
  name: 'background',
};
</script>

<style lang="scss">
.bg {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: $--color-white;
  background-size: 300px;
  position: fixed;
  z-index: -1;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, rgba($color: white, $alpha: 0.4) 0%, white 35%, rgba($color: white, $alpha: 0.4) 80%);
  }
}
</style>
