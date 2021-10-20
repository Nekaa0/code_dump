<template>
  <el-form :model="formData" ref="otpForm">
    <el-form-item :label="`enter otp that was sent to ${maskedNumber}`" prop="otp" :rules="rules" >
      <el-row>
        <el-input ref="otp" type="tel" v-model="formData.otp" placeholder=""></el-input>
      </el-row>
    <div class="verify--button">
        <button class="u-button" @click.prevent="confirmOTP" :loading="processing">verify</button>
      </div>
    </el-form-item>
    <div>
      <a @click="call">
        <i class="el-icon-service"></i> didn't get the SMS? try a phone call
      </a>
    </div>
    <div>
      <a v-if="!resentOTP" @click="resendOTP">
        <i class="el-icon-refresh"></i> resend verification code
      </a>
      <span v-if="resentOTP">resent!</span>
    </div>
  </el-form>
</template>

<script>
import START_PHONE_VERIFICATION from '@/graphql/StartPhoneVerification.gql';
import COMPLETE_PHONE_VERIFICATION from '@/graphql/CompletePhoneVerification.gql';
import ErrorHandler from '@/helpers/error-handler';

export default {
  props: {
    number: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      processing: false,
      formData: { },
      sentOTP: false,
      resentOTP: false,
      rules: [
        { trigger: 'blur', message: 'please enter the verification code' },
      ],
    };
  },
  created() {
    this.sendOTP().then(() => {
      this.sentOTP = true;
    });
  },
  computed: {
    maskedNumber() {
      if (!this.number) return '';
      const last4 = this.number.substring(this.number.length - 4);
      return `*******${last4}`;
    },
  },
  methods: {
    sendOTP(options) {
      return this.$apollo.mutate({
        mutation: START_PHONE_VERIFICATION,
        variables: options || { call: false },
      }).catch((error) => {
        this.processing = false;
        ErrorHandler.throwGraphQLError(error);
      });
    },
    resendOTP() {
      this.sendOTP().then(() => {
        this.resentOTP = true;
        setTimeout(() => { this.resentOTP = false; }, 500);
      });
    },
    confirmOTP() {
      this.$refs.otpForm.validate((valid) => {
        if (!valid) return;

        const { otp } = this.formData;
        this.processing = true;
        this.$apollo.mutate({
          mutation: COMPLETE_PHONE_VERIFICATION,
          variables: { otp },
        }).then((response) => {
          this.processing = false;
          this.$emit('complete', response.data.completePhoneVerification);
        }).catch(() => {
          this.processing = false;
          this.$emit('complete', {});
          // this.processing = false;
          // ErrorHandler.throwGraphQLError(error);
        });
      });
    },
    call() {
      this.sendOTP({ call: true }).then(() => {
        this.$message.success(`calling you at ${this.maskedNumber}`);
      });
    },
  },
};
</script>

<style lang="scss" scope>
  .verify--button {
    padding-top: 1.4rem;
  }
  a {
    font-weight: 300;
  }
</style>