<template>
  <div>
    <tickets-list
      :title="name"
      :description="about"
      :topRightLabel="ticketPrice"
      :bottomRightLabel="limitMessage"
      :bottomRightWarning="isLimited"
      :inactive="isInactive"
      :showInvite="isInviteOnly"
      :disableDelete="buyers > 0"
      :eventFrequency="eventFrequency"
      disableDeleteMessage="You cannot delete this ticket because it has orders"
      @toggleStatus="toggleStatus"
      @edit="updateTicketDialogVisible = true"
      @delete="deleteTicket"
      @invite="inviteUserDialogVisible = true"
      @viewStock="viewTicketStock = true"
    />
    <el-dialog title="update ticket" width="500px" :visible.sync="updateTicketDialogVisible" :close-on-click-modal="false">
      <ticket-form :ticket="$props" @save="update" :processing="processing" :reset="updateTicketDialogVisible" :ticketHasOrder="ticketHasOrder"
                    @close-ticket-form="updateTicketDialogVisible = false" />
    </el-dialog>
    <el-dialog title="invite attendee" width="800px" :visible.sync="inviteUserDialogVisible" :close-on-click-modal="false">
      <invite-user-form :ticket="$props" @save="inviteUsersToEvent" :reset="inviteUserDialogVisible" :processingTestEmail="processingTestEmail" />
    </el-dialog>
    <el-dialog title="view ticket stock breakdown" width="800px" :visible.sync="viewTicketStock" :close-on-click-modal="true">
      <tickets-stock :schedules="schedules" />
    </el-dialog>
  </div>
</template>

<script>
import { Dialog } from 'element-ui';
import EDIT_TICKET from '@/graphql/EditTicket.gql';
import INVITE_USERS from '@/graphql/InviteUsersToEvent.gql';
import DELETE_TICKET from '@/graphql/DeleteTicket.gql';
import TOGGLE_STATUS from '@/graphql/ToggleStatus.gql';
import ErrorHandler from '@/helpers/error-handler';
import TicketsList from '@/components/Ticket/TicketsList';
import TicketsStock from '@/components/Ticket/Stock';
import Auth from '@/helpers/auth';
import TicketForm from './Form';
import InviteUserForm from './InviteUserForm';

export default {
  name: 'ticket-summary',
  components: {
    TicketsList,
    ElDialog: Dialog,
    TicketForm,
    TicketsStock,
    InviteUserForm,
  },
  props: {
    id: String,
    createdAt: [Date, Number],
    name: String,
    about: String,
    price: [Number, String],
    unlimited: Boolean,
    limit: [Number, String],
    perks: String,
    status: String,
    buyers: Array,
    inviteOnly: Boolean,
    inviteesMessage: String,
    transferFees: Boolean,
    priceWithFees: String,
    customFields: Object,
    eventFrequency: String,
    ticketSchedules: Object,
  },
  data() {
    return {
      processing: false,
      updateTicketDialogVisible: false,
      inviteUserDialogVisible: false,
      viewTicketStock: false,
      localStatus: this.status,
      sales: 0,
      processingTestEmail: false,
    };
  },
  computed: {
    ticketHasOrder() {
      if (this.buyers) return this.buyers.length > 0;
      return false;
    },
    isInactive() {
      return this.localStatus !== 'active';
    },
    ticketPrice() {
      const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: `${Auth.userCurrency()}` });
      return Number(this.price) === 0 ? 'free' : `${currencyFormatter.format(this.price)}`;
    },
    limitMessage() {
      if (this.eventFrequency !== 'once') return 'view ticket stock';
      if (this.unlimited) return 'unlimited';
      return this.schedules[0].limit === 0 ? 'out of stock' : `${this.schedules[0].limit} in stock`;
    },
    isLimited() {
      return !this.schedules[0].unlimited && this.schedules[0].limit <= 10;
    },
    isInviteOnly() {
      return this.inviteOnly;
    },
    inStock() {
      return this.schedules[0].unlimited || this.schedules[0].limit > 0;
    },
    formattedPerks() {
      if (!this.perks) return null;
      return this.perks.split('/n').join(', ');
    },
    schedules() {
      return this.ticketSchedules.edges.map(value => value.node);
    },
  },
  methods: {
    emit(value) {
      this.$emit(value);
    },
    toggleStatus() {
      const statusReplacer = { inactive: 'active', active: 'inactive' };
      this.localStatus = statusReplacer[this.localStatus];
      this.$apollo.mutate({
        mutation: TOGGLE_STATUS,
        variables: {
          toggleable: this.id,
          status: this.localStatus,
        },
      }).then(() => {
        this.$emit('onUpdate');
      }).catch((error) => {
        this.localStatus = statusReplacer[this.localStatus];
        ErrorHandler.throwGraphQLError(error);
      });
    },
    update(variables) {
      this.processing = true;
      this.$apollo.mutate({
        mutation: EDIT_TICKET,
        variables,
      }).then(() => {
        this.processing = false;
        this.updateTicketDialogVisible = false;
        location.reload();
      }).catch((error) => {
        this.processing = false;
        ErrorHandler.throwGraphQLError(error);
      });
    },
    inviteUsersToEvent(variables) {
      this.processing = true;
      this.processingTestEmail = variables.testing;
      this.$apollo.mutate({
        mutation: INVITE_USERS,
        variables,
      }).then(() => {
        this.processing = false;
        this.processingTestEmail = false;
        this.inviteUserDialogVisible = false;
        if (variables.testing) {
          this.$notify({
            type: 'success',
            title: 'invite email sent',
            message: 'invitation email was sent to test email.',
          });
        } else {
          this.$notify({
            type: 'success',
            title: 'invite email sent',
            message: 'invitation email was sent to the invitee.',
          });
        }
      }).catch((error) => {
        this.processing = false;
        this.processingTestEmail = false;
        ErrorHandler.throwGraphQLError(error);
      });
    },
    deleteTicket() {
      if (this.buyers >= 1) {
        this.$message.error('you cannot delete this ticket because you already have orders for it');
        return;
      }

      this.processing = true;
      const deleteWarningMessage = 'this will permanently delete this ticket and it will no longer be available for purchase. would you like to continue with this action?';
      this.$confirm(deleteWarningMessage, 'confirm delete', {
        confirmButtonText: 'yes, delete',
        cancelButtonText: 'cancel',
      }).then(() => {
        this.$apollo.mutate({
          mutation: DELETE_TICKET,
          variables: { id: this.id },
        }).then(() => {
          this.processing = false;
          this.$emit('onUpdate');
        }).catch((error) => {
          this.processing = false;
          ErrorHandler.throwGraphQLError(error);
        });
      }).catch(() => {
        this.processing = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
