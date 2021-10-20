<template>
  <el-form :rules="rules" :model="formData" ref="changePasswordForm">
    <el-form-item label="old password" prop="currentPassword">
      <el-input type="password" v-model="formData.currentPassword" placeholder="old password" />
    </el-form-item>  
    <el-form-item label="new password" prop="newPassword">
      <el-input type="password" v-model="formData.newPassword" placeholder="new password" />
    </el-form-item>
    <el-form-item label="repeat new password" prop="newPasswordConfirmation">
      <el-input type="password" v-model="formData.newPasswordConfirmation" placeholder="new password" />
    </el-form-item>
      <button
        class="u-button"
        native-type="submit"
        :class="{ 'u-button--disabled': processing }"
        @click.prevent="update">
        <i v-if="processing" class="el-icon-loading"></i>
        <span v-else>save</span>
      </button>
  </el-form>
</template>

<script>
import CHANGE_PASSWORD from '@/graphql/ChangePassword.gql';
import ErrorHandler from '@/helpers/error-handler';

export default {
  data() {
    const samePassword = (rule, value, callback) => {
      setTimeout(() => {
        if (this.formData.newPasswordConfirmation === '') {
          callback(new Error('Please enter the password again'));
        } else if (this.formData.newPassword !== this.formData.newPasswordConfirmation) {
          callback(new Error('The passwords you entered don\'t match.'));
        } else {
          callback();
        }
      }, 200);
    };

    return {
      processing: false,
      formData: {
        currentPassword: '',
        newPassword: '',
        newPasswordConfirmation: '',
      },
      rules: {
        currentPassword: [
          { required: true, trigger: 'change', message: 'please enter your current password' },
        ],
        newPassword: [
          { required: true, trigger: 'change', message: 'please enter a new password' },
        ],
        newPasswordConfirmation: [
          { required: true, message: 'please confirm your password', trigger: 'change' },
          { validator: samePassword, trigger: 'change' },
        ],
      },
    };
  },
  methods: {
    update() {
      this.$refs.changePasswordForm.validate((valid) => {
        if (valid) {
          this.processing = true;
          this.$apollo.mutate({
            mutation: CHANGE_PASSWORD,
            variables: this.formData,
          }).then(() => {
            this.processing = false;
            this.$message.success('Password Updated');
            this.formData.currentPassword = null;
            this.formData.newPassword = null;
            this.formData.newPasswordConfirmation = null;
            this.$refs.changePasswordForm.resetFields();
            this.$emit('complete');
          }).catch((error) => {
            this.processing = false;
            ErrorHandler.throwGraphQLError(error);
          });
        } else {
          this.$message.error('Please review the errors and try again');
        }
      });
    },
  },
};
</script>
