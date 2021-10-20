<template>
  <div>
    <navigation></navigation>
    <main>
      <div class="u-bounds u-bounds--500">
        <form-header
          title="reset password">
        </form-header>
        <div v-if="!updatedUser">
          <password-reset-form @complete="showConfirmation" />
        </div>
        <div class="u-panel" v-else>
          <div class="confirmation">
            <div class="confirmation-image">
              <img src="@/assets/paper-airplane.png" alt="Paper Airplane">
            </div>
            <div class="confirmation-body">
              <p>we just sent you an email at <b>({{ updatedUser.email }})</b>.</br> 
                follow the link in the email to confirm your account. </br> 
                after this, you'll be able to start creating events.
            </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import FormHeader from '@/components/Global/FormHeader';
import PasswordResetForm from '@/components/Auth/PasswordResetForm';

export default {
  components: {
    FormHeader,
    PasswordResetForm,
  },
  data() {
    return {
      updatedUser: null,
    };
  },
  computed: {
    subtitle() {
      return this.completed ? 'your password has been updated' : 'reset your password';
    },
  },
  methods: {
    showConfirmation() {
      const redirect = this.$route.query.redirect || { name: 'ListEvents' };
      this.$router.push(redirect);
    },
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
</style>
