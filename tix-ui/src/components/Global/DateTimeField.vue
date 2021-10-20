<template>
  <div>
    <label v-if="label" :for="name">{{name}}</label>
    <div class="datetime">
      <input name="datw">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
div {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
