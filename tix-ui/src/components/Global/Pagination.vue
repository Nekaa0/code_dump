<template>
  <div class="pagination">
    <a @click.prevent="goBack" :class="{'disable-button': !hasPreviousPage}">
      <arrow-dropdown />
    </a>
      <p class="page-num page-num-active">
        {{ currentPageNum }}
      </p>
      <p class="page-num page-num-inactive" v-if="hasNextPage">
        <a @click.prevent="nextPage">
          {{ nextNum }}
        </a>
      </p>
    <a @click.prevent="nextPage" :class="{'disable-button': !hasNextPage}">
      <arrow-dropdown :elementStyle="'transform: rotate(-180deg)'"/>
    </a>
  </div>
</template>

<script>
import ArrowDropdown from './Icons/ArrowDropdown';

export default {
  components: { ArrowDropdown },
  props: {
    hasPreviousPage: {
      type: Boolean,
      required: true,
    },
    hasNextPage: {
      type: Boolean,
      required: true,
    },
    currentPageNum: {
      type: Number,
      required: true,
    },
  },
  name: 'pagination',
  computed: {
    nextNum() {
      return this.currentPageNum + 1;
    },
  },
  methods: {
    nextPage() {
      if (!this.hasNextPage) return;
      this.$emit('next-page');
    },
    goBack() {
      if (!this.hasPreviousPage) return;
      this.$emit('previous-page');
    },
  },
};
</script>

<style lang="scss" scoped>
  .pagination {
    max-width: 10rem;
    width: 100%;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }
  .page-num {
    font-size: 1.4rem;
    line-height: 1.7rem;
    padding-bottom: 0.4rem;
    width: 1.3rem;
    text-align: center;
    &-active {
      border-bottom: 2px solid rgba(0, 0, 0, 0.5);
      color: $color-orange;
    }
    &-inactive {
      opacity: 0.3;
    }
  }
  .disable-button {
    opacity: 0.3;
    cursor: not-allowed;
    pointer-events: none;
  }
</style>
