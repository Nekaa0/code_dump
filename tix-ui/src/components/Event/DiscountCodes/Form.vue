<template>
  <section class="discount">
    <el-form :model="formData" :rules="rules" ref="discountForm">
      <el-form-item :label="discountLabel" prop="code">
        <el-input v-model.trim="formData.code" :disabled="disabledFields" />
      </el-form-item>
      <el-form-item class="discount__label" label="discount code type" prop="feeType" :show-message="false">
        <el-radio class="discount__type" v-model="formData.feeType" :label="option.value" v-for="(option) in types" :key="option.id" :disabled="disabledFields">
          {{ option.label }}
        </el-radio>
      </el-form-item>
      <el-form-item v-if="formData.feeType === 'fixed'" class="discount__value" label="discount value" prop="value">
        <el-input v-model.number="formData.value" type="number" :min="1" :disabled="disabledFields">
          <span slot="prepend">{{ currency }}</span>
        </el-input>
      </el-form-item>
      <el-form-item v-else class="discount__value" label="discount value" prop="value">
        <el-input v-model.number="formData.value" type="number" :min="1" :max="100" :disabled="disabledFields">
          <span slot="append">%</span>
        </el-input>
      </el-form-item>
      <el-form-item class="discount__select" label="what tickets should it apply to?" prop="application" :show-message="false">
        <select
          v-model="applyTicket"
          :disabled="disabledFields"
        >
          <option
            v-for="(item,index) in ticketApplication"
            :key="index"
            :label="item.value"
            :value="item.value">
            {{ item.value }}
          </option>
        </select>
      </el-form-item>
      <el-form-item class="discount__label" label="ticket types" prop="ticket" :show-message="false" v-if="specificTicket">
        <div v-if="tickets.length === 0">
          <p>you have no tickets created. <span @click="$emit('createTicket')">click here to create</span></p>
        </div>
        <el-radio class="discount__type" v-else v-model="formData.ticket" :label="option.id" v-for="option in tickets" :key="option.id" :disabled="disabledFields">
          {{ option.name }}
        </el-radio>
      </el-form-item>
      <div v-if="formData.codeType === 'automated'">
        <el-form-item class="discount__label" label="minimum requirements">
          <el-radio class="discount__type" v-model="requirement" :label="option.value" v-for="option in requirements" :key="option.value" :disabled="disabledFields">
            {{ option.value }}
          </el-radio>
        </el-form-item>
        <el-form-item v-if="requirement === 'minimum purchase amount'" class="discount__value" label="minimum purchase" prop="minimumFee" :show-message="false">
          <el-input v-model.number="formData.minimumFee" type="number" :min="1">
            <span slot="prepend">{{ currency }}</span>
          </el-input>
        </el-form-item>
        <el-form-item  v-else class="discount__value" label="minimum quantity" prop="minimumUse" :show-message="false">
          <el-input class="discount__fee" v-model.number="formData.minimumUse" type="number" :min="1" :max="5" />
        </el-form-item>
      </div>
      <div v-else>
        <el-form-item class="discount__label" label="usage limits" prop="discountUsage" :show-message="false">
          <el-radio class="discount__type" v-model="discountUsage" :label="option.value" v-for="(option,index) in usage" :key="index"/>
          <el-input type="number" v-model.number="formData.limit" :disabled="discountUsage !== 'limited amount of tickets'" />
        </el-form-item>
      </div>
      <el-form-item class="first--child" label="starts on" prop="startDate" :show-message="false">
        <input-datetime v-model="formData.startDate" @input="onChangeStartDate" :disabled="disabledFields"/>
      </el-form-item>
      <el-form-item label="ends on">
        <input-datetime placeholder="time" v-model="formData.endDate" :min="formData.startDate" :max="endDate"/>
      </el-form-item>
      <div class="buttons">
        <el-button type="default" @click.prevent="$emit('back')" :disabled="processing">
          <span>back</span>
        </el-button>
        <el-button native-type="submit" type="primary" @click.prevent="save" :loading="processing" :disabled="!isDisabled()">
          <span>save</span>
        </el-button>
      </div>
    </el-form>
  </section>
</template>

<script>
import CREATE_DISCOUNT_CODE from '@/graphql/CreateDiscountCode.gql';
import EDIT_DISCOUNT_CODE from '@/graphql/EditDiscountCode.gql';
import InputDatetime from '@/components/Global/InputDatetime';
import ErrorHandler from '@/helpers/error-handler';
import Auth from '@/helpers/auth';

