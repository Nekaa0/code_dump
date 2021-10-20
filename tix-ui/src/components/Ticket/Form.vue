<template>
  <el-form :model="formData" :rules="rules" ref="ticketForm">
    <el-row v-if="isPhone" class="ticket--type" :gutter="9">
      <el-col :span="10">
        <div class="ticket--type__header">
          <span>ticket type</span>
        </div>
      </el-col>
      <el-col :span="14">
        <el-tooltip effect="dark" content="tickets with orders cannot have their type changed." placement="top-start" :disabled="!ticketHasOrder">
          <div>
            <select class="ticket--type__dropdown" @change="ticketType" :disabled="ticketHasOrder">
              <option value="free">free</option>
              <option value="paid">paid</option>
              <option value="invite only">invite only</option>
            </select>
          </div>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-form-item label="ticket type" prop="ticket_type" class="ticket--type" v-else>
      <el-tooltip effect="dark" content="tickets with orders cannot have their type changed." placement="top-end" :disabled="!ticketHasOrder">
        <div>
          <input type="button" value="free" class="ticket--type__button u-button u-button--large"   @click.prevent="ticketType" :class="{activeButton: formData.free}" />
          <input type="button" value="paid" class="ticket--type__button u-button u-button--large"   @click.prevent="ticketType" :class="{activeButton: !formData.free}" />
          <input type="button" value="invite only" class="ticket--type__button u-button u-button--large"   @click.prevent="ticketType" :class="{activeButton: formData.inviteOnly}"/>
        </div>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="ticket name" prop="name">
      <el-input v-model="formData.name" />
    </el-form-item>
    <el-form-item label="about ticket" prop="about">
      <span class="ticket--about__counter">{{ aboutLength }}/280</span>
      <el-input type="textarea" :maxlength="280" :autosize="{ minRows: 3 }" v-model="formData.about" />
    </el-form-item>
    <el-form-item label="perks for this ticket" class="ticket--perks">
      <input-list v-model="formData.perks"  />
    </el-form-item>
    <el-form-item prop="price">
      <el-row :gutter="9">
        <el-col :span="10">
          <div class="title" :class="{freeTicket: formData.free}">
            <span>ticket price</span>
          </div>
        </el-col>
        <el-col :span="14">
          <el-tooltip effect="dark" content="tickets with orders cannot have their price changed." placement="top-start" :disabled="!ticketHasOrder">
            <el-input-number v-model="formData.price" :controls="false" :disabled="formData.free || ticketHasOrder"/>
          </el-tooltip>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item prop="inventory">
      <el-row :gutter="9">
        <el-col :span="10">
          <select class="select" :value="inventoryLimit" @change="inventoryValue" :disabled="formData.inviteOnly">
            <option value="unlimited">unlimited stock</option>
            <option value="limited">limited stock</option>
          </select>
        </el-col>
        <el-col :span="14">
          <div class="unlimited" v-if="inventoryLimit === 'unlimited'">
            <img src="@/assets/infinity.svg" alt="unlimited number of tickets">
          </div>
          <el-input-number v-else v-model="formData.limit" :min="0" :controls="false" :disabled="inventoryLimit == 'unlimited'"/>
        </el-col>
      </el-row>
    </el-form-item>
    <div v-if="!formData.free">
      <el-tooltip placement="top-start" effect="light">
        <a slot="content" href="https://tix.africa/pricing" target="__blank">this will transfer our fee per paid ticket to your customers</a>
        <el-checkbox v-model="formData.transferFees" :disabled="ticketHasOrder">transfer fees to guest</el-checkbox>
      </el-tooltip>
    </div>
    <div>
      <custom-fields :formData="formData" @emit-custom-fields-data="getCustomFields" />
    </div>
    <div class="cta--block">
      <button class="u-button back-button u-button--grey" @click.prevent="$emit('close-ticket-form')">back</button>
      <button native-type="submit" class="u-button" @click.prevent="save"><i v-if="processing" class="el-icon-loading"></i>save</button>
    </div>
  </el-form>
</template>

<script>
/* eslint-disable */
import IsPhone from '@/mixins/IsPhone';
import { InputNumber, Row, Col, Tooltip } from 'element-ui';
import InputList from '@/components/Global/InputList';
import InputDigits from '@/components/Global/InputDigits';
import Country from '@/mixins/Country';
import CustomFields from './Form/CustomFields';
import { filter, clone } from 'lodash';


