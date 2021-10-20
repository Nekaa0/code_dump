<template>
  <el-form class="login--form" :model="user" :rules="rules" status-icon ref="loginForm">
    <el-form-item class="login--form__email" v-bind:label="emailLabel" prop="email">
      <el-input class="login--form__email--input" name="email" auto-complete v-model="user.email" v-bind:placeholder="emailAddressPlaceholder"></el-input>
    </el-form-item>
    <el-form-item class="login--form__password" v-bind:label="passwordLabel" prop="password">
      <el-input class="login--form__password--input" type="password" v-model="user.password" v-bind:placeholder="passwordPlaceholder"></el-input>
    </el-form-item>
      <router-link class="login--form__forgotpassword--link" :to="{name: 'ForgotPassword'}">forgot password?</router-link>
    <div class="login--form__buttons">
      <button class="u-button" native-type="submit" @click.prevent="login"><i v-if="processing" class="el-icon-loading"></i> sign in</button>
      <router-link class="login--form__buttons--sign-up" :to="{name: 'Signup'}">sign up</router-link>
    </div>
  </el-form>
</template>

<script>
import ErrorHandler from '@/helpers/error-handler';
import Auth from '@/helpers/auth';
import LOGIN from '@/graphql/Login.gql';

export default {
  props: {
    emailLabel: {
      type: String,
    },
    passwordLabel: {
      type: String,
    },
    emailAddressPlaceholder: {
      type: String,
    },
    passwordPlaceholder: {
      type: String,
    },
  },
  data() {
    return {
      processing: false,
      user: {
        email: '',
        password: '',
      },
      rules: {
        email: [
          { required: true, message: 'please enter your email address', trigger: 'blur, change' },
          { type: 'email', message: 'please use a valid email address', trigger: 'blur' },
        ],
        password: [
          { required: true, message: 'please enter your password', trigger: 'blur, change' },
        ],
      },
    };
  },
  methods: {
    login() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.processing = true;
          this.$apollo.mutate({
            mutation: LOGIN,
            variables: this.user,
          }).then((response) => {
            Auth.saveToken(response.data.signIn.authenticationToken);
            this.$emit('complete');
            this.processing = false;
          }).catch((error) => {
            this.processing = false;
            ErrorHandler.throwGraphQLError(error);
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
  .login--form {
    padding-top: 2.375em;
    &__email {
      margin-bottom: 1.18em;
      &--input {
        width: 23em;
        @media screen and (max-width: 1024px) {
          width: 20em;
     }
    }
    }
    &__password {
      margin-bottom: 1.18em;
      &--input {
        width: 23em;
        @media screen and (max-width: 1024px) {
          width: 20em;
      }
    }
    }
    &__forgotpassword--link {
      font-size: 1.4rem;
      color: $--color-green;
    }
    &__buttons {
      margin-top: 1.18em;
      display: flex;
      align-items: center;
      @media screen and (max-width: 767px){
        margin-top: 1em;
      }
      &--sign-up {
        margin-left: 1.15em;
        color: $--color-pink;
        font-size: 1.4rem;
      }
    }
  }
</style>
