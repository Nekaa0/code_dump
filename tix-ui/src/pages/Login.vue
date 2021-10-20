<template>
  <div>
    <navigation></navigation>
    <main>
      <div class="login--page">
        <div class="login--page__image">
          <img src="@/assets/dancing-couple-with-tix-icons.svg" alt="Dancing couple wearing native attire dancing with tix icons">
        </div>
        <div class="login--page__form">
          <form-header class="login--page__form-header"
            title="welcome back">
          </form-header>
          <login-form @complete="goToApp" emailAddressPlaceholder="email address" passwordPlaceholder="password"/>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import FormHeader from '@/components/Global/FormHeader';
import LoginForm from '@/components/Auth/LoginForm';

export default {
  components: {
    FormHeader,
    LoginForm,
  },
  methods: {
    goToApp() {
      const redirect = this.$route.query.redirect || { name: 'ListEvents' };
      this.$router.push(redirect);
    },
  },
};
</script>

<style lang="scss" scoped>
  .login--page {
    display: flex;
    margin: 5.4rem 14rem;
    @media screen and (max-width: 768px) {
      margin: 3.25em auto;
      flex-direction: column-reverse;
    }
    &__image {
      flex: 1;
      @media screen and (max-width: 768px) {
        img {
          display: none;
        }
      }    
    }
    &__form {
      margin-left: 8%;
      flex: 1;
      @media screen and (max-width: 768px) {
        margin: 0 auto;
      }    
    }
  }
</style>
