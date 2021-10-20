<template>
  <div class="ticket" :class="{ 'ticket--is-disabled': isDisabled, 'ticket--is-selected': selected }">
    <div class="ticket__header" :class="{'low-stock': lowStock, 'sold-out': !inStock }">
      <div class="ticket__info">
        <div class="ticket__name">
          <p>{{ name }} <span v-if="inviteOnly">(invite)</span></p>
        </div>
        <div class="ticket__pricing">
          <div v-if="inStock">
            <div class="ticket__price">
              <span v-if="price == 0">free</span>
              <span v-else>{{ totalPrice | currency(currency, 0, { spaceBetweenAmountAndSymbol: true })}}</span>
              <span class="ticket__price-notice" v-show="price != 0">{{ transferFeeNotification }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="ticket__limit-warning" v-if="lowStock">
        <span v-if="inStock">{{ schedule.limit }} remaining</span>
        <span v-else>sold out</span>
      </div>
      <div class="ticket__select" v-if="inStock">
        <el-form-item prop="quantity" class="ticket__select--form" v-if="inviteOnly">
          <select
            v-model="ticketQuantities[id]"
            class="ticket__select--input"
            @change="emitSelectedTicket"
          >
            <option label="" :value="null" />
            <option
              v-for="item in 1"
              :key="item"
              :label="item"
              :value="item">
              {{ item }}
            </option>
          </select>
        </el-form-item>
        <el-form-item prop="quantity" class="ticket__select--form" v-else>
          <select
            v-model="ticketQuantities[id]"
            class="ticket__select--input"
            @change="emitSelectedTicket"
            v-if="unlimited"
          >
            <option label="" :value="null" />
            <option
              v-for="item in 5"
              :key="item"
              :label="item"
              :value="item">
              {{ item }}
            </option>
          </select>
          <div v-else>
            <select
              v-model="ticketQuantities[id]"
              class="ticket__select--input"
              @change="emitSelectedTicket"
              v-if="inStock"
              :disabled="limit === 0"
            >
              <option label="" :value="null" />
              <option
                v-for="item in newLimit()"
                :key="item"
                :label="item"
                :value="item">
                {{ item }}
              </option>
            </select>
          </div>
        </el-form-item>
      </div>
    </div>
    <div v-if="windowWidth > 480">
      <div class="ticket__description">
        {{ about }}
      </div>
      <div class="ticket__perks-and-quantity" >
        <div class="ticket__perks">
          <div v-if="formattedPerks">
            <p v-if="viewMore" @click="viewMore = !viewMore">see more</p>
            <div v-else>
              <span>perks: </span> {{ formattedPerks }}
              <p @click="viewMore = !viewMore">see less</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div class="ticket__description">
        {{ description }}
        <span class="see-more" v-if="largeDescription && viewMore" @click="viewMore = !viewMore">see more</span>
        <span class="see-more" v-if="hasPerks  && viewMore" @click="viewMore = !viewMore">see more</span>
        <div class="ticket__perks-and-quantity" v-if="!viewMore">
          <div class="ticket__perks"  v-if="formattedPerks">
            <span>perks: </span> {{ formattedPerks }}
          </div>
          <span class="see-more" @click="viewMore = !viewMore">see less</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { InputNumber } from 'element-ui';

export default {
  name: 'cart-ticket',
  components: {
    ElInputNumber: InputNumber,
  },
  props: {
    id: String,
    name: String,
    limit: [Number, String],
    unlimited: Boolean,
    price: [Number, String],
    about: String,
    perks: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    transferFees: Boolean,
    priceWithFees: String,
    inviteOnly: Boolean,
    ticketQuantities: {
      type: Object,
    },
    windowWidth: {
      type: Number,
    },
    event: Object,
    schedule: Object,
    currency: String,
  },
  created() {
    if (this.about.length > this.descriptionLimit) {
      this.largeDescription = true;
    } else if (this.formattedPerks && this.about.length < this.descriptionLimit) {
      this.hasPerks = true;
    }
    this.clearTicket(this.id);
  },
  data() {
    return {
      viewMore: true,
      largeDescription: false,
      hasPerks: false,
      descriptionLimit: 140,
    };
  },
  computed: {
    description() {
      let val = this.about;
      if (this.viewMore) {
        val = val.slice(0, this.descriptionLimit);
      }
      return val;
    },
    inStock() {
      return this.unlimited || this.schedule.limit > 0;
    },
    lowStock() {
      return !this.unlimited && this.schedule.limit <= 10;
    },
    isDisabled() {
      return !this.inStock || this.disabled;
    },
    formattedPerks() {
      if (!this.perks) return null;
      return this.perks.split('/n').join(', ');
    },
    totalPrice() {
      if (this.transferFees) return this.priceWithFees;
      return this.price;
    },
    transferFeeNotification() {
      if (this.transferFees) {
        return `including ${this.currency}${Math.round(this.priceWithFees - this.price)} in fees`;
      }
      return 'no fees included';
    },
  },
  watch: {
    count() {
      this.$emit('update', this.value);
    },
  },
  methods: {
    emitSelectedTicket() {
      if (this.ticketQuantities[this.id] === null) {
        this.clearTicket();
      } else this.$emit('select', this.id);
    },
    clearTicket() {
      this.$emit('clear', this.id);
    },
    newLimit() {
      if (this.schedule.limit < 5) return this.schedule.limit;
      return 5;
    },
  },
};
</script>

<style lang="scss" scoped>
.ticket {
  background: white;
  border: 1px solid rgba($color: #000000, $alpha: 0.2);
  border-radius: 4px;
  transition: box-shadow .3s ease;
  margin: 0 0 25px;
  line-height: 1.5;
  padding: 15px 20px;
  @media screen and (max-width: 767px) {
    padding: 15px;
  }
  &--is-disabled {
    opacity: 0.8;
    pointer-events: none;
    cursor: not-allowed;
  }
  &__header {
    display: flex;
  }
  &__info {
    width: 80%;
    .low-stock & {
      width: 60%;
      @media screen and (max-width: 480px){
        width: 55%;
      }
    }
    .sold-out & {
      width: 80%;
    }
  }
  &__select {
    width: 20%;
    &--input {
      padding: 1rem;
      width: 100%;
      border: 1px solid rgba(0, 0, 0, 0.2);
      color: rgba($color-black, 0.7);;
      -moz-appearance: none;
      -webkit-appearance: none;
      background-repeat: no-repeat, repeat;
      background-position: right 1rem top 50%, 0 0;
      background-size: 1rem auto, 100%;
      cursor: pointer;
      background-image: url("data:image/svg+xml,%3Csvg width='8' height='6' viewBox='0 0 8 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M7.06667 0.733307L8 1.66664L4 5.66664L-4.07973e-08 1.66664L0.933333 0.733307L4 3.79997L7.06667 0.733307Z' fill='%23333333'/%3E%3C/svg%3E%0A");
    }
    &--input:focus {
      outline: none;
    }
  }
  &__name, &__pricing {
    transition: color .3s ease;
  }
  &__name {
    font-size: 14px;
    margin: 0;
    .ticket--is-selected & {
      color: $color-orange;
    }
    .ticket--is-disabled & {
      color: $color-muted;
    }
  }
  &__pricing {
    font-size: 1.6rem;
    .ticket--is-selected & {
      color: $color-orange;
    }
  }
  &__price {
    color: $color-orange;
    font-size: 14px;
    font-weight: normal;
    &-notice {
      font-size: 10px;
      color: rgba($color: #000000, $alpha: 0.5);
    }
  }
  &__description {
    font-size: 12px;
    line-height: 1.4;
    font-weight: 300;
    color: rgba($color-black, 0.7);
    margin-top: 10px;
    &:not(.ticket--is-selected) & {
      color: $color-muted;
    }
    span.see-more {
      color: $color-orange;
    }
  }
  &__limit-warning {
    font-size: 12px;
    width: 20%;
    text-align: center;
    font-weight: 300;
    color: $color-muted;
    .low-stock & {
      margin-top: 10px;
    }
    .sold-out & {
      margin-top: 0px;
    }
    @media screen and (max-width: 480px){
      font-size: 10px;
      width: 25%;
    }
  }
  &__perks {
    margin-top: 5px;
    font-size: 12px;
    color: #000000;
    font-weight: 300;

    span {
      font-weight: 400;
    }

    p {
      cursor: pointer;
      color: $color-orange;
      size: 14px;
      font-weight: normal;
    }
  }
  &--is-selected {
    background: #fafafa;
  }
}
</style>