export default {
  components: { InputDatetime },
  props: {
    discount: Object,
    edit: {
      type: Boolean,
      default: false,
    },
    tickets: Array,
    codeType: String,
    eventId: String,
    endDate: [String, Number],
  },
  data() {
    const validCode = (_rule, _value, callback) => {
      const regex = /^\S{1,12}$/;
      if (regex.test(this.formData.code) || !this.formData.code) callback();
      else callback(new Error('discount codes are limited to 12 char(s) and no spaces'));
    };
    return {
      processing: false,
      applyTicket: 'all tickets in the current event',
      discountUsage: 'unlimited',
      requirement: 'minimum quantity of tickets',
      formData: {
        code: '',
        codeType: '',
        feeType: 'percentage',
        value: '',
        limit: null,
        unlimited: true,
        startDate: null,
        endDate: null,
        ticket: null,
        minimumUse: null,
        minimumFee: null,
      },
      types: [
        {
          id: 1,
          label: 'percentage discount',
          value: 'percentage',
        },
        {
          id: 2,
          label: 'fixed value',
          value: 'fixed',
        },
      ],
      ticketApplication: [
        {
          value: 'all tickets in the current event',
        },
        {
          value: 'specific ticket types',
        },
      ],
      requirements: [
        {
          value: 'minimum quantity of tickets',
        },
        {
          value: 'minimum purchase amount',
        },
      ],
      usage: [
        {
          value: 'unlimited',
        },
        {
          value: 'one use only',
        },
        {
          value: 'limited amount of tickets',
        },
      ],
      rules: {
        code: [
          { required: true, trigger: 'blur change' },
          { validator: validCode, trigger: 'blur change' },
        ],
        feeType: [
          { required: true, trigger: 'blur change' },
        ],
        value: [
          { required: true, trigger: 'blur change', message: 'discount value is required' },
          { type: 'number', min: 1, max: 100, message: 'enter a percentage value between 1 - 100', trigger: 'blur change' },
        ],
        ticket: [
          { required: true, trigger: 'blur change' },
        ],
        minimumUse: [
          { required: true, trigger: 'blur change' },
          { type: 'number', min: 1, max: 5, message: 'enter a +ve value between 1 - 5', trigger: 'blur change' },
        ],
        minimumFee: [
          { required: true, trigger: 'blur change' },
          { type: 'number', min: 1, trigger: 'blur change' },
        ],
        startDate: [
          { required: true, trigger: 'blur' },
        ],
      },
    };
  },
  mounted() {
    if (this.edit) {
      this.formData = this.discount;
      this.formData.value = Number(this.formData.value);
      if (this.formData.unlimited) this.discountUsage = 'unlimited';
      else this.discountUsage = 'limited amount of tickets';
      if (this.formData.ticket === null) {
        this.applyTicket = 'all tickets in the current event';
      } else {
        this.applyTicket = 'specific ticket types';
        this.formData.ticket = this.discount.ticket.id;
      }
      if (this.formData.minimumUse) this.requirement = 'minimum quantity of tickets';
      if (this.formData.minimumFee) this.requirement = 'minimum purchase amount';
      if (this.formData.endDate === 0) this.formData.endDate = null;
    }
    if (this.codeType) this.formData.codeType = this.codeType;
    if (this.eventId) this.formData.event = this.eventId;
    document.addEventListener('wheel', () => {
      if (document.activeElement.type === 'number') {
        document.activeElement.blur();
      }
    });
  },
  computed: {
    specificTicket() {
      return this.applyTicket === 'specific ticket types';
    },
    feeType() {
      return this.formData.feeType;
    },
    discountLabel() {
      return this.formData.codeType === 'manual' ? 'discount code' : 'discount name';
    },
    selectedTicket() {
      return this.formData.ticket;
    },
    minimumFee() {
      return this.formData.minimumFee;
    },
    minimumUse() {
      return this.formData.minimumUse;
    },
    disabledFields() {
      return this.formData.discountUsage >= 1;
    },
    currency() {
      return Auth.userCurrency();
    },
  },
  methods: {
    onChangeStartDate() {
      const { startDate, endDate } = this.formData;
      const endTime = 1800;
      const futureEndDate = endDate && (endDate > startDate);
      if (!startDate || futureEndDate) return;
      if (this.formData.endDate) {
        this.formData.endDate = startDate + endTime;
      }
    },
    isDisabled() {
      let valid;
      if (this.formData.codeType === 'automated') {
        valid = this.formData.minimumUse || this.formData.minimumFee;
      } else valid = this.discountUsage;
      return this.formData.code
        && this.formData.value
        && this.formData.feeType
        && this.applyTicket
        && valid
        && this.formData.startDate;
    },
    createDiscount() {
      this.$apollo.mutate({
        mutation: CREATE_DISCOUNT_CODE,
        variables: this.formData,
      }).then(() => {
        this.processing = false;
        this.$message.success('discount successfully created');
        location.reload();
      }).catch((error) => {
        this.processing = false;
        ErrorHandler.throwGraphQLError(error);
      });
    },
    editDiscount() {
      this.$apollo.mutate({
        mutation: EDIT_DISCOUNT_CODE,
        variables: this.formData,
      }).then(() => {
        this.processing = false;
        this.$message.success('discount successfully edited');
        location.reload();
      }).catch((error) => {
        this.processing = false;
        ErrorHandler.throwGraphQLError(error);
      });
    },
    save() {
      this.$refs.discountForm.validate((valid) => {
        if (valid) {
          this.processing = true;
          if (this.edit) {
            this.editDiscount();
          } else this.createDiscount();
        } else {
          this.processing = false;
          this.$message.error('please review the errors and try again');
        }
      });
    },
  },
  watch: {
    applyTicket(val) {
      if (val === 'all tickets in the current event') this.formData.ticket = null;
    },
    discountUsage(val) {
      if (val === 'limited amount of tickets') {
        this.formData.unlimited = false;
      } else if (val === 'one use only') {
        this.formData.unlimited = false;
        this.formData.limit = 1;
      } else {
        this.formData.unlimited = true;
        this.formData.limit = null;
      }
    },
    feeType(val) {
      if (val === 'fixed') {
        this.rules.value[1] = { type: 'number', min: 1, message: 'enter a +ve value', trigger: 'blur change' };
      } else {
        this.rules.value[1] = { type: 'number', min: 1, max: 100, message: 'enter a percentage value between 1 - 100', trigger: 'blur change' };
      }
    },
    selectedTicket(val) {
      if (val) {
        this.formData.event = null;
      } else {
        this.formData.event = this.eventId;
      }
    },
    minimumFee(val) {
      if (val) this.formData.minimumUse = null;
    },
    minimumUse(val) {
      if (val) this.formData.minimumFee = null;
    },
  },
};
</script>

