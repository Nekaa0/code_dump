<template>
  <svg :width="width" :height="height" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M6.99999 1.16666L8.80249 4.81832L12.8333 5.40749L9.91666 8.24832L10.605 12.2617L6.99999 10.3658L3.39499 12.2617L4.08332 8.24832L1.16666 5.40749L5.19749 4.81832L6.99999 1.16666Z" :fill="color" :stroke="color" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>

<script>
export default {
  name: 'TixProStar',
  props: {
    width: {
      default: 14,
    },
    height: {
      default: 13,
    },
    color: {
      default: '#EDD676',
    },
  },
};
</script>
