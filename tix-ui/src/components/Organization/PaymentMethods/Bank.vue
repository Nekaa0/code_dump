<template>
  <div>
    <el-form key="form" :model="formData" :rules="rules" class="form" ref="verificationForm">
      <el-form-item label="company registration number" prop="companyRegistrationNumber">  
        <el-input v-model.trim="formData.companyRegistrationNumber" />
      </el-form-item>
      <el-form-item label="bank" prop="bankCode" >
        <bank-select v-model="formData.bankCode" />
      </el-form-item>
      <el-form-item label="account number" prop="accountNumber">
        <el-input v-model.trim="formData.accountNumber" />
      </el-form-item>
      <el-form-item label="account name" prop="accountName">
        <div v-if="beginFetchAccountName && fetching" class="loading el-input__inner">
          <i class="el-icon-loading"></i>
        </div>
        <el-input v-model="formData.accountName" placeholder="" disabled v-else>
        </el-input>
      </el-form-item>
      <div class="cta--block">
        <button class="u-button back-button u-button--grey" @click.prevent="$emit('back')">back</button>
        <button native-type="submit" class="u-button" @click.prevent="verify" :class="{'u-button--disabled': formData.accountName === ''}" :disabled="formData.accountName === ''">
          <i v-if="processing" class="el-icon-loading"></i>
          <span v-else>save</span>
        </button>
      </div>
    </el-form>
  </div>
</template>

<script>
import VERIFY_ORGANIZATION from '@/graphql/VerifyOrganization.gql';
import { validation } from '@/helpers/utility';
import BankSelect from '@/components/Global/BankSelect';

import ErrorHandler from '@/helpers/error-handler';
import FETCH_BANK_ACCOUNT_NAME from '@/graphql/FetchBankAccountName.gql';
import gql from 'graphql-tag';

export default {
  props: {
    id: String,
    slug: String,
    paymentMethod: String,
  },
  components: {
    BankSelect,
  },
  data() {
    return {
      formData: {
        payment_method: this.paymentMethod,
        companyRegistrationNumber: '',
        accountNumber: '',
        accountName: '',
        bankCode: '',
      },
      fetching: false,
      processing: false,
      rules: {
        companyRegistrationNumber: [
          { max: 14, trigger: 'change', message: 'Please enter your valid company registration number' },
        ],
        accountNumber: [
          { required: true, trigger: 'change', message: 'Please enter your account number' },
          { min: 10, max: 10, trigger: 'blur', message: 'Your account number should be 10 digits' },
          { validator: validation.isDigits, trigger: 'change' },
        ],
        bankCode: [
          { required: true, trigger: 'change', message: 'Please choose a bank' },
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
    verify() {
      this.processing = true;
      this.$refs.verificationForm.validate((valid) => {
        if (valid) {
          this.$apollo.mutate({
            mutation: VERIFY_ORGANIZATION,
            variables: this.formData,
          }).then((response) => {
            this.processing = false;
            this.$emit('complete', response.data.submitOrganizationVerificationDetails);
            this.$refs.verificationForm.resetFields();
          }).catch((error) => {
            this.processing = false;
            ErrorHandler.throwGraphQLError(error);
          });
        } else {
          this.processing = false;
          this.$message.error('Please review the errors and try again');
        }
      });
    },
  },
};
</script>

<style lang="scss">
  .el-form-item {
    margin-bottom: 3rem;
  }
  .el-dialog {
    overflow: hidden;
    &__title {
      letter-spacing: unset;
    }
  }
</style>

<style lang="scss" scoped>
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
    background: #fff;
  }
  .form {
    padding-top: 2rem;
    margin: -1rem 0 -3rem;
  }
  .loading {
    background-color: $--background-color-base;
    border-color: $--border-color-light;
    text-align: center;
  }
</style>
