<template>
  <div class="timer">
    <p v-if="showName">hi {{ name }},</p>
    <p>we’ve reserved your ticket{{ quantity > 1 ? 's' : '' }}
      please {{ onlyFreeTickets ? 'complete checkout' : 'make payment' }} within
      <span>{{ formattedCountdown }}</span>
      to secure your tickets.
    </p>
  </div>
</template>

<script>
export default {
  props: {
    timeout: Object,
    start: Boolean,
    name: String,
    quantity: Number,
    showName: false,
    onlyFreeTickets: Boolean,
  },
  data() {
    return {
      timer: null,
      countdown: null,
    };
  },
  created() {
    this.countdown = this.timeout.sessionTimeout;
    if (this.start) {
      this.startTimeout();
    }
  },
  beforeDestroy() {
    if (this.timer) {
      this.clearCountdown();
    }
  },
  computed: {
    formattedCountdown() {
      return new Date(this.countdown * 1000).toISOString().substr(14, 5);
    },
  },
  methods: {
    startTimeout() {
      this.timer = setInterval(() => {
        this.countdown = this.countdown - 1;
        if (this.countdown === 0) {
          window.clearInterval(this.timer);
          this.countdown = null;
          this.$emit('expired');
        }
      }, 1000);
    },
    clearCountdown() {
      window.clearInterval(this.timer);
      this.timer = null;
    },
  },
  watch: {
    start(val) {
      if (!val) {
        this.clearCountdown();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.timer {
  margin-bottom: 15px;
  @include keyframes(highlightTimer) {
    0%, 80% {
      background: #fff2ef;
    }
  }
  p {
    font-size: 14px;
    font-weight: 300;
    margin-bottom: 1.5rem;
    font-style: lowercase;
  }
  span {
    font-weight: bold;
    width: 4.3rem;
    text-align: center;
    display: inline-block;
    color: $color-orange;
    @include animation('highlightTimer 5s');
  }
}
</style>
