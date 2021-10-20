<template>
  <div>
    <navigation></navigation>
    <div class="u-bounds u-bounds--960 u-bounds--padded">
      <floating-cta @click="$router.go(-1)">Back</floating-cta>
      <main>
        <div class="u-bounds">
          <div class="u-bounds__form">
            <form-header :step="step" :title="title" subtitle="Payment and Registration Information" />
            <div class="u-panel">
              <organization-verification-form :id="organization.id" :slug="organization.slug" @complete="onVerification" />
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import FormHeader from '@/components/Global/FormHeader';
import FloatingCallToAction from '@/components/Global/FloatingCallToAction';
import OrganizationVerificationForm from '@/components/Organization/VerificationForm';

export default {
  components: {
    FormHeader,
    OrganizationVerificationForm,
    FloatingCta: FloatingCallToAction,
  },
  data() {
    return {
      organization: {
        name: '',
        description: '',
        phone: '',
        facebook: '',
        twitter: '',
        website: '',
        logo: '',
      },
      step: {
        current: 2,
        total: 2,
      },
      processing: false,
    };
  },
  computed: {
    title() {
      return `Verify ${this.organization.name}`;
    },
  },
  methods: {
    onVerification() {
      this.$router.push('/organizations');
    },
  },
};
</script>

<style lang="scss" scoped>
main {
  padding-top: $nav-height;
}
</style>
