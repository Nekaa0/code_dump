<template>
  <div>
    <div v-if="userCountry === 'GH'">
      <el-form key="form">
        <el-form-item label="choose payment method" class="is-required">
          <el-select filterable v-model="selected" placeholder="" @change="update">
            <el-option
              v-for="provider in payment_methods"
              :key="provider"
              :label="provider"
              :value="provider">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div v-if="selected === 'bank account'" >
        <bank @complete="sendBankUp" paymentMethod="bank_account" @back="back"></bank>
      </div>
      <div v-if="selected === 'mobile money wallet'" >
        <mobile @complete="sendMobileUp" paymentMethod="mobile_money_wallet" @back="back"></mobile>
      </div>
    </div>
    <div v-else>
        <bank @complete="sendBankUp" paymentMethod="bank_account"></bank>
    </div>

  </div>
</template>

<script>
import Bank from '@/components/Organization/PaymentMethods/Bank';
import Mobile from '@/components/Organization/PaymentMethods/Mobile';
import FETCH_CURRENT_USER from '@/graphql/FetchCurrentUser.gql';
import { Select, Option } from 'element-ui';

export default {
  props: {
    value: String,
  },
  components: {
    Bank,
    Mobile,
    ElSelect: Select,
    ElOption: Option,
  },
  data() {
    return {
      currentUser: {},
      selected: this.value,
      payment_methods: ['bank account', 'mobile money wallet'],
    };
  },
  apollo: {
    currentUser: {
      query: FETCH_CURRENT_USER,
      update: data => data.currentUser,
      fetchPolicy: 'network-only',
    },
  },
  methods: {
    update() {
      this.$emit('input', this.selected);
    },
    back() {
      this.$emit('back');
    },
    sendBankUp() {
      this.$emit('complete');
      this.$message.success('your bank payment details have been successfully saved');
    },
    sendMobileUp() {
      this.$emit('complete');
      this.$emit('mobile');
      this.$message.success('your mobile payment details have been successfully saved');
    },
  },
  computed: {
    userCountry() {
      return this.currentUser.country;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
.el-form-item {
    margin-bottom: 3rem;
  }
</style>
