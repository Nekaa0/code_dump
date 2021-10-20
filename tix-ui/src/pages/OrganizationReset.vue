<template>
  <div>
    <navigation></navigation>
    <main>
      <div class="u-bounds u-bounds--500">
        <div>
          <form-header
            title="update your login info">
          </form-header>
          <el-form :model="user" :rules="rules" status-icon ref="orgResetForm" class="u-panel">
            <el-form-item label="new organization email" prop="email">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item label="new organization password" prop="password">
              <el-input type="password" v-model="user.password"></el-input>
            </el-form-item>
            <el-form-item label="confirm new organization password" prop="passwordConfirmation">
              <el-input type="password" v-model="user.passwordConfirmation"></el-input>
            </el-form-item>
            <div class="u-panel-footer">
              <button class="u-button" native-type="submit" type="primary" @click.prevent="updateInfo" :loading="processing">update</button>
            </div>
          </el-form>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Auth from '@/helpers/auth';
import ErrorHandler from '@/helpers/error-handler';
import FormHeader from '@/components/Global/FormHeader';
import ResponseAlert from '@/components/Global/ResponseAlert';
import UPDATE_ORGANIZATION_INFO from '@/graphql/UpdateOrganizationInfo.gql';

export default {
  components: {
    ResponseAlert,
    FormHeader,
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
        email: '',
        password: '',
        passwordConfirmation: '',
      },
      rules: {
        email: [
          { required: true, message: 'please enter your email address', trigger: 'blur, change' },
          { type: 'email', message: 'please use a valid email address', trigger: 'blur' },
        ],
        password: [
          { required: true, message: 'please enter a password', trigger: 'blur' },
          { min: 8, message: 'Your password should be at least eight (8) characters', trigger: 'blur, change' },
        ],
        passwordConfirmation: [
          { required: true, message: 'please confirm your password', trigger: 'blur' },
          { validator: samePassword, trigger: 'blur' },
        ],
      },
    };
  },
  beforeRouteEnter(_to, _from, next) {
    next((vm) => {
      if (Auth.loggedIn()) {
        vm.$router.push('/events');
      }
    });
  },
  methods: {
    updateInfo() {
      this.$refs.orgResetForm.validate((valid) => {
        if (valid) {
          this.processing = true;
          this.$apollo.mutate({
            mutation: UPDATE_ORGANIZATION_INFO,
            variables: Object.assign(this.user, { token: this.$route.query.token }),
          }).then(() => {
            this.$router.push('/login');
            this.$notify({
              type: 'success',
              title: 'Account Updated',
              message: 'Log in to continue creating events',
            });
          }).catch((error) => {
            this.processing = false;
            ErrorHandler.throwError(`${ErrorHandler.getGraphQLError(error)}.`);
          });
        } else {
          this.$message.error('Please make sure all fields are complete before submitting');
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .u-button {
    width: auto;
  }
</style>
