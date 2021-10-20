<template>
  <div class="alert" v-if="show">
    <div class="alert__icon" v-if="showIcon"><i class="el-icon-info"></i></div>
    <div class="alert__message" v-if="actionPosition === 'right'">
      <p>
        <span>{{ text }}</span>
        <a 
          class="cta"
          :class="{'u-button--disabled': disabledStatus}"
          v-if="action"
          :disabled="disabledStatus"
          @click="$emit('clicked')">
          {{ actionText }}
        </a>
      </p>
    </div>
    <div class="alert__message" v-else>
      <p>
        <a 
          class="cta"
          :class="{'u-button--disabled': disabledStatus}"
          v-if="action"
          :disabled="disabledStatus"
          @click="$emit('clicked')">
          {{ actionText }}
        </a>
        <span>{{ text }}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showIcon: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      required: true,
    },
    action: {
      type: String,
    },
    actionPosition: {
      type: String,
      default: 'right',
    },
    disabledStatus: {
      type: Boolean,
      default: false,
    },
    show: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    text() {
      return this.actionPosition === 'left' ? `${this.title}` : `${this.title}${this.action ? ',' : ''}`;
    },
    actionText() {
      return this.actionPosition === 'left' ? `${this.action}, ` : `${this.action}`;
    },
  },
};
</script>

<style lang="scss" scoped>
  .alert {
    margin-bottom: 0.75rem;
    &__icon {
      margin-right: 10px;
      padding: 5px 0;
      position: relative;
      i {
        font-size: 2.4rem;
        color: $color-orange;
      }
    }
    &__message {
      p {
        font-size: 14px;
        color: rgba($color: #000000, $alpha: 0.7);
        line-height: 1.2;
        @media screen and (max-width: 767px) {
          font-size: 1.4rem;
        }
      }
    }
  }
  .cta {
    color: $--color-pink;
  }
</style>
