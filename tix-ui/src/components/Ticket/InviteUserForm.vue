<template>
  <el-form :model="formData" :rules="rules" ref="ticketForm">
    <div>
      <el-row :gutter="20" type="flex" justify="space-between">
        <el-col :span="12" :xs="24">
          <el-form-item prop="senderName" class="form-clear-input">
            <el-input
              v-model="formData.senderName"
              placeholder="sender name"
              class="el-input_ll"
              type="text"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs="24">
          <el-form-item prop="from" class="form-clear-input">
            <el-input v-model="formData.from" placeholder="reply-to" type="email" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" type="flex" justify="space-between">
        <el-col :span="12" :xs="24">
          <el-form-item prop="recipients">
            <el-input
              v-model="formData.recipients"
              placeholder="recipients seperated with commas"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs="24">
          <el-form-item prop="subject" class="form-clear-input">
            <el-input v-model="formData.subject" placeholder="email subject" type="text" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="message" prop="inviteesMessage">
        <VueTrix
          inputId="editor1"
          id="message-trix"
          @trix-file-accept="disableUploads($event)"
          v-model="formData.inviteesMessage"
          placeholder="Enter your message..."
        />
      </el-form-item>
      <div class="footer--block">
        <el-form-item prop="testCC" class="test-email-prompt">
          <el-input
            v-model="formData.testCC"
            class="test-email-prompt__input"
            placeholder="email address to send test message"
            type="email"
          />
        </el-form-item>
        <div class="footer--block__buttons">
          <button
            native-type="submit"
            class="footer--block__button u-button u-button--grey"
            type="default"
            @click.prevent="saveTest"
            :class="{ 'u-button--grey--disabled': !formData.testCC || processingTestEmail }"
            :disabled="!formData.testCC || processingTestEmail"
          >
            <i v-if="processingTestEmail" class="el-icon-loading"></i>
            <span v-else>send test</span>
          </button>
          <button
            native-type="submit"
            class="footer--block__button u-button"
            :class="{ 'u-button--disabled': sendIsDisabled || processing }"
            :disabled="sendIsDisabled || processing"
            @click.prevent="save(false)"
          >
            <i v-if="processing" class="el-icon-loading"></i>
            <span v-else>send</span>
          </button>
        </div>
      </div>
    </div>
  </el-form>
</template>

<script>
import { Row, Col } from 'element-ui';
import Auth from '@/helpers/auth';
import VueTrix from 'vue-trix';
import { validation } from '@/helpers/utility';

export default {
  props: {
    ticket: {
      type: Object,
    },
    reset: Boolean,
    processingTestEmail: Boolean,
  },
  components: {
    ElRow: Row,
    ElCol: Col,
    VueTrix,
  },
  data() {
    const { firstName, email } = Auth.currentUser;
    return {
      processing: false,
      formData: {
        senderName: firstName || '',
        from: email,
        subject: '',
        recipients: '',
        inviteesMessage: '',
      },
      rules: {
        senderName: [
          {
            required: true,
            trigger: 'blur',
            message: "please enter sender's name",
          },
        ],
        from: [
          {
            required: true,
            message: "please enter sender's email address",
            trigger: 'blur, change',
          },
          {
            type: 'email',
            message: "please use a valid sender's email address",
            trigger: 'blur',
          },
        ],
        recipients: [
          {
            validator: this.validateAttendee,
            trigger: 'blur',
            message: 'please specify recipient(s) email address',
          },
        ],
        inviteesMessage: [
          {
            required: true,
            trigger: 'blur',
            message: 'please enter a message for your invitee(s)',
          },
        ],
        testCC: [
          {
            type: 'email',
            message: "please enter a valid test recipient's email address",
            trigger: 'blur',
          },
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
  computed: {
    sendIsDisabled() {
      return Object.values(this.formData).some(p => p === '');
    },
  },
  methods: {
    validateAttendee(_rule, _value, callback) {
      if (this.formData.testCC !== undefined) {
        callback();
      } else {
        validation.isValidEmailCsv(_rule, _value, callback);
      }
    },
    resetForm() {
      this.formData = this.ticket
        ? Object.assign({}, this.ticket, this.formData)
        : this.formData;
      this.processing = false;
      this.$refs.ticketForm.clearValidate();
    },
    saveTest() {
      this.save(true);
    },
    save(testing) {
      this.formData.testing = testing;
      const recipients =
        this.formData.recipients &&
        this.formData.recipients
          .split(',')
          .map(recipient => recipient.trim());
      const formData = Object.assign({}, this.ticket, this.formData, {
        recipients,
      });
      this.$refs.ticketForm.validate((valid) => {
        if (valid) {
          this.processing = !testing;
          this.$emit('save', formData);
          this.$refs.ticketForm.resetFields();
        } else {
          this.processing = false;
          this.formData.testing = false;
          this.$message.error('Please review the errors and try again');
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
.form-clear-input {
  margin-bottom: 2rem;
}
.test-email-prompt {
  margin-bottom: 0;
  @media screen and (min-width: 992px) {
    width: 36rem;
  }
}
.grey-border {
  border: 1px solid rgba(0, 0, 0, 0.2);
}
.trix--editor {
  margin-top: 0.6rem;
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
    border-radius: 5px;
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
.el-row--flex {
  @media screen and (max-width: 767px) {
    display: block;
  }
}
</style>
