<template>
  <el-form :rules="rules" :model="formData" ref="editProfileForm">
    <el-form-item :label="userType.nameLabel" prop="firstName">
      <el-input v-model="formData.firstName" :placeholder="userType.namePlaceholder"/>
    </el-form-item>  
    <el-form-item v-if="accountType === 'personal'" label="last name" prop="lastName">
      <el-input v-model="formData.lastName" placeholder="last name"/>
    </el-form-item>
    <el-form-item :label="userType.phoneLabel" prop="phone">
      <el-input type="tel" v-model="formData.phone" placeholder="phone number"/>
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
import Auth from '@/helpers/auth';
import EDIT_USER from '@/graphql/EditUser.gql';
import ErrorHandler from '@/helpers/error-handler';

export default {
  data() {
    const { firstName, lastName, phone, accountType } = Auth.currentUser;
    return {
      processing: false,
      formData: { firstName, lastName, phone },
      accountType,
      userType: {
        nameLabel: (accountType === 'personal') ? 'first name' : 'organization name',
        phoneLabel: (accountType === 'personal') ? 'phone number' : 'organization phone number',
        namePlaceholder: (accountType === 'personal') ? 'first name' : 'organization name',
      },
      rules: {
        firstName: [
          { required: true, trigger: 'blur, change', message: 'first name is required' },
        ],
        lastName: [
          { required: true, trigger: 'blur, change', message: 'last name is required' },
        ],
        phone: [
          { required: true, trigger: 'blur, change', message: 'phone number is required' },
        ],
      },
    };
  },
  methods: {
    update() {
      this.$refs.editProfileForm.validate((valid) => {
        if (valid) {
          this.processing = true;
          this.$apollo.mutate({
            mutation: EDIT_USER,
            variables: this.formData,
          }).then((response) => {
            Auth.updateUser(response.data.editUser);
            this.$message.success('Profile Updated');
            this.processing = false;
          }).catch((error) => {
            this.processing = false;
            ErrorHandler.throwGraphQLError(error);
          });
        } else {
          this.$message.error('please review the errors and try again');
        }
      });
    },
  },
};
</script>
