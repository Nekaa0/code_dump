<template>
  <div>
    <h5 class="plan__header">{{ title }}</h5>
    <p class="plan-duration">{{ duration }} month{{ duration > 1 ? 's' : ' '}} access to tix pro</p>
    <p class="plan-features">unlimited access to all tix pro features</p>
    <p class="plan-amount">{{ amount }}</p>
    <el-button type="primary" class="u-button u-button--medium" @click="pay" :loading="processing">{{ title }}</el-button>
    <div class="pro-bonus__text">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'billing-popup-plan',
  props: {
    title: String,
    duration: Number,
    amount: String,
    plan_code: String,
  },
  data() {
    return {
      processing: false,
    };
  },
  methods: {
    pay() {
      this.processing = true;
      this.$emit('pay', this.plan_code);
      this.processing = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.plan {
  &__header {
    font-size: 1.6rem;
  }
  &-duration {
    padding-top: 2rem;
  }
  &-features, &-duration, &-amount {
    font-size: 1.2rem;
    line-height: 1.2;
  }
  &-features {
    padding: 1.5rem 0;
  }
  &-amount {
    padding-bottom: 2.6rem;
    color: $color-orange;
  }
  @media screen and (min-width: 768px) {
    &__header {
      font-size: 1.4rem;
      padding-top: 3.4rem;
    }
    &-duration {
      padding-top: 2.2rem;
    }
    &-features {
      padding: 1.5rem 0;
    }
    &-features, &-duration, &-amount {
      font-size: 1.2rem;
    }
    &-amount {
      padding-bottom: 2.3rem;
    }
  }
}
.u-button {
  width: 12rem;
  font-size: 1.2rem;
}
.pro-bonus__text {
  font-size: 1rem;
  margin-top: 0.9rem;
  @media screen and (max-width: 768px) {
    margin-top: 1.6rem;
  }
}
</style>
