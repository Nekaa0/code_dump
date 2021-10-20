<template>
  <div>
    <el-form key="form" :model="formData" :rules="rules" class="form" ref="verifyNumberForm">
      <el-form-item label="enter your otp code here" prop="otp">
        <el-input v-model.trim="formData.otp" />
      </el-form-item>
    <div class="cta--block">
        <button class="u-button back-button u-button--grey" @click.prevent="$emit('resend')">resend</button>
        <button native-type="submit" class="u-button" @click.prevent="verifyPhone" :class="{'u-button--disabled': formData.otp === ''}" :disabled="formData.otp === ''">
          <i v-if="processing" class="el-icon-loading"></i>
          <span v-else>continue</span>
        </button>
    </div>      
    </el-form>

  </div>
</template>

<script>
import { validation } from '@/helpers/utility';
import VERIFY_ACCOUNT from '@/graphql/verifyMobileAccount.gql';

import ErrorHandler from '@/helpers/error-handler';

export default {
  props: {
    id: String,
    slug: String,
  },
  data() {
    return {
      formData: {
        otp: '',
      },
      fetching: false,
      processing: false,
      rules: {
        otp: [
          { required: true, trigger: 'blur', validator: validation.isNumeric, message: 'please enter a valid phone number' },
        ],
      },
    };
  },
  methods: {
    verifyPhone() {
      this.processing = true;
      this.$refs.verifyNumberForm.validate((valid) => {
        if (valid) {
          this.$apollo.mutate({
            mutation: VERIFY_ACCOUNT,
            variables: this.formData,
          }).then((response) => {
            this.processing = false;
            this.$emit('verified', response.data);
            this.$message.success('your mobile number has been verified');
          }).catch((error) => {
            this.processing = false;
            ErrorHandler.throwGraphQLError(error);
          });
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
