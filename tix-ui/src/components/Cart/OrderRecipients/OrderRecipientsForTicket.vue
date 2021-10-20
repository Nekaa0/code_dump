<template>
  <section>
    <order-recipient-form
      v-for="(orderRecipient, index) in ticket.quantity"
      :key="index"
      :ticketIndex="ticketIndex"
      :orderRecipientCount="index + 1"
      :ticketSchedule="ticket.ticketSchedule"
      :ticketName="ticketName"
      :orderRecipients="orderRecipients"
      :selectedTicketsInfo="selectedTicketsInfo"
      @order-recipient-data="updateOrderRecipients"
      @deleteRecipientData="deleteRecipientData"
      @copyPreviousAttendee="emitOrderRecipients"
    />
  </section>
</template>

<script>
import OrderRecipientForm from './OrderRecipientForm';

export default {
  name: 'order-recipients-for-ticket',
  components: { OrderRecipientForm },
  props: {
    ticket: Object,
    tickets: Array,
    ticketIndex: Number,
    orderRecipients: Array,
    selectedTicketsInfo: Array,
  },
  data() {
    return {
      formData: [],
    };
  },
  mounted() {
    this.emitOrderRecipients();
  },
  computed: {
    ticketName() {
      const ticket = this.tickets.find(t => t.id === this.ticket.ticket);
      return ticket.name;
    },
    firstNameNotFilled() {
      return this.formData.some(orderRecipient => orderRecipient.firstName === '');
    },
    lastNameNotFilled() {
      return this.formData.some(orderRecipient => orderRecipient.lastName === '');
    },
    emailNotFilled() {
      return this.formData.some(orderRecipient => orderRecipient.email === '');
    },
    allRecipientsFilled() {
      return !this.firstNameNotFilled && !this.lastNameNotFilled && !this.emailNotFilled;
    },
  },
  methods: {
    updateOrderRecipients(orderRecipientData) {
      if (this.orderRecipientDataExists(orderRecipientData)) {
        const index = this.formData.findIndex(
          orderRecipient => orderRecipient.id === orderRecipientData.id,
        );
        this.formData[index] = orderRecipientData;
      } else {
        this.formData.push(orderRecipientData);
      }

      this.emitOrderRecipients();
    },
    orderRecipientDataExists(orderRecipientData) {
      return this.formData.some(orderRecipient => orderRecipient.id === orderRecipientData.id);
    },
    deleteRecipientData() {
      this.formData.pop();
      this.emitOrderRecipients();
    },
    emitOrderRecipients() {
      const orderRecipientData = this.formData.map((recipient) => {
        const { ticketSchedule, firstName, lastName, email } = recipient;
        return {
          ticketSchedule,
          firstName,
          lastName,
          email,
        };
      });
      this.$emit('orderRecipients', {
        data: orderRecipientData,
        allRecipientsFilled: this.allRecipientsFilled,
        ticketIndex: this.ticketIndex,
      });
    },
  },
};
</script>
