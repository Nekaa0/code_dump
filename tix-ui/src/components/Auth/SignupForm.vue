<template>
  <el-form :model="user" :rules="rules" status-icon ref="signupForm">
    <div v-if="accountType === 'personal'">
      <el-form-item prop="firstName">
        <el-input v-model="user.firstName" placeholder="first name" auto-complete></el-input>
      </el-form-item>
      <el-form-item prop="lastName">
        <el-input v-model="user.lastName" placeholder="last name" auto-complete></el-input>
      </el-form-item>
    </div>
    <div v-else-if="accountType === 'organization'">
      <el-form-item prop="firstName">
        <el-input v-model="user.firstName" placeholder="registered business name" auto-complete></el-input>
      </el-form-item>
    </div>
    <el-form-item prop="email">
      <el-input v-model="user.email" type="email" placeholder="email" auto-complete></el-input>
    </el-form-item>
    <el-form-item prop="country">
      <country-select v-model="user.country"></country-select>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="user.password" placeholder="password"></el-input>
    </el-form-item>
    <el-form-item prop="passwordConfirmation">
      <el-input type="password" v-model="user.passwordConfirmation" placeholder="confirm password"></el-input>
    </el-form-item>
    <div class="submit-buttons">
      <button class="u-button u-button--grey" @click="goToPreviousPage">back</button>
      <button class="u-button" native-type="submit" @click.prevent="signup"><i v-if="processing" class="el-icon-loading"></i>next</button>
    </div>
  </el-form>
</template>

<script>
import ErrorHandler from '@/helpers/error-handler';
import SIGN_UP from '@/graphql/SignUp.gql';
import CountrySelect from '../Global/CountrySelect';

export default {
  components: {
    CountrySelect,
  },
  props: {
    goToPreviousPage: Function,
    accountType: String,
  },
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
        firstName: '',
        lastName: '',
        email: '',
        country: 'NG',
        password: '',
        passwordConfirmation: '',
        referralToken: (new URLSearchParams(window.location.search)).get('referral_token'),
      },
      rules: {
        firstName: [
          { required: true, message: 'Please enter first name', trigger: 'blur, change' },
        ],
        lastName: [
          { required: true, message: 'Please enter last name', trigger: 'blur, change' },
        ],
        country: [
          { required: true, message: 'Please enter country', trigger: 'blur, change' },
        ],
        email: [
          { required: true, message: 'Please enter your email address', trigger: 'blur, change' },
          { type: 'email', message: 'Please use a valid email address', trigger: 'blur' },
        ],
        password: [
          { required: true, message: 'Please enter a password', trigger: 'blur' },
          { min: 8, message: 'Your password should be at least eight (8) characters', trigger: 'blur, change' },
        ],
        passwordConfirmation: [
          { required: true, message: 'Please confirm your password', trigger: 'blur' },
          { validator: samePassword, trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    signup() {
      this.$refs.signupForm.validate((valid) => {
        if (valid) {
          this.processing = true;
          this.$apollo.mutate({
            mutation: SIGN_UP,
            variables: Object.assign({ accountType: this.accountType }, this.user),
          }).then(() => {
            this.$router.push('/confirm_email');
          }).catch((error) => {
            this.processing = false;
            ErrorHandler.throwGraphQLError(error);
          });
        } else {
          this.$message.error('Please make sure all fields are complete before submitting');
        }
      });
    },
  },
};
</script>

<style lang="scss">
  .el-form-item {
    margin-bottom: 2rem;
  }
</style>

<style lang="scss" scoped>
  .submit-buttons {
    padding-top: 2rem;
    display: flex;
    .u-button {
      margin-right: 1.6rem;
    }
  }
</style>
