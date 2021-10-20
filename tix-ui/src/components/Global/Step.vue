<template>
  <div class="steps-wrapper">
    <div v-for="index in totalPageNumber" :key="index">
      <div class="step" :class="{ 'current-step': currentPageNumber === index }"></div>
    </div>
    <div class="step-value">{{ currentPageNumber }}/{{ totalPageNumber }}</div>
  </div>
</template>

<script>
export default {
  name: 'step',
  props: {
    currentPageNumber: Number,
    totalPageNumber: Number,
  },
};
</script>

<style lang="scss" scoped>
.steps-wrapper {
  display: flex;

  .step {
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    margin-left: 1.5rem;
    margin-top: 0.35rem;
    background: grey;
  }

  .current-step {
    background: $color-orange;
  }

  .step-value {
    font-size: 12px;
    margin-left: 1.5rem;
    color: grey;
  }
}
</style>
