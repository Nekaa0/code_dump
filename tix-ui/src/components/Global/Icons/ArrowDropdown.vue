<template>
  <svg :style="elementStyle" width="6" height="9" viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M4.1887 0.283127L0.311671 3.81511L0.310469 3.81623C-0.10349 4.19374 -0.10349 4.80584 0.310469 5.18334L4.1887 8.71645C4.60326 9.09452 5.27557 9.09452 5.68953 8.71645C6.10349 8.33895 6.10349 7.72684 5.68953 7.34878L2.56171 4.49979L5.68953 1.6508C6.10349 1.2733 6.10349 0.660629 5.68953 0.283127C5.27557 -0.0943756 4.60326 -0.0943756 4.1887 0.283127Z" :fill="color"/>
  </svg>
</template>

<script>
export default {
  name: 'ArrowDropdown',
  props: {
    elementStyle: {
      default: 'transform: rotate(0deg)',
      required: false,
    },
    color: {
      default: 'black',
      required: false,
    },
  },
};
</script>
