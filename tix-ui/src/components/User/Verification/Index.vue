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
        <bank-account-verification @complete="onBankAccountVerified" @back="$emit('back')" />
      </div>

      <div v-if="selected === 'mobile money wallet'" >
        <mobile-account-verification @complete="onMobileAccountVerified" @back="$emit('back')" />
      </div>
    </div>
      <div v-else>
        <bank-account-verification @complete="onBankAccountVerified" @back="$emit('back')" />
    </div>
  </div>
</template>

<script>
import { Select, Option } from 'element-ui';
import Auth from '@/helpers/auth';
import FETCH_CURRENT_USER from '@/graphql/FetchCurrentUser.gql';
import BankAccountVerification from './BankAccount';
import MobileAccountVerification from './MobileAccount';


export default {
  name: 'user-verification',
  components: {
    BankAccountVerification,
    MobileAccountVerification,
    ElSelect: Select,
    ElOption: Option,
  },
  data() {
    function isVerified(type) {
      const verification = Auth.currentUser.verifications.find(v => v.verificationType === type);
      return verification && verification.state === 'verified';
    }

    return {
      currentUser: {},
      selected: this.value,
      payment_methods: ['bank account', 'mobile money wallet'],
      processing: false,
      formData: {},
      bankAccountVerified: isVerified('bank_account'),
      mobileAccountVerified: isVerified('phone'),
    };
  },
  apollo: {
    currentUser: {
      query: FETCH_CURRENT_USER,
      update: data => data.currentUser,
      fetchPolicy: 'network-only',
    },
  },
  computed: {
    userCountry() {
      return this.currentUser.country;
    },
  },
  methods: {
    onBankAccountVerified() {
      this.$emit('complete');
      this.$message.success('your bank details have been successfully saved');
    },
    onMobileAccountVerified() {
      this.$emit('complete');
      this.$emit('mobile');
      this.$message.success('your mobile payment details have been successfully saved');
    },
  },
};
</script>

<style lang="scss">
.el-dialog {
  overflow: hidden;
  &__title {
    letter-spacing: unset;
  }
}
</style>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
.el-form-item {
    margin-bottom: 3rem;
  }
</style>
