<template>
  <section class="order-recipients__container">
    <button
      class="order-recipients__cta"
      @click.prevent="toggleOrderRecipients"
    >
      <p
        class="order-recipients__dropdown"
        :class="{ 'order-recipients--triggered': showOrderRecipients }"
      >
        <arrow-dropdown :color="'#FC6345'" />
      </p>
      <p class="order-recipients__dropdown-text">
        send tickets to multiple email addresses ?
      </p>
    </button>
    <div v-if="showOrderRecipients">
      <div v-for="(ticket, index) in selectedTicketsInfo" :key="index">
        <order-recipients-for-ticket
          :selectedTicketsInfo="selectedTicketsInfo"
          :ticketIndex="index"
          :ticket="ticket"
          :tickets="tickets"
          :orderRecipients="formData"
          @orderRecipients="updateOrderRecipients"
          @copyPreviousAttendee="updateOrderRecipients"
        />
      </div>
    </div>
  </section>
</template>

<script>
import ArrowDropdown from '@/components/Global/Icons/ArrowDropdown';
import OrderRecipientsForTicket from './OrderRecipientsForTicket';

export default {
  name: 'order-recipients',
  props: {
    selectedTicketsInfo: Array,
    tickets: Array,
  },
  components: {
    ArrowDropdown,
    OrderRecipientsForTicket,
  },
  data() {
    return {
      showOrderRecipients: false,
      formData: [],
    };
  },
  methods: {
    toggleOrderRecipients() {
      this.showOrderRecipients = !this.showOrderRecipients;
    },
    updateOrderRecipients(recipient) {
      if (this.orderRecipientDataExists(recipient)) {
        const index = this.formData.findIndex(
          orderRecipient => orderRecipient.ticketIndex === recipient.ticketIndex,
        );
        this.formData[index] = recipient;
      } else {
        this.formData.push(recipient);
      }

      this.emitOrderRecipients();
    },
    orderRecipientDataExists(recipient) {
      return this.formData.some(
        orderRecipient => orderRecipient.ticketIndex === recipient.ticketIndex,
      );
    },
    allRecipientsFilled() {
      if (this.showOrderRecipients) {
        return !this.formData.some(orderRecipient => orderRecipient.allRecipientsFilled === false);
      }
      return true;
    },
    emitOrderRecipients() {
      const orderRecipientData = this.formData.map(recipient => recipient.data);

      this.$emit('emitOrderRecipients', {
        data: orderRecipientData.flat(),
        allRecipientsFilled: this.allRecipientsFilled(),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.order-recipients {
  &__container {
    padding: 1.8rem 3rem;
    margin-bottom: 2rem;
    @media screen and (min-width: 768px) {
      padding: 1.8rem 5rem;
    }
  }
  &__cta {
    border: none;
    background: rgba(252, 99, 69, 0.1);
    padding: 1.2rem 2.1rem 1.2rem 2.4rem;
    font-size: 1rem;
    color: $color-orange;
    display: flex;
    width: 100%;
    font-family: inherit;
    font-weight: 300;
    border-radius: 4px;
    margin: 0 auto;
    cursor: pointer;
    @media screen and (min-width: 768px) {
      font-size: 1.4rem;
    }
  }
  &__dropdown {
    transform: rotate(-90deg);
    line-height: 1;
    color: $--color-white;
    &-text {
      margin-left: 1.6rem;
      line-height: 1;
      @media screen and (min-width: 768px) {
        margin-left: 1.2rem;
      }
    }
  }
  &--triggered {
    animation: rotateChevron 0.2s linear;
    animation-fill-mode: forwards;
    animation-iteration-count: 1;
  }
}
@keyframes rotateChevron {
  50% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(90deg);
  }
}
</style>
