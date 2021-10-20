<template>
  <div class="new-discount">
    <div class="discount-type">
      <div class="discount-type__header">
        <form-header title="create discount"></form-header>
      </div>
      <div class="discount-type__list" v-for="option in types" :key="option.id" @click="selectType(option.type)">
        <div class="discount-type__personal">
          <div class="discount-type__details">
            <div class="discount-type__icon">
              <img :src="option.image" alt="discount code" />
            </div>
            <div class="discount-type__text">
              <p class="discount-type__text__title">{{ option.title }}</p>
              <p class="discount-type__text__detail">{{ option.label }}</p>
            </div>
          </div>
          <div class="discount-type__step" :class="{ 'current-step': selected === option.type }">
          </div>
        </div>
      </div>
      <div class="discount-type__buttons">
        <button class="u-button u-button--grey" @click="$emit('back')">
          back
        </button>
        <button class="u-button" :class="{'u-button--disabled': selected === ''}" :disabled="selected === ''" @click="$emit('next',selected)">
          next
        </button>
      </div>
    </div>
  </div>
</template>


<script>
/* eslint-disable global-require */
import IsMobile from '@/mixins/IsMobile';
import FormHeader from '@/components/Global/FormHeader';

export default {
  mixins: [IsMobile],
  components: {
    FormHeader,
  },
  props: {
    eventId: String,
  },
  data() {
    return {
      selected: '',
      types: [
        {
          id: 1,
          title: 'discount code',
          label: 'guests will get a discount if they enter a code at checkout',
          image: require('@/assets/discount.svg'),
          type: 'manual',
        },
        {
          id: 2,
          title: 'automatic discount',
          label: 'guests will get a discount automatically in their cart',
          image: require('@/assets/cart.svg'),
          type: 'automated',
        },
      ],
    };
  },
  methods: {
    selectType(type) {
      if (this.selected === type) {
        this.selected = '';
      } else {
        this.selected = type;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  p {
    line-height: 1.7rem;
  }
  .new-discount {
    .discount-type {
      @media screen and (min-width: 768px) {
        margin: 4% auto;
      }
      @media screen and (min-width: 1200px) {
        margin-right: 10%;
      }
      @media screen and (max-width: 767px) {
        width: auto;
        margin: 0 6%;
      }
      &__header {
        margin-bottom: 4rem;
        @media screen and (max-width: 767px) {
          padding: 8% 0;
        }
      }
      &__list {
        padding: 1.7rem 1.4rem 2.3rem;
        margin-bottom: 1rem;
        background-color: $--background-color-gray;
        border-radius: 5px;
      }
      &__personal {
        display: flex;
      }
      &__business {
        display: flex;
      }
      &__text {
        &__detail {
          opacity: 0.5;
          font-size: 1.2rem;
          padding-top: 0.7rem;
          @media screen and (max-width: 450px) {
            margin-right: 0.5rem;
          }
        }
      }
      &__details {
        display: flex;
        align-items: center;
        flex: 1;
      }
      &__buttons {
        margin-left: 0.4rem;
        margin-top: 3rem;
        display: flex;
      }
      &__icon {
        padding-right:2.2rem;
        padding-left: 1.1rem;
        min-width: 5rem;
        @media screen and (max-width: 450px) {
          padding-left: 0;
        }
      }
      &__step {
        width: 1.3rem;
        height: 1.3rem;
        border-radius: 50%;
        float: right;
        background: grey;
      }
      .current-step {
        background: $--color-deep-green;
      }
    }
  }
  .u-button {
    margin-right: 1.6rem;
  }
</style>
