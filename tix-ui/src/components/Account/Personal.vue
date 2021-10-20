<template>
  <div class="personal-account">
    <div class="form-wrapper">
      <div>
        <form-header
          title="tell us about yourself">
        </form-header>
      </div>
    </div>
    <div class="personal-account__signup__form" v-if="!createdUser">
      <signup-form :goToPreviousPage="goToPreviousPage" accountType="personal" />
    </div>
    <div class="u-panel" v-else>
      <div class="confirmation">
        <div class="confirmation-image">
          <img src="@/assets/paper-airplane.png" alt="Paper Airplane">
        </div>
        <div class="confirmation-body">
          <p>We just sent you an email at <b>({{ createdUser.email }})</b>. Follow the link in the email to confirm your account. After this, you'll be able to start creating events.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FormHeader from '@/components/Global/FormHeader';
import SignupForm from '@/components/Auth/SignupForm';

export default {
  name: 'personal-account',
  components: {
    FormHeader,
    SignupForm,
  },
  props: {
    goToPreviousPage: Function,
  },
  data() {
    return {
      createdUser: null,
    };
  },
  methods: {
    // showConfirmation(user) {
    //   this.user = user;
    //   this.$router.push('/confirm_email');
    // },
  },
};
</script>

<style lang="scss" scoped>
@include keyframes(paperPlane) {
  0% {
    @include transform(translateX(-50px) translateY(50px));
  }
  100% {
    @include transform(translateX(0) translateY(0));
  }
}

.personal-account {
  background: white;
  transition: box-shadow 0.3s ease;
  padding-left: 6.8%;
  padding-top: 4.4rem;
  @media screen and (min-width: 767px) {
    width: 50rem;
  }
  @media screen and (max-width: 767px) {
    padding-left: 0;
    padding-top: 8%;
  }
  &__signup__form {
    margin-top: 2rem;
  }
  .form-wrapper {
    padding: 0;
    display: flex;
    justify-content: space-between;
  }
  .confirmation {
    position: relative;
    padding-top: 150px;
    &-image {
      position: absolute;
      width: 300px;
      top: 0;
      left: -100px;
      @include animation('paperPlane 500ms');
    }

    &-body {
      padding-left: 75px;
    }
  }
  .step-wrapper {
    padding-top: 15px;
  }
}
</style>
