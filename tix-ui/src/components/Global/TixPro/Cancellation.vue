<template>
  <div class="cancellation-form">
    <h2 class="cancellation-form__title">confirm downgrade</h2>
    <p class="cancellation-form__subtitle">
      you will no longer be charged for tix pro and your access to tix pro will
      end on {{ paymentDate }}.
    </p>
    <el-form :model="formData" :rules="rules" ref="cancellationForm">
      <el-form-item label="reason for downgrading" prop="cancellationReason">
        <el-select
          v-model="formData.cancellationReason"
          placeholder="select reason for downgrading"
        >
          <el-option
            :value="cancellationReason.id"
            :label="cancellationReason.reason"
            v-for="(cancellationReason, index) in cancellationReasons"
            :key="index"
            >{{ cancellationReason.reason }}</el-option
          >
        </el-select>
      </el-form-item>
      <el-form-item label="write in reason" prop="customCancellationReason" v-if="otherIsSelected">
        <el-input v-model="formData.customCancellationReason" />
      </el-form-item>
    </el-form>
    <div class="cancellation-form__cta">
      <button class="u-button u-button--medium u-button--grey" @click.prevent="goBack">go back</button>
      <button class="u-button u-button--medium"
        :class="{ 'u-button--disabled' : !isDisabled()}"
      @click.prevent="downgrade">
      <i v-if="processing" class="el-icon-loading"></i>
      <span v-else>downgrade</span>
      </button>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import FETCH_CANCELLATION_REASONS from '@/graphql/TixPro/FetchCancellationReasons.gql';
import CREATE_CANCELLATION from '@/graphql/TixPro/CreateCancellation.gql';
import ErrorHandler from '@/helpers/error-handler';

export default {
  name: 'cancellation-popup',
  props: {
    nextPaymentDate: Number,
  },
  data() {
    return {
      processing: false,
      formData: {
        cancellationReason: '',
        customCancellationReason: null,
      },
      cancellationReasons: [],
      rules: {
        cancellationReason: [
          { required: true, trigger: 'blur, change' },
        ],
        customCancellationReason: [
          { required: true, trigger: 'blur, change', message: 'reason is required' },
        ],
      },
    };
  },
  apollo: {
    cancellationReasons: {
      query: FETCH_CANCELLATION_REASONS,
      update: data => data.cancellationReasons,
      fetchPolicy: 'network-only',
    },
  },
  computed: {
    otherIsSelected() {
      if (this.cancellationReasons.length) {
        const other = this.cancellationReasons.find(c => c.reason === 'other');
        return (other.id === this.formData.cancellationReason);
      }
      return false;
    },
    paymentDate() {
      return moment.unix(this.nextPaymentDate).format('MMM D, YYYY');
    },
  },
  methods: {
    downgrade() {
      this.$refs.cancellationForm.validate((valid) => {
        if (valid) {
          this.processing = true;
          this.$apollo.mutate({
            mutation: CREATE_CANCELLATION,
            variables: this.formData,
          }).then(() => {
            this.processing = false;
            this.$message.success('You have successfully cancelled your tix pro plan');
            this.$refs.cancellationForm.resetFields();
            this.goBack();
            this.$router.go();
          }).catch((error) => {
            this.processing = false;
            ErrorHandler.throwGraphQLError(error);
          });
        } else {
          this.$message.error('Please review the errors and try again');
        }
      });
    },
    goBack() {
      this.$emit('back');
    },
    customCancellationReason() {
      if (this.otherIsSelected) {
        return this.formData.customCancellationReason;
      }
      return true;
    },
    isDisabled() {
      return this.formData.cancellationReason
      && this.customCancellationReason();
    },
  },
};
</script>

<style lang="scss">
.el-form-item {
  margin-bottom: 1.9rem;
}
.el-form-item__label {
  font-size: 1.2rem;
  margin-bottom: 0.4rem;
  line-height: 1.2;
}
.el-select {
  width: 100%;
}
</style>

<style lang="scss" scoped>
.cancellation-form {
  position: relative;
  color: $--color-black;
  padding: 3rem 2.6rem 8.2rem;
  margin: -6rem -2rem -3rem;
  &__title {
    font-size: 1.6rem;
    margin-bottom: 2rem;
  }
  &__subtitle {
    font-size: 1.2rem;
    opacity: 0.8;
    margin-bottom: 2rem;
  }
  &__cta {
    position: absolute;
    right: 2.6rem;
    bottom: 3rem;
  }
  @media screen and (min-width: 768px) {
    padding: 2rem 2.5rem 5.7rem 1.9rem;
    max-width: 42rem;
    &__title {
      font-size: 1.8rem;
      margin-bottom: 1.9rem;
    }
    &__subtitle {
      font-size: 1.4rem;
    }
    &__cta {
      position: absolute;
      right: 1.7rem;
      bottom: 2rem;
    }
  }
}
.u-button {
  width: 10rem;
  &--grey {
    margin-right: 2rem;
  }
}
</style>