export default {
  props: {
    ticket: {
      type: Object,
    },
    processing: Boolean,
    reset: Boolean,
    ticketHasOrder: {
      type: Boolean,
      required: true,
    },
  },
  mixins: [IsPhone, Country],
  components: {
    ElInputNumber: InputNumber,
    ElRow: Row,
    ElCol: Col,
    InputList,
    InputDigits,
    ElTooltip: Tooltip,
    CustomFields,
  },
  data() {
    const limitRequired = (_rule, _value, callback) => {
      if (isNaN(this.formData.limit)) {
        callback(new Error('please enter a value for inventory'));
      } else {
        callback();
      }
    };

    const validatePrice = (_rule, value, callback) => {
      if (this.country === 'NG') {
        if (value > 0 && value < 200) {
          callback(new Error(`ticket price must not be less than 200 ${this.currency}`));
        } else callback();
      } else if (this.country === 'ZA') {
        if (value > 0 && value < 10) {
          callback(new Error(`ticket price must not be less than 10 ${this.currency}`));
        } else callback();
      } else callback();
    };
    return {
      formData: {
        transferFees: false,
      },
      rules: {
        name: [
          { required: true, trigger: 'blur', message: 'please enter a name for your ticket' },
        ],
        about: [
          { required: true, trigger: 'blur', message: 'please describe your ticket' },
        ],
        price: [
          { required: true, trigger: 'blur', message: 'please enter a value for price' },
          { validator: validatePrice, trigger: 'blur' },
        ],
        inventory: [
          { validator: limitRequired, trigger: 'blur' },
        ],
        invite_only: [],
        customFields: [{ question_text: '', required: false }],
      },
    };
  },
  watch: {
    reset() {
      this.resetForm();
    },
  },
  computed: {
    aboutLength() {
      return this.formData.about ? this.formData.about.length : 0;
    },
    inventoryLimit: {
      get() {
        return this.formData.unlimited ? 'unlimited' : 'limited';
      },
      set(inventoryLimit) {
        return inventoryLimit;
      },
    },
  },
  created() {
    this.resetFormData();
  },
  mounted() {
    this.resetForm();
  },
  methods: {
    getCustomFields(customFields) {
      this.formData.customFields = customFields;
    },
    saveCustomFields() {
      const customFields = _.filter(this.formData.customFields, (field) => field.question_text !== '');
      this.formData.customFields = customFields;
    },
    formatCustomFields(formData) {
      return formData.customFields ?
        formData.customFields.edges.map((field) => {
          const { id, question_text, required } = field.node;
          return {
            id,
            question_text,
            required,
          };
          }) : [];
    },
    formDataLoader(ticket) {
      const formData = _.clone(ticket);
      formData.price = ticket.price ? ticket.price : 0;
      formData.free = ticket.price ? Math.round(ticket.price) === 0 : true;
      formData.unlimited = Boolean(ticket.unlimited);
      formData.inviteOnly = Boolean(ticket.inviteOnly);
      formData.customFields = this.formatCustomFields(formData);
      return formData;
    },
    inventoryValue(event) {
      if (event.target.value === 'unlimited') {
        this.formData.unlimited = true;
        this.formData.limit = 0;
      } else {
        this.formData.unlimited = false;
      }
    },
    inviteOnlyTicketType() {
        this.formData.unlimited = true;
        this.formData.limit = 0;
        this.inventoryLimit = 'unlimited';
    },
    ticketTypeOnMobile(ticketType) {
      this.formData.inviteOnly = ticketType === 'invite only';
      this.formData.free = ticketType === 'free';
      if (this.formData.free) {
        this.formData.price = 0;
      }
      if (this.formData.inviteOnly) {
        this.inviteOnlyTicketType();
      }
    },
    ticketTypeOnDesktop(ticketType) {
      if (ticketType === 'free') {
        this.formData.free = true;
        this.formData.price = 0;
      }
      if (ticketType === 'paid') {
        this.formData.free = false;
      }
      if (ticketType === 'invite only') {
        this.formData.inviteOnly = !this.formData.inviteOnly;
        if (this.formData.inviteOnly) {
          this.inviteOnlyTicketType();
        }
      }
    },
    ticketType(event) {
      if (this.ticketHasOrder) {return;}
      if (this.isPhone) {
        this.ticketTypeOnMobile(event.target.value);
      } else {
        this.ticketTypeOnDesktop(event.target.value);
      }
    },
    resetFormData() {
      this.formData = this.ticket ? Object.assign(this.formDataLoader(this.ticket)) : this.formData;
    },
    resetForm() {
      this.resetFormData();
      this.$refs.ticketForm.clearValidate();
    },
    save() {
     this.saveCustomFields();
      const formData = Object.assign({}, this.ticket, this.formData);
      this.$refs.ticketForm.validate((valid) => {
        if (valid) {
          this.$emit('save', formData);
        } else {
          this.$message.error('Please review the errors and try again');
        }
      });
    },
  },
};
</script>

