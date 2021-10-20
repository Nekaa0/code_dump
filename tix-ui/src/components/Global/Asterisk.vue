<template>
  <p><img class="asterisk" src="@/assets/asterisk.svg" alt="asterisk"> <small>{{title}}</small></p>
</template>

<script>
export default {
  name: 'asterisk',
  props: {
    title: String,
  },
};
</script>

<style lang="scss" scoped>
  .asterisk {
    line-height: inherit;
  }
</style>
