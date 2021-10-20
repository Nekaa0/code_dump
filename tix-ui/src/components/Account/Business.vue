<template>
  <div class="business-account">
    <div class="form-wrapper">
      <div>
        <form-header class="form-header"
          title="tell us about your organization">
        </form-header>
      </div>
    </div>
    <div class="business-account__signup__form">
      <signup-form :goToPreviousPage="goToPreviousPage" accountType="organization" />
    </div>
  </div>
</template>

<script>
import FormHeader from '@/components/Global/FormHeader';
import SignupForm from '@/components/Auth/SignupForm';

export default {
  name: 'business-account',
  components: {
    FormHeader,
    SignupForm,
  },
  props: {
    goToPreviousPage: Function,
  },
};
</script>

<style lang="scss">
  .business-account {
    background: white;
    transition: box-shadow 0.3s ease;
    padding-left: 6.8%;
    padding-top: 4.4rem;
    max-width: 50rem;
    @media screen and (max-width: 767px) {
      padding-left: 0;
      padding-top: 8%;
    }
    &__signup__form {
      margin-top: 1rem;
    }
    .form-wrapper {
      display: flex;
      justify-content: space-between;
      padding: 0;
    }
    .step-wrapper {
      padding-top: 8px;
    }
  }
</style>
