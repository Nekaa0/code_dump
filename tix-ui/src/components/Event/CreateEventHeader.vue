<template>
  <div>
    <el-row class="live-event__header">
      <el-col :span="20">
        <h1>{{title}}</h1>
      </el-col>
      <el-col class="live-event__header__icon" :span="4"><img :src="require(`@/assets/${icon}`)" alt="event icon"></el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'create-event-header',
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
  .live-event {
    &__header {
      margin-bottom: 3rem;
      display: flex;
      align-items: center;
      &__icon {
        padding-top: 5px;
        text-align: right;
      }
    }
  }
</style>
