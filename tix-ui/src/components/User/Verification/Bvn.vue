<template>
  <el-form :model="formData" ref="bvnForm" class="form">
    <el-form-item label="your date of birth" :rules="rules" required>
      <el-row>
        <el-date-picker
          class="el-date-editor--iconless"
          v-model="formData.dateOfBirth"
          type="date"
          placeholder=""
          format="MMMM dd, yyyy">
        </el-date-picker>
      </el-row>
    </el-form-item>
    <el-form-item label="bank verification number" prop="bvn" :rules="rules" required>
      <el-input type="tel" v-model="formData.bvn" placeholder="" :minlength="11"></el-input>
    </el-form-item>
    <div class="verify--button">
      <button class="u-button" @click.prevent="verifyBvn" :loading="processing">verify</button>
    </div>
  </el-form>
</template>

<script>
import moment from 'moment';
import { DatePicker } from 'element-ui';
import VERIFY_BVN from '@/graphql/VerifyBVN.gql';
import ErrorHandler from '@/helpers/error-handler';
import { validation } from '@/helpers/utility';

export default {
  components: {
    ElDatePicker: DatePicker,
  },
  data() {
    return {
      processing: false,
      formData: { },
      rules: {
        bvn: [
          { required: true, trigger: 'change', message: 'please enter your BVN' },
          { min: 11, max: 11, trigger: 'blur', message: 'your BVN should be 11 numbers' },
          { validator: validation.isDigits, trigger: 'change' },
        ],
      },
    };
  },
  methods: {
    verifyBvn() {
      this.$refs.bvnForm.validate((valid) => {
        if (!valid) return;
        const { bvn, dateOfBirth } = this.formData;
        const variables = { bvn, dateOfBirth: moment(dateOfBirth).format('YYYY-MM-DD') };
        this.processing = true;
        this.$apollo.mutate({
          mutation: VERIFY_BVN,
          variables,
        }).then((response) => {
          this.processing = false;
          this.$emit('complete', response.data.verifyBvn);
        }).catch((error) => {
          this.processing = false;
          ErrorHandler.throwGraphQLError(error);
        });
      });
    },
  },
};
</script>

<style lang="scss">
  .el-form-item {
    margin-bottom: 1.2rem;
  }
  .verify--button {
    padding-top: 1.4rem;
  }
  .form {
    padding-top: 2rem;
  }
</style>