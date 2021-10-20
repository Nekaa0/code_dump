<template>
  <div class="order-recipient__body">
    <h5 class="order-recipient__ticket">ticket {{ ticketNumber }} - {{ ticketName }}</h5>
    <el-form :model="formData" :rules="rules" ref="orderRecipientsForm">
      <el-row :gutter="24">
        <el-col :md="12">
          <el-form-item label="attendee first name" prop="firstName">
            <el-input v-model.trim="formData.firstName" placeholder="first name" @input="emitOrderRecipientData" :disabled="copyPreviousAttendee"/>
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="attendee last name" prop="lastName">
            <el-input v-model.trim="formData.lastName" placeholder="last name" @input="emitOrderRecipientData" :disabled="copyPreviousAttendee"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="attendee email address" prop="email">
          <el-input type="email" v-model.trim="formData.email" placeholder="email address" @input="emitOrderRecipientData" :disabled="copyPreviousAttendee"/>
        </el-form-item>
      </el-row>
      <el-checkbox v-if="!firstForm" @change="copyPreviousOrderRecipient" v-model="copyPreviousAttendee">copy data from previous attendee</el-checkbox>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'order-recipient-form',
  props: {
    ticketName: String,
    ticketSchedule: String,
    ticketIndex: Number,
    orderRecipientCount: Number,
    orderRecipients: Array,
    selectedTicketsInfo: Array,
  },
  data() {
    return {
      formData: {
        id: this.orderRecipientCount,
        ticketSchedule: this.ticketSchedule,
        firstName: '',
        lastName: '',
        email: '',
      },
      copyPreviousAttendee: false,
      rules: {
        firstName: [
          { required: true, trigger: 'blur', message: 'please enter attendee first name' },
        ],
        lastName: [{ required: true, trigger: 'blur', message: 'please enter attendee last name' }],
        email: [
          {
            required: true,
            type: 'email',
            trigger: 'blur',
            message: 'please enter a valid email address',
          },
        ],
      },
    };
  },
  mounted() {
    this.emitOrderRecipientData();
  },
  beforeDestroy() {
    this.$emit('deleteRecipientData');
  },
  computed: {
    ticketNumber() {
      return this.previousTicketsQty() + this.orderRecipientCount;
    },
    firstForm() {
      return !this.ticketIndex && this.orderRecipientCount === 1;
    },
  },
  methods: {
    previousTicketsQty() {
      let qty = 0;
      for (let index = 0; index < this.ticketIndex; index += 1) {
        qty += this.selectedTicketsInfo[index].quantity;
      }
      return qty;
    },
    emitOrderRecipientData() {
      this.$emit('order-recipient-data', this.formData);
    },
    copyPreviousOrderRecipient(checked) {
      if (checked) {
        const { firstName, lastName, email } =
          this.orderRecipientCount === 1
            ? this.copyFromPreviousTicketRecipients()
            : this.copyFromCurrentTicketRecipients();

        this.formData = Object.assign(this.formData, {
          firstName,
          lastName,
          email,
        });
      }
      this.$emit('copyPreviousAttendee');
    },
    copyFromPreviousTicketRecipients() {
      const { data } = this.orderRecipients[this.ticketIndex - 1];
      const { firstName, lastName, email } = data[data.length - 1];

      return { firstName, lastName, email };
    },
    copyFromCurrentTicketRecipients() {
      const { data } = this.orderRecipients[this.ticketIndex];
      const { firstName, lastName, email } = data[this.orderRecipientCount - 2];

      return { firstName, lastName, email };
    },
  },
};
</script>

<style lang="scss" scoped>
.order-recipient {
  &__body {
    margin-top: 3.4rem;
    padding: 2rem 2.4rem 2.5rem 2.7rem;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
  &__ticket {
    margin-bottom: 2rem;
    line-height: 1.2;
    font-weight: 400;
  }
}
</style>
