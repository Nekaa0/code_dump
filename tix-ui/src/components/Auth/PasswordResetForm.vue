<template>
  <el-form :model="user" :rules="rules" status-icon ref="passwordResetForm" class="u-panel">
    <el-form-item label="password" prop="password">
      <el-input type="password" v-model="user.password"></el-input>
    </el-form-item>
    <el-form-item label="confirm password" prop="passwordConfirmation">
      <el-input type="password" v-model="user.passwordConfirmation"></el-input>
    </el-form-item>
    <div class="u-panel-footer">
      <button native-type="submit" class="u-button" type="primary"   @click.prevent="resetpassword" :loading="processing">reset password</button>
    </div>
  </el-form>
</template>

<script>
import Auth from '@/helpers/auth';
import ErrorHandler from '@/helpers/error-handler';
import PASSWORD_RESET from '@/graphql/PasswordReset.gql';

export default {
  data() {
    const samePassword = (rule, value, callback) => {
      setTimeout(() => {
        if (this.user.passwordConfirmation === '') {
          callback(new Error('please enter the password again'));
        } else if (this.user.passwordConfirmation !== this.user.password) {
          callback(new Error('the passwords you entered don\'t match.'));
        } else {
          callback();
        }
      }, 200);
    };

    return {
      processing: false,
      user: {
        password: '',
        passwordConfirmation: '',
      },
      rules: {
        password: [
          { required: true, message: 'please enter a password', trigger: 'blur' },
          { min: 8, message: 'your password should be at least eight (8) characters', trigger: 'blur, change' },
        ],
        passwordConfirmation: [
          { required: true, message: 'please confirm your password', trigger: 'blur' },
          { validator: samePassword, trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    resetpassword() {
      this.$refs.passwordResetForm.validate((valid) => {
        if (valid) {
          this.processing = true;
          this.$apollo.mutate({
            mutation: PASSWORD_RESET,
            variables: {
              password: this.user.password,
              resetPasswordToken: this.$route.query.token,
            },
          }).then((response) => {
            Auth.saveToken(response.data.passwordReset.authenticationToken);
            this.$emit('complete');
          }).catch((error) => {
            this.processing = false;
            ErrorHandler.throwGraphQLError(error);
          });
        } else {
          this.$message.error('please make sure all fields are complete before submitting');
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .u-button {
    width: auto;
    padding: 0.7rem 1.2rem;
  }
</style>