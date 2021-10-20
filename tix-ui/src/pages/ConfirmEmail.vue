<template>
  <div>
    <navigation></navigation>
    <main>
      <div class="sign-up">
      <el-row>
        <steps :currentStep="2" />
        <el-col :xs="24" :sm="16">
          <div class="confirm-email">
            <form-header class="confirm-email__title"
              title="confirm your email">
            </form-header>
            <div class="confirm-email__image">
              <img src="@/assets/email-plane.svg" alt="email paper plane">
            </div>
            <div class="prompt" v-if="!error">
              <p class="prompt__description">
                just one more thing. we've just sent you an email to confirm your email address.
                click the link in the email to confirm your account.
              </p>
            </div>
            <template class="error-message" v-if="!processing">
              <response-alert type="error" :title="error.title" :description="error.message"></response-alert>
            </template>
          </div>
        </el-col>
      </el-row>
      </div>
    </main>
  </div>
</template>

<script>
import Auth from '@/helpers/auth';
import ErrorHandler from '@/helpers/error-handler';
import FormHeader from '@/components/Global/FormHeader';
import ResponseAlert from '@/components/Global/ResponseAlert';
import CONFIRM_USER from '@/graphql/ConfirmUser.gql';
import Steps from '@/components/Global/Signup/Steps';

export default {
  components: {
    ResponseAlert,
    FormHeader,
    Steps,
  },
  data() {
    return {
      processing: true,
      error: null,
      loader: null,
      token: null,
    };
  },
  beforeRouteEnter(_to, from, next) {
    next((vm) => {
      if (from.path !== '/signup') {
        vm.validateToken();
      }
    });
  },
  created() {
    this.token = this.$route.query.token;
  },
  methods: {
    validateToken() {
      if (!this.token) {
        this.processing = false;
        this.error = {
          title: 'no token present',
          message: 'there was no token included in the request. please make sure the link is correct and try again.',
        };

        if (Auth.loggedIn()) {
          this.$router.push('/events');
        }
        return;
      }

      this.$apollo.mutate({
        mutation: CONFIRM_USER,
        variables: {
          token: this.token,
        },
      }).then(() => {
        this.$router.push('/login');
        this.$notify({
          type: 'success',
          title: 'Account Confirmed',
          message: 'Log in to start creating events',
        });
      }).catch((error) => {
        this.processing = false;
        this.error = {
          title: 'Error',
          message: `${ErrorHandler.getGraphQLError(error)}. Please make sure the link is correct and try again.`,
        };
        if (Auth.loggedIn()) {
          this.$router.push('/events');
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .alert-content {
    margin: 0 auto;
  }
  .sign-up {
    margin-left: 2.1%;
    margin-right: 10%;
    @media screen and (max-width: 767px) {
      margin: 0 5%;
    }
  }
  .confirm-email {
    text-align: center;
    padding-left: 6.8%;
    padding-top: 4.4rem;
    max-width: 50rem;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    @media screen and (max-width: 767px) {
      width: 100%;
      padding-left: 0;
    }
    &__image {
      margin-bottom: 2rem;
    }
    &__title {
    margin: 0 auto 3.5rem;
    text-align: center;
      @media screen and (max-width: 767px) {
        margin-top: 2rem;
        margin-bottom: 2rem;
    }
  }
  }
  .u-panel {
    min-height: 240px;
  }
  .prompt {
    align-items: center;
    display: flex;
    height: 7em;
    &__description {
      width: 40rem;
      margin: 0 auto;
      font-size: 1.6rem;
      @media screen and (max-width: 767px) {
        margin-top: 0;
        width: auto;
        font-size: 1.2rem;
        padding: 1.2rem;
        margin-bottom: 2rem;
      }
    }
  }
</style>
