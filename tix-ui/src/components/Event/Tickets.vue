<template>
  <section>
    <p>
      tix is free to use for free events.
      if you’re charging guests a fee, we charge a percentage of the value of ticket as a transaction processing fee.
    </p>
    <div class="info" v-if="eventFrequency !== 'once'">
      <img src="@/assets/address-tip.svg">
      <span>with a recurring event do not create tickets for each date your event occurs, all tickets you create will automatically show for each date of your event.</span>
    </div>
    <div class="list-header">
      <span>{{ createTicketCta.message }}</span>
      <div v-if="tickets.length">
        <div v-for="ticket in tickets" :key="ticket.id">
          <ticket-preview v-bind="ticket" :eventFrequency="eventFrequency" @onUpdate="$emit('updateEvent')" />
        </div>
      </div>
      <div class="create--ticket">
        <p>
          {{ createTicketCta.cta }}
        </p>
        <button class="create--ticket__button" @click="showNewTicketDialog">+</button>
      </div>
    </div>
    <el-dialog title="create ticket" width="500px" :visible.sync="createTicketDialogVisible" :close-on-click-modal="false">
      <ticket-form :ticket="{ event: this.eventId, status: 'active' }" @save="createTicket" :processing="processing" :reset="createTicketDialogVisible" :ticketHasOrder="false"
                    @close-ticket-form="createTicketDialogVisible = false"/>
    </el-dialog>
  </section>
</template>

<script>
import { Dialog } from 'element-ui';
import CREATE_TICKET from '@/graphql/CreateTicket.gql';
import ErrorHandler from '@/helpers/error-handler';
import TicketPreview from '@/components/Ticket/Preview';
import TicketForm from '@/components/Ticket/Form';

export default {
  name: 'event-tickets',
  components: {
    ElDialog: Dialog,
    TicketPreview,
    TicketForm,
  },
  props: {
    tickets: {
      type: Array,
      default() {
        return [];
      },
    },
    eventId: String,
    eventFrequency: String,
  },
  data() {
    return {
      processing: false,
      createTicketDialogVisible: false,
    };
  },
  computed: {
    createTicketCta() {
      const tickets = this.tickets.length;
      const ticketCount = `${tickets} ${tickets === 1 ? 'ticket' : 'tickets'}`;
      return {
        message: tickets ? `${ticketCount} created` : 'you don’t have any tickets created yet, create your first ticket',
        cta: 'add a ticket',
      };
    },
  },
  methods: {
    showNewTicketDialog() {
      this.createTicketDialogVisible = true;
    },
    createTicket(ticket) {
      this.processing = true;
      this.$apollo.mutate({
        mutation: CREATE_TICKET,
        variables: ticket,
      }).then(() => {
        this.processing = false;
        this.createTicketDialogVisible = false;
        this.$emit('updateEvent');
        this.$message.success('Ticket Created');
      }).catch((error) => {
        this.processing = false;
        ErrorHandler.throwGraphQLError(error);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  p {
    margin: 0;
    margin-bottom: 2rem;
    font-size: 1.4rem;
    line-height: 1.2;
    font-weight: 300;
    color: rgba($--color-black, 0.7);
  }
  .info {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 2rem;

    span {
      font-weight: 300;
      font-size: 14px;
      color: rgba($--color-black, 0.7);
      margin-left: 7.5px;
    }
  }
  .list-header {
    display: flex;
    flex-direction: column;
    padding: 0;
    span {
      color: $--color-green;
      font-size: 1.4rem;
    }
  }
  .create--ticket {
    height: 9.8rem;
    display: flex;
    align-items: center;
    width: 100%;
    border: 1px dashed $--color-green;
    border-radius: 4px;
    margin-top: 2.1rem;
    p {
      flex: 1;
      opacity: 0.3;
      line-height: 1.2;
      font-weight: 300;
      padding: 3.7%;
    }
    &__button {
      width: 10.5rem;
      float: right;
      height: 100%;
      border: none;
      background-color: $--color-pale-cyan;
      font-size: 4rem;
      line-height: 1.2;
      font-weight: 300;
      color: $--color-green;
      cursor: pointer;
      outline: none;
    }
  }
</style>