<style lang="scss">
  .ticket--type .el-form-item__content {
    padding-left: 0.7rem;
    display: flex;
  }
  .ticket--perks .el-form-item__content {
    border: 1px solid rgba(0,0,0,0.2);
    a {
      color: $--color-pink;
      line-height: 1.2;
      padding: 1.1rem 0.8rem 1.3rem;
      @media screen and (max-width: 767px) {
        font-size: 1rem;
      }
    }
  }
  .ticket--perks .el-form-item__label {
    padding-left: 0.8rem;
  }
  .el-form-item {
    @media screen and (max-width: 767px) {
      margin-bottom: 1.4rem;
    }
  }
  .el-form-item__label {
    @media screen and (max-width: 767px) {
      font-size: 1rem;
    }
  }
  .el-tooltip__popper.is-light {
    background-color: $color-orange;
    border: none;
    a {
      color: white;
      font-weight: 500;
    }
  }
</style>

<style lang="scss" scoped>
  .el-input-number {
    width: 100%;
  }
  .price__prompt {
    display: flex;
    flex-direction: column;

    &-fees {
    flex-direction: row;
      display: flex;
      justify-content: flex-start;

      p {
        margin-left: 0.5em;
      }
    }
  }
  .ticket {
    &--about {
      &__counter {
        position: absolute;
        right: 0;
        top: -30px;
        color: rgba($color: $--color-black, $alpha: 0.5);
        @media screen and (max-width: 767px) {
          font-size: 1rem;
        }
      }
    }
    &--type {
      margin-bottom: 0.7rem;
      @media screen and (min-width: 768px) {
        margin-bottom: 3.3rem;
      }
      &__button {
        width: 11.6rem;
        border: 1px solid #cccccc;
        margin-right: 1rem;
        background-color: #fff;
        color: $--color-black;
      }
      &__header {
        background: $--color-white;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        padding-left: 1.3rem;
        height: 3.3rem;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
      }
      &__dropdown {
        height: 3.3rem;
        text-align: center;
        text-align-last: center;
        -moz-text-align-last: center;
        background: #EFEFEF;
        border: 1px solid rgba(191, 191, 191, 0.3);
        background-image: url("data:image/svg+xml,%3Csvg width='7' height='4' viewBox='0 0 7 4' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath opacity='0.4' fill-rule='evenodd' clip-rule='evenodd' d='M5.83883 -3.06443e-08L6.61 0.743514L3.305 3.93L4.41087e-07 0.743513L0.771167 -2.32021e-07L3.305 2.44297L5.83883 -3.06443e-08Z' fill='%23333333'/%3E%3C/svg%3E%0A");
      }
    }
    &--price {
      display: flex;
      align-items: center;
      padding-left: 1.3rem;
    }
    &--inventory {
      display: flex;
      align-items: center;
    }
  }
  .cta--block {
    background: rgba(196, 196, 196, 0.2);
    border-radius: 0 0 10px 10px;
    padding: 1.5rem 0;
    display: flex;
    max-width: 50rem;
    align-items: center;
    margin: 1.6rem -3.2rem 0 -2.1rem;
    justify-content: center;
    @media screen and (min-width: 768px) {
      padding: 2.3rem 0;
      margin: 3rem -3.2rem 0 -2.1rem;
    }
  }
  .ticket--perks {
    margin-bottom: 3rem;
  }
  .back-button {
    margin-right: 1.6rem;
    background: #fff;
  }
  .title {
    border: 1px solid $--border-color-light;
    background: $--background-color-base;
    border-radius: 4px;
    padding-left: 1.3rem;
    height: 4.1rem;
    color: rgba($color: $--color-black, $alpha: 0.3);
    @media screen and (max-width: 767px) {
      font-size: 1.2rem;
    }
  }
  .unlimited {
    text-align: center;
    height: 4rem;
    border: 1px solid $--border-color-light;
    background: $--background-color-base;
    border-radius: 4px;
  }
  .select, .ticket--type__dropdown {
    width: 100%;
    border-radius: 4px;
    font-size: 1.4rem;
    -moz-appearance: none;
    -webkit-appearance: none;
    background-repeat: no-repeat, repeat;
    background-position: right 1rem top 50%, 0 0;
    background-size: 1rem auto, 100%;
    cursor: pointer;
    color: #333333;
    outline: none;
    @media screen and (max-width: 767px) {
      background-position: right 1rem top 50%, 0 0;
      font-size: 1.2rem;
    }
  }
  .select {
    height: 4.1rem;
    padding-left: 1rem;
    background-color: $--color-gray;
    border: 1px solid rgba(0, 0, 0, 0.2);
    background-image: url("data:image/svg+xml,%3Csvg width='8' height='6' viewBox='0 0 8 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M7.06667 0.733307L8 1.66664L4 5.66664L-4.07973e-08 1.66664L0.933333 0.733307L4 3.79997L7.06667 0.733307Z' fill='%23333333'/%3E%3C/svg%3E%0A");
  }
  .activeButton {
    background: #FCEFEC;
    border: 1px solid $--color-pink;
    border-radius: 5px;
    color: $--color-pink;
    transition: 0.1s;
  }
</style>
