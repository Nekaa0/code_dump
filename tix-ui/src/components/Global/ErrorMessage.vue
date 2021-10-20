<template>
  <div class="error-message">
    <div class="error-message__icon">
      <i class="el-icon-warning" />
    </div>
    <div class="error-message__content">
      <h3>{{title}}</h3>
      <p>{{description}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    description: String,
  },
};
</script>

<style lang="scss" scoped>
  .error-message {
    padding: 0 20px;
    position: relative;
    width: 100%;
    max-width: 500px;
    margin: 100px auto;
    text-align: center;
    &__icon {
      font-size: 3.6rem;
      margin-bottom: 20px;
    }
    h3 {
      margin: 0 0 5px;
      font-size: 1.8rem;
      letter-spacing: -0.5px;
      font-weight: 600;
    }
    p {
      margin: 0 0 20px;
      font-size: 1.6rem;
      line-height: 1.3;
    }
  }
</style>
