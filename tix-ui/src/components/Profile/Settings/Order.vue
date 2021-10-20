<template>
  <div>
    <el-form :model="formData" ref="orderNotificationForm">
      <el-form-item class="settings-label" label="how frequently should we send order notifications by email?" prop="setting">
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
import UPDATE_ORDER_NOTIFICATION_SETTINGS from '@/graphql/UserSettings/UpdateOrderNotificationSettings.gql';
import FETCH_NOTIFICATION_SETTINGS from '@/graphql/UserSettings/FetchNotificationSettings.gql';
import ErrorHandler from '@/helpers/error-handler';
import { RadioGroup } from 'element-ui';

export default {
  name: 'Order',
  components: {
    ElRadioGroup: RadioGroup,
  },
  apollo: {
    currentUser: {
      query: FETCH_NOTIFICATION_SETTINGS,
      update: data => data.currentUser,
      fetchPolicy: 'network-only',
    },
  },
  watch: {
    currentUser(user) {
      this.formData.setting = user.setting ? user.setting.notifications : null;
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
        { text: 'instantly, for each order as it comes in', value: 'instant' },
        { text: 'daily summary, a daily summary of all orders sold each day', value: 'daily' },
        { text: 'weekly summary, a weekly summary of all orders sold each week', value: 'weekly' },
        { text: 'i do not want to receive order notifications', value: 'none' },
      ],
    };
  },
  methods: {
    save() {
      this.processing = true;
      this.$apollo.mutate({
        mutation: UPDATE_ORDER_NOTIFICATION_SETTINGS,
        variables: this.formData,
      }).then(() => {
        this.$message.success('order notification settings updated');
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
