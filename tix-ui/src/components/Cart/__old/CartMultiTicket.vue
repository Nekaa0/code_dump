<template>
  <div class="ticket-option">
    <div class="ticket-body">
      <div class="details">
        <h3>
          {{ value.name }} -
          <span class="price">
            <span v-if="value.price == 0">Free</span>
            <span v-else>{{ value.price | currency('NGN', 0, { spaceBetweenAmountAndSymbol: true })}}</span>
          </span>
        </h3>
        <p>
          {{ value.about }}
        </p>
      </div>
    </div>
    <div class="ticket-actions">
      <div v-if="inStock">
        <el-input-number v-if="value.limit" v-model="value.count" controls-position="right" :min="0" :max="5" />
        <el-input-number v-else v-model="value.count" controls-position="right" :min="0" />
        <div class="limit" v-if="!value.unlimited && value.limit < 10">Only {{ value.limit }} in stock</div>
      </div>
      <div v-else class="limit">Out of stock</div>
    </div>
  </div>
</template>

<script>
import { InputNumber } from 'element-ui';

export default {
  name: 'cart-multi-ticket',
  components: {
    ElInputNumber: InputNumber,
  },
  props: {
    data: Object,
  },
  data() {
    return {
      value: this.data,
    };
  },
  computed: {
    inStock() {
      return this.value.unlimited || this.value.limit > 0;
    },
  },
  watch: {
    count() {
      this.$emit('update', this.value);
    },
  },
};
</script>

<style lang="scss" scoped>
.ticket-option {
  position: relative;
  display: flex;
  margin-bottom: 10px;
  padding: 20px 30px;
  border: solid 1px rgba($color: #000000, $alpha: 0.07);
  box-shadow: 0 1px 2px rgba($color: #000000, $alpha: 0.05);
  background: white;
  border-radius: 5px;
}

.ticket-body {
  flex: 1;
  margin-right: 10px;
  display: flex;
  align-items: center;

  .details {
    flex: 1;
    h3 {
      margin: 0;
      font-size: 1.5rem;
    }
    p {
      margin: 0;
      font-size: 1.4rem;
      span {
        color: $color-muted;
      }
    }
  }
}

.ticket-actions {
  .el-input-number {
    width: 130px;
  }
  .limit {
    font-size: 1.2rem;
    text-align: right;
    margin-top: 7px;
    color: $color-orange;
    font-weight: bold;
  }
}
</style>
