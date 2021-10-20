<template>  
  <el-form :model="formData" ref="bankAccountForm" :rules="rules">
    <el-row>
      <el-form-item label="bank" prop="bankCode">
        <bank-select v-model="formData.bankCode" />
      </el-form-item>
      <el-form-item label="account number" prop="accountNumber" >
        <el-input type="tel" v-model="formData.accountNumber" placeholder="" :minlength="10"></el-input>
      </el-form-item>
      <el-form-item label="account name" prop="accountName">
        <div v-if="beginFetchAccountName && fetching" class="loading el-input__inner">
          <i class="el-icon-loading"></i>
        </div>
        <el-input v-model="formData.accountName" placeholder="" disabled v-else>
        </el-input>
      </el-form-item>
    </el-row>
    <div class="cta--block">
      <button class="u-button back-button u-button--grey" @click.prevent="$emit('back')">back</button>
      <button native-type="submit" class="u-button" @click.prevent="saveBankAccount" :class="{'u-button--disabled': formData.accountName === ''}" :disabled="formData.accountName === ''">
        <i v-if="processing" class="el-icon-loading"></i>
        <span v-else>save</span>
      </button>
    </div>
  </el-form>
</template>

<script>
import SET_BANK_ACCOUNT from '@/graphql/SetBankAccount.gql';
import Auth from '@/helpers/auth';
import ErrorHandler from '@/helpers/error-handler';
import { validation } from '@/helpers/utility';
import FETCH_BANK_ACCOUNT_NAME from '@/graphql/FetchBankAccountName.gql';
import BankSelect from '@/components/Global/BankSelect';
import gql from 'graphql-tag';

export default {
  components: {
    BankSelect,
  },
  data() {
    return {
      processing: false,
      fetching: false,
      accountName: '',
      formData: {
        eventOwner: Auth.currentUser.id,
        bankCode: '',
        accountNumber: '',
        accountName: '',
      },
      rules: {
        accountNumber: [
          { required: true, trigger: 'change', message: 'please enter your account number' },
          { min: 10, max: 10, trigger: 'blur', message: 'your account number should be 10 digits' },
          { validator: validation.isDigits, trigger: 'change' },
        ],
        bankCode: [
          { required: true, trigger: 'change', message: 'please choose a bank' },
        ],
        accountName: [
          { required: true, trigger: 'change', message: ' ' },
        ],
      },
    };
  },
  watch: {
    // eslint-disable-next-line
    'formData.bankCode': function () {
      if (this.beginFetchAccountName) {
        setTimeout(this.fetchBankAccountName, 1500);
      }
    },
    // eslint-disable-next-line
    'formData.accountNumber': function () {
      if (this.beginFetchAccountName) {
        setTimeout(this.fetchBankAccountName, 1500);
      }
    },
  },
  computed: {
    beginFetchAccountName() {
      return (this.formData.bankCode !== '' && this.formData.accountNumber.length === 10);
    },
  },
  methods: {
    fetchBankAccountName() {
      if (this.beginFetchAccountName) {
        this.fetching = true;
        this.$apollo.query({
          query: gql`${FETCH_BANK_ACCOUNT_NAME}`,
          variables: {
            accountNumber: this.formData.accountNumber,
            bankCode: this.formData.bankCode,
          },
          fetchPolicy: 'network-only',
        }).then((response) => {
          this.formData.accountName = response.data.fetchBankAccountName.accountName;
          this.fetching = false;
        }).catch((error) => {
          this.fetching = false;
          this.formData.accountName = '';
          ErrorHandler.throwGraphQLError(error);
        });
      }
    },
    saveBankAccount() {
      this.$refs.bankAccountForm.validate((valid) => {
        if (!valid) return;
        this.processing = true;
        this.$apollo.mutate({
          mutation: SET_BANK_ACCOUNT,
          variables: this.formData,
        }).then((response) => {
          this.processing = false;
          this.$emit('complete', response.data.setBankAccount);
          this.$refs.bankAccountForm.resetFields();
        }).catch((error) => {
          this.processing = false;
          ErrorHandler.throwGraphQLError(error);
        });
      });
    },
  },
};
</script>

<style lang="scss">
  .el-form-item {
    margin-bottom: 3rem;
  }
</style>

<style lang="scss" scoped>
  .el-form {
    margin: -1rem 0 -3rem;
  }
  .cta--block {
    background: rgba(196, 196, 196, 0.2);
    border-radius: 0 0 10px 10px;
    padding: 2.3rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 -3.2rem 0 -2.1rem;
  }
  .back-button {
    margin-right: 1.6rem;
  }
  .loading {
    background-color: $--background-color-base;
    border-color: $--border-color-light;
    text-align: center;
  }
</style>
