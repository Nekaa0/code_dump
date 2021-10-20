<template>
  <div>
    <div v-if="isFetching || activePageOrders.length">
      <section class="orders-table">
        <div class="orders-table__header hide-on-mobile">
          <span
            v-for="(header, index) in tableHeaders"
            :key="index"
            class="orders-header"
          >
            {{ header }}
          </span>
        </div>
        <div class="orders-table__body">
          <order-list-item
            :activePageOrders="activePageOrders"
            :isFetching="isFetching"
            @open-order="emitSelectedOrder"
          />
        </div>
      </section>
    </div>
    <div v-else></div>
  </div>
</template>

<script>
import OrderListItem from './OrderListItem';

export default {
  name: 'order-summary',
  components: {
    OrderListItem,
  },
  props: {
    activePageOrders: {
      type: Array,
      required: true,
      default: [],
    },
    isFetching: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      tableHeaders: [
        'ticket name',
        'quantity',
        'buyer name',
        'order number',
        'order date',
      ],
    };
  },
  methods: {
    emitSelectedOrder(selectedOrder) {
      this.$emit('open-order', selectedOrder);
    },
  },
};
</script>

<style lang="scss" scoped>
.orders {
  &-header {
    font-size: 1.4rem;
    font-weight: 300;
    padding-bottom: 0.9rem;
    width: 80%;
    max-width: 12.4rem;
    &:first-child {
      width: 120%;
      padding-left: 1.5rem;
      max-width: 20.6rem;
    }
    &:nth-child(2) {
      width: 85%;
      max-width: 10rem;
    }
    &:nth-child(3) {
      width: 100%;
      max-width: 20.8rem;
    }
  }
  &-table {
    width: 100%;
    line-height: 1.2;
    font-weight: 300;
    margin-top: 2.7rem;
    &__header {
      display: flex;
      justify-content: space-between;
    }
  }
}
.skeleton {
  &-animation {
    margin-right: 2.5rem;
    &-mobile {
      width: 12rem;
      &-date {
        margin-right: 0;
        width: 9rem;
      }
    }
  }
}
.hide-on-mobile {
  @media screen and (max-width: 599px) {
    display: none;
  }
}
</style>

