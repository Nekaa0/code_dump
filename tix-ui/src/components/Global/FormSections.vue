<template>
  <div>
    <el-row class="form-sections">
      <el-col class="form-sections__title" :md="8" :sm="12" :xs="24">
        {{title}}
      </el-col>
      <el-col :md="16" :sm="12" class="hidden-xs-only">
        <img class="form-sections__horizontal-line" :src="require(`@/assets/${icon}`)" alt="horizontal line">
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'form-section',
    props: {
      title: {
        type: String,
      },
      icon: {
        type: String,
      },
    },
  };
</script>

<style lang="scss" scoped>
  .form-sections {
    margin-top: 2rem;
    margin-bottom: 3rem;
    font-size: 2rem;
    &__title {
      color: $--color-info;
      @media screen and (max-width: 765px) {
        font-size: 20px;
        text-decoration: underline;
        text-underline-position: under;
        text-decoration-color: $--color-green;
      }
    }
  }
</style>