<style lang="scss">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type=number] {
  -moz-appearance: textfield;
}
.discount {
  .el-radio__label {
    padding-left: 1.5rem;
    font-weight: 300;
    color: #000000;
  }
  &__label {
    .el-form-item__label {
      margin-bottom: 1.5rem;
    }
    .el-input__inner {
      width: 10%;
      @media screen and (max-width: 480px){
        width: 30%;
      }
    }
    p {
      font-size: 12px;
    }
    span {
      color: $color-orange;
      cursor: pointer;
    }
  }
  &__value {
    .discount__fee {
      width: 15%;
      @media screen and (max-width: 480px){
        width: 25%;
      }
    }
    .el-input-group {
      width: 20%;
      @media screen and (max-width: 480px){
        width: 45%;
      }
    }
    .el-input-group__prepend, .el-input-group__append {
      background-color: transparent;
      padding: 0 1rem;
      span {
        color: $color-orange;
      }
    }
    .el-input-group--prepend {
      input {
        border-left-color: transparent;
      }
    }
    .el-input-group--append {
      input {
        border-right-color: transparent;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.discount {
  &__type {
    display: block;
    margin-left: 0px;
  }
  &__type:not(:last-child){
    margin-bottom: 1.5rem;
  }
  &__select {
    select {
      padding: 1rem;
      width: 100%;
      border-radius: 6px;
      border: 1px solid rgba(0, 0, 0, 0.2);
      color: $color-black;
      -moz-appearance: none;
      -webkit-appearance: none;
      background-repeat: no-repeat, repeat;
      background-position: right 1rem top 50%, 0 0;
      background-size: 1rem auto, 100%;
      cursor: pointer;
      background-image: url("data:image/svg+xml,%3Csvg width='8' height='6' viewBox='0 0 8 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M7.06667 0.733307L8 1.66664L4 5.66664L-4.07973e-08 1.66664L0.933333 0.733307L4 3.79997L7.06667 0.733307Z' fill='%23333333'/%3E%3C/svg%3E%0A");
    }
  }
  .buttons {
    display: flex;
    margin-top: 5rem;
    .el-button {
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>