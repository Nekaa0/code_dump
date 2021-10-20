<template>
  <div class="step" :class="{ 'has-margin': step.hasMargin, 'has-step': step.showStep }">
    <navigation :admin="false" />
    <div class="cart-step">
      <div class="circle" />
      <div class="cart-step__text">
        <p>{{step.title}}</p>
        <span v-if="step.showStep">step {{step.current}}/{{step.total}}</span>
      </div>
      <div class="cancel" @click.prevent="$emit('cancel')" v-if="step.current === 0 || step.current === 1 || step.current === 3">
          <img src="@/assets/x.svg" alt="Cancel button" >
      </div>
    </div>
    <div class="horizontal-line" />
  </div>
</template>

<script>
export default {
  props: {
    step: {
      type: Object,
      default() {
        return {
          current: 0,
          total: 0,
          title: '',
          hasMargin: true,
          showStep: true,
        };
      },
    },
  },
};
</script>

<style  lang="scss" scoped>
.step {
  @media screen and (min-width: 481px) {
    display: none;
  }
}
.step.has-margin {
  margin-bottom: 3.5rem;
}
.circle {
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background-color: $color-orange;
  margin-right: 2rem;
}
.horizontal-line {
  margin: 0 3rem;
  height: 1px;
  background-color: rgba(#000000, 0.05);
}
.cancel {
  height: 24px;
  width: 24px;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
  }

}
.cart-step {
  display: flex;
  align-items: center;
  padding: 2.5rem 3rem 2.5rem 3rem;

  &__text {
    width: 80%;
    p {
      font-weight: 300;
      font-size: 16px;
    }

    span {
      font-weight: 300;
      font-size: 12px;
    }

  }
  .has-step & {
    padding-bottom: 1.5rem;
    &__text {
      margin-top: 15px;
    }
  }

}
</style>
