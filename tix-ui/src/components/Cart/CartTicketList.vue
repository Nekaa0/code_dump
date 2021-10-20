<template>
  <div>
    <div v-if="isCustomUser">
      <div v-for="(option, index) in groupedTicketList" :key="index">
        <p class="ticket-heading">{{option.group}}</p>
        <div v-for="ticket in option.children" :key="ticket.id">
          <cart-ticket v-bind="ticket" :ticketQuantities="ticketQuantities" :currency="currency" @select="select" @clear="clear" :windowWidth="windowWidth" :event="event" />
        </div>
      </div>
    </div>
    <div v-else>
      <div v-for="ticket in ticketOptions" :key="ticket.id">
        <cart-ticket v-bind="ticket" :ticketQuantities="ticketQuantities" :currency="currency" @select="select" @clear="clear" :windowWidth="windowWidth" :event="event" />
      </div>
    </div>
  </div>
</template>

<script>
import CartTicket from './CartTicket';

export default {
  name: 'cart-ticket-list',
  components: {
    CartTicket,
  },
  props: {
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    options: {
      type: Array,
      default() {
        return [];
      },
    },
    windowWidth: {
      type: Number,
    },
    schedule: {
      type: Array,
    },
    event: Object,
    currency: String,
  },
  data() {
    return {
      ticketsSelected: [],
      ticketQuantities: this.initialQuantityValues(),
    };
  },
  computed: {
    ticketOptions() {
      return this.options.map(ticket => Object.assign({
        selected: this.ticketsSelected.includes(ticket.id),
        schedule: this.schedule.find(option => option.ticket === ticket.id),
        perks: ticket.perks && ticket.perks.split('/n').join(', '),
      }, ticket));
    },
    groupedTicketList() {
      return Object.values(this.groupTickets(this.ticketOptions));
    },
    customEmails() {
      return process.env.CUSTOM_EMAIL.split(',');
    },
    isCustomUser() {
      return this.customEmails.includes(this.event.user.email);
    },
  },
  created() {
    if (this.options.length === 1) this.select(this.options[0].id);
  },
  methods: {
    select(ticket) {
      if (!this.ticketsSelected.includes(ticket)) {
        this.ticketsSelected = [...this.ticketsSelected, ticket];
      }
      this.$emit('input', [this.ticketsSelected, this.ticketQuantities]);
    },
    clear(ticket) {
      this.ticketsSelected = this.ticketsSelected.filter(tId => tId !== ticket);
      this.$emit('input', [this.ticketsSelected, this.ticketQuantities]);
    },
    initialQuantityValues() {
      const dataValues = {};
      this.options.forEach((ticket) => {
        dataValues[ticket.id] = null;
      });
      return dataValues;
    },
    groupTickets(data) {
      if (this.isCustomUser) {
        return data.reduce((r, e) => {
          const group = e.name.split(':')[0];
          // eslint-disable-next-line
          if (!r[group]) r[group] = { group, children: [e] };
          else r[group].children.push(e);
          return r;
        }, {});
      }
      return data;
    },
  },
};
</script>

<style lang="scss" scoped>
  .quantity-input {
    margin-bottom: 10px;
  }
  .ticket-heading {
    margin-bottom: 1rem;
  }
</style>
