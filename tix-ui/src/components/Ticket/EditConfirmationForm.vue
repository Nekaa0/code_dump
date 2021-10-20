<template>
  <el-form :model="formData" :rules="rules" ref="ticketConfirmationForm">
    <el-form-item label="message for ticket email" prop="message">
      <VueTrix
        inputId="editor1"
        id="message-trix"
        @trix-file-accept="disableUploads($event)"
        v-model="formData.message"
        placeholder="We advise you take an Uber, It's the green building on the left, etc"
      />
    </el-form-item>
    <div class="footer--block">
      <el-form-item prop="testCC" class="test-email-prompt">
        <el-input
          v-model="formData.testCC"
          class="test-email-prompt__input"
          placeholder="email address to send test message"
        />
      </el-form-item>
      <div class="footer--block__buttons">
        <button
          native-type="submit"
          class="footer--block__button u-button u-button--grey"
          :class="{ 'u-button--disabled': !formData.testCC }"
          @click.prevent="saveTest"
          :disabled="!formData.testCC"
        >
          <i v-if="formData.testEmail" class="el-icon-loading"></i>
          <span v-else>send test</span>
        </button>
        <button
          native-type="submit"
          class="footer--block__button u-button"
          @click.prevent="save(false)"
        >
          <i v-if="processing" class="el-icon-loading"></i>
          <span v-else>set live</span>
        </button>
      </div>
    </div>
  </el-form>
</template>

<script>
import { Row, Col } from 'element-ui';
import VueTrix from 'vue-trix';

export default {
  props: {
    event: {
      type: Object,
      required: true,
    },
    processing: Boolean,
    reset: Boolean,
  },
  components: {
    ElRow: Row,
    ElCol: Col,
    VueTrix,
  },
  data() {
    return {
      formData: {
        message: this.event.customTicketMessage || null,
      },
      rules: {
        message: [
          { required: true, trigger: 'blur', message: 'please enter a message' },
        ],
      },
    };
  },
  watch: {
    reset() {
      this.resetForm();
    },
  },
  mounted() {
    this.resetForm();
  },
  methods: {
    resetForm() {
      this.formData = { message: this.event.customTicketMessage, testCC: null, testEmail: false };
      this.$refs.ticketConfirmationForm.clearValidate();
    },
    saveTest() {
      this.$emit('saveTest');
      this.formData.testEmail = true;
      this.save(true);
    },
    save() {
      const formData = Object.assign({ id: this.event.id }, this.formData);
      this.$refs.ticketConfirmationForm.validate((valid) => {
        if (valid) {
          this.$emit('save', formData);
          this.$refs.ticketConfirmationForm.resetFields();
        } else {
          this.$message.error('please review the errors and try again');
        }
      });
    },
    disableUploads(event) {
      if (event) event.preventDefault();
    },
  },
};
</script>

<style lang="scss" scoped>
#message-trix {
  width: 100%;
}
.button--block {
  padding-bottom: 2rem;
}
.test-email-prompt {
  margin-bottom: 0;
  @media screen and (min-width: 992px) {
    width: 36rem;
  }
}
.footer--block {
  border-radius: 0 0 10px 10px;
  background-color: rgba(196, 196, 196, 0.2);
  margin: 0 -3.2rem 0 -2.1rem;
  padding: 1.7rem 5% 1.3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width: 992px) {
    display: block;
  }
  @media only screen and (min-width: 450px) and (max-width: 992px) {
    padding: 1.7rem 15% 1.3rem;
  }
  &__button {
    width: 12.9rem;
    @media screen and (min-width: 992px) {
      margin-left: 1.6rem;
    }
  }
  &__buttons {
    display: flex;
    @media screen and (max-width: 992px) {
      justify-content: space-between;
      padding-top: 0.5rem;
    }
  }
}
.u-button--disabled {
  background-color: $--color-white;
  color: rgba($color: $--color-black, $alpha: 0.32);
  border: 1px solid rgba(0, 0, 0, 0.2);
}
</style>
