<template>
  <div>
    <el-form :model="formData" ref="paymentSettingForm">
      <el-form-item class="settings-label" label="how frequently do you want to receive payouts of ticket sales?" prop="setting">
        <el-radio-group v-model="formData.setting">
          <el-radio v-for="option in options" :key="option.value" class="settings-checkbox" :name="option.value" :label="option.value">{{option.text}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <button
        class="u-button"
        native-type="submit"
        :class="{ 'u-button--disabled': processing }"
        @click.prevent="save"
        :disabled="processing">
        <i v-if="processing" class="el-icon-loading"></i>
        <span v-else>save</span>
      </button>
    </el-form>
  </div>
</template>

<script>
import UPDATE_SETTLEMENT_SETTINGS from '@/graphql/UserSettings/UpdateSettlementSettings.gql';
import FETCH_SETTLEMENT_SETTINGS from '@/graphql/UserSettings/FetchSettlementSettings.gql';
import ErrorHandler from '@/helpers/error-handler';
import { RadioGroup } from 'element-ui';

export default {
  name: 'Payment',
  components: {
    ElRadioGroup: RadioGroup,
  },
  apollo: {
    currentUser: {
      query: FETCH_SETTLEMENT_SETTINGS,
      update: data => data.currentUser,
      fetchPolicy: 'network-only',
    },
  },
  watch: {
    currentUser(user) {
      this.formData.setting = user.setting ? user.setting.settlements : null;
    },
  },
  data() {
    return {
      processing: false,
      currentUser: null,
      formData: {
        setting: '',
      },
      options: [
        { text: 'daily, your payouts are made on the next business day', value: 'daily' },
        { text: 'weekly, your payouts are batched and paid once a week on friday', value: 'weekly' },
      ],
    };
  },
  methods: {
    save() {
      this.processing = true;
      this.$apollo.mutate({
        mutation: UPDATE_SETTLEMENT_SETTINGS,
        variables: this.formData,
      }).then(() => {
        this.$message.success('payment settings updated');
        this.processing = false;
      }).catch((error) => {
        this.processing = false;
        ErrorHandler.throwGraphQLError(error);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .settings {
    &-checkbox {
      margin-left: 0px;
      font-weight: 300;
      border-radius: 4px;
      margin-bottom: 1.4rem;
      display: flex;
      align-items: center;
    }
    &-label {
      font-size: 1px;
    }
  }
  .u-button {
    margin-top: 1.6rem;
  }
</style>
