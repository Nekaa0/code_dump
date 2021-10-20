<template>
  <div class="order__summary">
    <p class="order__summary--title">order summary</p>
    <div class="order__summary--item">
      <div v-for="ticket in ticketsPurchased" :key="ticket.id">
        <span>{{ ticket.quantityOrdered }} x {{ ticket.ticket.name }}</span>
        <span v-if="ticketPrice(ticket.ticket) > 0">{{ ticket.quantityOrdered * ticketPrice(ticket.ticket) | currency(currency, 0, { spaceBetweenAmountAndSymbol: symbolSpace }) }}</span>
        <span v-else>free</span>
      </div>
    </div>
    <div class="order__summary--price">
      <div class="order__summary--price--item">
        <el-tooltip content="tix.africa's fee is nonrefundable" placement="right" effect="light">
          <span>fees</span>
        </el-tooltip>
        <span>{{ orderCost.fees | currency(currency, 0, { spaceBetweenAmountAndSymbol: symbolSpace })}}</span>
      </div>
      <div class="order__summary--price--item" v-if="!hideDiscount">
        <span>discount</span>
        <span>- {{ orderCost.discount | currency(currency, 0, { spaceBetweenAmountAndSymbol: symbolSpace })}}</span>
      </div>
      <div class="order__summary--price--item">
        <span>subtotal</span>
        <span v-if="orderCost.subtotal > 0">{{ orderCost.subtotal | currency(currency, 0, { spaceBetweenAmountAndSymbol: symbolSpace })}}</span>
        <span v-else>free</span>
      </div>
      <div class="order__summary--price--total">
        <span>total</span>
        <span>{{ total | currency(currency, 0, { spaceBetweenAmountAndSymbol: symbolSpace })}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ticketsPurchased: Array,
    orderCost: Object,
    price: [Number, String],
    currency: String,
  },
  data() {
    return {
      symbolSpace: true,
    };
  },
  computed: {
    total() {
      return this.orderCost.subtotal;
    },
    hideDiscount() {
      return this.orderCost.discount === 0;
    },
  },
  methods: {
    ticketPrice(ticket) {
      return Number(ticket.price);
    },
  },
};
</script>

<style lang="scss">
.el-tooltip__popper.is-light {
  background-color: $color-orange;
  border: none;
  color: white;
}
</style>

<style lang="scss" scoped>
.order__summary {
  &--title {
    color: rgba(black, 0.5);
    font-size: 18px;
    margin-bottom: 1rem;
    font-weight: 300;
  }
  &--item {
    border-bottom: 1px solid rgba(black, 0.2);
    padding: 20px 0;
    margin-bottom: 2rem;
  }
  &--item>div {
    margin-bottom: 1.5rem;
  }
  &--item>div, &--price--item, &--price--total {
    font-weight: 300;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    @media screen and (max-width: 480px) {
      font-size: 12px;
    }
  }
  &--price--item {
    margin-bottom: 1.5rem;
  }
  &--price--total {
    border-top: 1px solid rgba(black, 0.2);
    padding-top: 20px;
    color: $color-orange;
    font-size: 18px;
  }
  &--price {
    margin-bottom: 5rem;
  }
}
</style>