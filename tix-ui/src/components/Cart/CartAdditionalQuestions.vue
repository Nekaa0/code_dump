<template>
  <div v-if="selectedTickets.length && orderAnswers.length">
    <div class="horizontal--line" />
    <div class="custom-fields__container">
      <p class="custom-fields__header">additional information</p>
      <div v-for="(orderAnswer, index) in orderAnswers" :key="index">
        <el-form-item :label="orderAnswer.question_text" :required="orderAnswer.required">
          <el-input @input="emitOrderAnswers" v-model.trim="orderAnswer.answer" />
        </el-form-item>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { pick, find, xor, some } from 'lodash';

export default {
  name: 'additional-questions',
  props: {
    tickets: Array,
    selectedTickets: Array,
  },
  data() {
    return {
      orderAnswers: [],
      ticketsSelectedIds: [],
      customFields: [],
    };
  },
  created() {
    this.customFields = this.ticketsWithCustomFields();
  },
  watch: {
    selectedTickets(selectedTickets) {
      this.setOrderAnswers(selectedTickets);
      this.emitOrderAnswers();
    },
  },
  methods: {
    setOrderAnswers(selectedTickets) {
      const selectedTicketsIds = this.getSelectedTicketsIds(selectedTickets);
      if (selectedTicketsIds.length < this.ticketsSelectedIds.length) {
        this.removeCustomFieldOfDeselectedTicket(selectedTicketsIds);
      }
      this.addCustomFieldQuestion(selectedTicketsIds);
    },
    removeCustomFieldOfDeselectedTicket(selectedTicketsIds) {
      const deselectedTicket = _.xor(selectedTicketsIds, this.ticketsSelectedIds);
      const ticketCustomFields = this.customFieldForTicket(deselectedTicket[0]);
      if (ticketCustomFields) {
        ticketCustomFields.forEach((customField) => {
          _.remove(this.orderAnswers, customField);
        })
      }
    },
    addCustomFieldQuestion(selectedTicketsIds) {
      selectedTicketsIds.forEach((ticketId) => {
        const ticketCustomFields = this.customFieldForTicket(ticketId);
        if (!ticketCustomFields) { return; }
        if (this.customFieldIsDisplayed(ticketId)) { return; }
        ticketCustomFields.forEach((customField) => {
          customField.answer = '';
          this.orderAnswers.push(customField);
        })
      });
      this.ticketsSelectedIds = selectedTicketsIds;
    },
    getSelectedTicketsIds(selectedTickets) {
      const ticketIds = [];
      selectedTickets.forEach((ticket) => {
        ticketIds.push(ticket.ticket);
      });
      return ticketIds;
    },
    customFieldForTicket(ticketId) {
      const ticketCustomFields = _.find(this.customFields, ['id', ticketId]);
      return ticketCustomFields ? ticketCustomFields.customFields : null;
    },
    customFieldIsDisplayed(ticketId) {
      return this.ticketsSelectedIds.find(tId => tId === ticketId);
    },
    ticketsWithCustomFields() {
      const ticketsCustomFields = [];
      this.tickets.forEach((ticket) => {
        if (ticket.customFields.edges.length === 0) { return; }
        ticketsCustomFields.push({
          id: ticket.id,
          customFields: this.formatCustomFields(ticket.customFields),
        });
      });
      return ticketsCustomFields;
    },
    formatCustomFields(customFields) {
      const formattedCustomFields = customFields.edges.map(value => _.pick(value.node, [ 'id', 'question_text', 'required']));
      return formattedCustomFields;
    },
    requiredFieldsAreNotFilled() {
      return _.some(this.orderAnswers, { answer: '', required: true })
    },
    emitOrderAnswers() {
      this.$emit('emitOrderAnswersData', [this.orderAnswers, this.requiredFieldsAreNotFilled()]);
    },
  },
};
</script>

<style lang="scss" scoped>
  .custom-fields {
    &__header {
      font-size: 18px;
      line-height: 1.5;
      margin: 2rem 0;
      color: rgba(0, 0, 0, 0.5);
    }
    &__container {
      padding: 0.5rem 5rem 2rem;
      @media screen and (max-width: 480px) {
        padding: 1rem 3rem;
      }
    }
  }
  .horizontal--line {
    height: 1px;
    background: rgba($color: #000000, $alpha: 0.2);
  }
</style>
