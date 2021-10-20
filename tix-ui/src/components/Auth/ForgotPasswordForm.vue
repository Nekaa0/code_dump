<template>
  <el-form :model="user" :rules="rules" status-icon ref="forgotPasswordForm">
    <el-form-item class="password--reset" prop="email">
      <el-input class="password--reset__email--input" v-model="user.email" placeholder="email address"></el-input>
    </el-form-item>
      <button class="password--reset__button u-button" native-type="submit" size="medium" @click.prevent="forgotPassword"><i v-if="processing" class="el-icon-loading"></i>request password reset</button>
      <router-link class="password--reset__sign-in" :to="{name: 'Login'}">sign in</router-link>
  </el-form>
</template>
<script>
import ErrorHandler from '@/helpers/error-handler';
import ForgotPassword from '@/graphql/ForgotPassword.gql';

export default {
  data() {
    return {
      processing: false,
      user: {
        email: '',
      },
      rules: {
        email: [
          { required: true, message: 'please enter your email address', trigger: 'blur, change' },
          { type: 'email', message: 'please use a valid email address', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    forgotPassword() {
      this.$refs.forgotPasswordForm.validate((valid) => {
        if (valid) {
          this.processing = true;
          this.$apollo.mutate({
            mutation: ForgotPassword,
            variables: this.user,
          }).then(() => {
            this.$notify({
              type: 'success',
              title: 'Password Reset Email Sent',
              message: 'Please check your email for further instructions.',
            });
            this.$emit('complete');
          }).catch(() => {
            this.processing = false;
            ErrorHandler.throwError('Please check your email for further instructions.');
          });
        } else {
          ErrorHandler.throwError('Please make sure all fields are complete before submitting');
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
  .password--reset {
    margin: 0;
    &__email--input {
      width: 23em;
      margin: 2.8em 0;
        @media screen and (max-width: 1024px) {
        margin: 2.2em 0;
        width: 20em;
    } 
    }
    &__button {
      margin-right: 1.15em;
    }
    &__sign-in {
      color: $--color-pink;
      font-size: 0.875em;
    }
  }
  .u-button {
    width: 18.3rem;
  }
</style>
