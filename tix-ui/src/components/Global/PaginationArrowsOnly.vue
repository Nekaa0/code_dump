<template>
  <span class="page-pagination__arrows">
    <span
      class="page-pagination__arrows-left"
      @click="previousPage"
      :class="{ 'page-pagination__arrows-disabled': noPreviousPage }"
    >
      <svg
        width="4"
        height="8"
        viewBox="0 0 4 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.5 7L0.5 4L3.5 1"
          stroke="black"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
    <span
      class="page-pagination__arrows-right"
      @click="nextPage"
      :class="{ 'page-pagination__arrows-disabled': noNextPage }"
    >
      <svg
        width="4"
        height="8"
        viewBox="0 0 4 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.5 7L3.5 4L0.5 1"
          stroke="black"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
  </span>
</template>

<script>
export default {
  name: 'pagination-arrows-only',
  props: {
    noPreviousPage: Boolean,
    noNextPage: Boolean,
  },
  methods: {
    previousPage() {
      this.$emit('goto-previous-page');
    },
    nextPage() {
      this.$emit('goto-next-page');
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  &-pagination {
    &__arrows {
      &-disabled {
        pointer-events: none;
      }
      &-left,
      &-right {
        cursor: pointer;
      }
      &-right {
        margin-left: 0.9rem;
      }
    }
  }
}
</style>
