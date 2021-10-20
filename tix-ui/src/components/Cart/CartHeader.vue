<template>
  <header>
    <h4 :class="{'small-bottom-margin': message}">{{ title }}</h4>
    <p v-if="message">{{ message }}</p>
    <div class="image" v-if="image">
      <img :src="`/static/images/${image}`" :alt="title">
    </div>
    <div class="call-to-action" v-if="callToAction">
      <el-button size="small" type="default" icon="el-icon-refresh" @click.prevent="$emit('clickCTA')">
        <b>{{ callToAction }}</b>
      </el-button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'cart-header',
  props: {
    title: String,
    message: String,
    callToAction: String,
    image: String,
    showBackButton: Boolean,
  },
};
</script>

<style lang="scss" scoped>
header {
  padding: 1rem 5rem;
  margin-bottom: 15px;
  @media screen and (max-width: 480px) {
    padding: 1rem 3rem;
    margin-bottom: 0px;
    h4, p, .call-to-action {
      display: none;
    }
  }
  .cart-header {
    display: flex;
    &__child {
      &--fluid {
        flex: 1;
      }
    }
  }
  h4 {
    margin: 20px 0 0;
    font-weight: 300;
    font-size: 28px;
    &.no-top-margin {
      margin-top: 0;
    }
    &.small-bottom-margin {
      margin-bottom: 15px;
    }
  }
  p {
    font-size: 18px;
    line-height: 1.5;
    margin: 0;
    color: rgba(0, 0, 0, 0.5);
  }
  .image {
    height: 250px;
    display: flex;
    justify-content: center;
    img {
      height: 100%;
    }
    @media screen and (max-width: 480px){
      height: 104px;
      width: 100%;
      justify-content: flex-start;
      margin-bottom: 10px;
    }
  }
  .illo {
    margin: 10px 0;
    background: #fafafa;
    border-radius: 5px;
    height: 200px;
    line-height: 200px;
    text-align: center;
  }
  .call-to-action {
    margin: 15px 0 0;
  }
}
</style>
