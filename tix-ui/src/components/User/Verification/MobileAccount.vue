<template>
 <div>
   <el-form key="form" :model="formData" :rules="rules" class="form" ref="mobileAccountForm">
      <el-form-item label="choose mobile network" prop="mobile_provider_name" >
        <provider-select v-model="formData.mobile_provider_name" />
      </el-form-item>
      <el-form-item label="phone number" prop="phone_number">
        <el-input v-model.trim="formData.phone_number" placeholder="e.g 033505050"/>
      </el-form-item>
      <div class="cta--block">
        <button class="u-button back-button u-button--grey" @click.prevent="$emit('back')">back</button>
        <button native-type="submit" class="u-button" @click.prevent="save" :class="{'u-button--disabled': formData.phone_number === ''}" :disabled="formData.phone_number === ''">
          <i v-if="processing" class="el-icon-loading"></i>
          <span v-else>continue</span>
        </button>
      </div>
    </el-form>
  </div>

</template>

<script>
import { validation } from '@/helpers/utility';
import ProviderSelect from '@/components/Global/mobileProviderSelect';

import ErrorHandler from '@/helpers/error-handler';
import SET_MOBILE_ACCOUNT from '@/graphql/createMobileAccount.gql';

export default {
  props: {
    id: String,
    slug: String,
    paymentMethod: String,
  },
  components: {
    ProviderSelect,
  },
  data() {
    return {
      formData: {
        phone_number: '',
        mobile_provider_name: '',
        payment_method: this.paymentMethod,
      },
      fetching: false,
      processing: false,
      rules: {
        phone_number: [
          { required: true, trigger: 'blur', validator: validation.isNumeric, message: 'please enter a valid phone number' },
        ],
        mobile_provider_name: [
          { required: true, trigger: 'change', message: 'Please choose a mobile provider' },
        ],
      },
    };
  },
  methods: {
    save() {
      this.processing = true;
      this.$refs.mobileAccountForm.validate((valid) => {
        if (valid) {
          this.$apollo.mutate({
            mutation: SET_MOBILE_ACCOUNT,
            variables: this.formData,
          }).then((response) => {
            this.processing = false;
            this.$emit('complete', response.data.createOrUpdateMobileAccount);
            this.$refs.mobileAccountForm.resetFields();
          }).catch((error) => {
            this.processing = false;
            ErrorHandler.throwGraphQLError(error);
          });
        }
      });
    },
  },
};
</script>
<style lang="scss">
  .el-form-item {
    margin-bottom: 3rem;
  }
</style>

<style lang="scss" scoped>
.cta--block {
    background: rgba(196, 196, 196, 0.2);
    border-radius: 0 0 10px 10px;
    padding: 2.3rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 -3.2rem 0 -2.1rem;
  }
  .back-button {
    margin-right: 1.6rem;
    background: #fff;
  }
  .form {
    padding-top: 2rem;
    margin: -1rem 0 -3rem;
  }
  .loading {
    background-color: $--background-color-base;
    border-color: $--border-color-light;
    text-align: center;
  }
</style>
