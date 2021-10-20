<template>
  <svg :width="width" :height="height" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H20V5.5647C17.8284 5.7077 16.1112 7.51444 16.1112 9.72225C16.1112 11.9301 17.8284 13.7368 20 13.8798V20H0V0ZM5.55555 0.555548V2.65431H9.55555V0.555548H5.55555ZM5.55555 4.75308V8.95061H9.55555V4.75308H5.55555ZM5.55555 11.0494V15.2469H9.55555V11.0494H5.55555ZM5.55555 17.3457V19.4444H9.55555V17.3457H5.55555Z" fill="#DFAF37"/>
  </svg>
</template>

<script>
export default {
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
