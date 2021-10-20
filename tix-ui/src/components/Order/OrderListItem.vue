<template>
  <div>
    <div class="hide-on-mobile">
      <div v-if="isFetching">
        <div class="order" v-for="index in 10" :key="index">
          <span
            class="order-info-lg"
            v-for="index in 5"
            :key="index"
          >
            <div class="skeleton-animation"></div>
          </span>
        </div>
      </div>
      <div
        v-else-if="activePageOrders.length"
        class="order"
        v-for="(orderData, index) in activePageOrders"
        :key="index"
        @click="openOrder(index)"
      >
        <span
          class="order-info-lg"
          v-for="(orderInfo, index) in orderData"
          :key="index"
        >
          {{ orderInfo }}
        </span>
      </div>
    </div>
    <div class="orders-block--mobile hide-on-desktop">
      <div v-if="isFetching">
        <div
          v-for="index in 10"
          :key="index"
          class="order-sm"
        >
          <div class="order-info-sm">
            <p class="skeleton-animation skeleton-animation-mobile"></p>
            <p class="skeleton-animation skeleton-animation-mobile"></p>
          </div>
          <p class="skeleton-animation skeleton-animation-mobile-date"></p>
        </div>
      </div>
      <div
        v-else
        v-for="(orderData, index) in activePageOrders"
        :key="index"
        class="order-sm"
        @click="openOrder(index)"
      >
        <div class="order-info-sm">
          <p>{{ orderData.quantity }} * {{ orderData.ticketName }}</p>
          <p>{{ orderData.buyerFullName }}</p>
        </div>
        <p class="order-date">{{ orderData.orderDate }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'order-list-item',
  props: {
    activePageOrders: Array,
    isFetching: Boolean,
  },
  methods: {
    openOrder(selectedOrderIndex) {
      this.$emit('open-order', selectedOrderIndex);
    },
  },
};
</script>

<style lang="scss" scoped>
.order {
  color: rgba($color: $color-black, $alpha: 0.9);
  background-color: $--color-pale-cyan;
  margin-bottom: 0.7rem;
  text-transform: lowercase;
  display: flex;
  justify-content: space-between;
  text-align: left;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    color: $color-orange;
    transition: 300ms;
    transition-property: color;
  }
  &-info-lg {
    font-size: 1.2rem;
    line-height: 1.2;
    padding: 1.3rem 0;
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
}
.orders {
  &-block--mobile {
    width: 100%;
  }
}
.order {
  &-sm {
    background-color: $--color-pale-cyan;
    border-radius: 4px;
    margin-bottom: 0.8rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem 2.2rem 0.8rem 1.9rem;
  }
  &-info-sm {
    font-size: 1rem;
    display: flex;
    flex-direction: column;
    opacity: 0.9;
    p {
      &:first-child {
        margin-bottom: 0.6rem;
      }
    }
  }
  &-date {
    font-size: 1rem;
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
.hide-on-desktop {
  @media screen and (min-width: 600px) {
    display: none;
  }
}
.hide-on-mobile {
  @media screen and (max-width: 599px) {
    display: none;
  }
}
</style>
