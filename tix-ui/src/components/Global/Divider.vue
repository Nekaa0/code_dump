<template>
  <div class="divider"></div>
</template>

<script>
export default {
  name: 'divider',
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.divider {
  height: 1px;
  background-image: linear-gradient(to right, $color-muted 50%, rgba(255, 255, 255, 0) 0%);
  background-position: top;
  background-size: 20px 1px;
  margin-bottom: 50px;
}
</style>