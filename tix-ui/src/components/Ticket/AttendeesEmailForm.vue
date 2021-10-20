<template>
    <el-form :model="formData" :rules="rules" ref="attendeesEmailForm" class="attendees--form"> 
      <div class="attendees--form-body">
        <el-row :gutter="20" type="flex" justify="space-between">
          <el-col :span="12" :xs="24">
            <el-form-item prop="senderName" class="form-clear-input">
              <el-input v-model="formData.senderName" placeholder="sender name" class="el-input_ll"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item prop="from" class="form-clear-input">
              <el-input v-model="formData.from" type="email" placeholder="reply-to" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" type="flex" justify="space-between">
          <el-col :span="12" :xs="24">
          <el-form-item prop="to" class="form-clear-input">
            <el-select clearable filterable v-model="formData.to" class="el-select_custom" placeholder="recipients separated with commas" @change="update">
              <el-option value="email all attendees">email all attendees</el-option>
              <el-option
                v-for="(attendeeEmail, index) in this.attendeesEmails"
                :key="index"
                :label="attendeeEmail"
                :value="attendeeEmail">
              </el-option>
            </el-select>          
          </el-form-item>   
          </el-col>
          <el-col :span="12" :xs="24">
          <el-form-item prop="subject" class="form-clear-input">
              <el-input v-model="formData.subject" type="text" placeholder="email subject" />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="trix--editor">
          <el-form-item prop="content" label="message">
            <VueTrix inputId="editor1" id="message-trix" @trix-file-accept="disableUploads($event)" v-model="formData.content" placeholder="We advise you take an Uber, It's the green building on the left, etc"/>
          </el-form-item>
        </div>
      </div>
      <div class="footer--block">
          <el-form-item prop="testCC" class="test-email-prompt">
            <el-input v-model="formData.testCC" class="test-email-prompt__input" type="email" placeholder="email address to send test message" />
          </el-form-item>
          <div class="footer--block__buttons">
            <button native-type="submit" 
              class="footer--block__button u-button u-button--grey" 
              @click.prevent="saveTest" 
              :class="{'u-button--grey--disabled': !formData.testCC || processingTestEmail}" 
              :disabled="!formData.testCC || processingTestEmail">
              <i v-if="processingTestEmail" class="el-icon-loading"></i>
              <span v-else>send test</span>
            </button>
            <button native-type="submit"
              class="footer--block__button u-button" 
              @click.prevent="save(false)" 
              :class="{'u-button--disabled' : sendIsDisabled || processing}" 
              :disabled="sendIsDisabled || processing">
              <i v-if="processing" class="el-icon-loading"></i>
              <span v-else>send</span>
            </button>
          </div>
      </div>
    </el-form>
</template>

<script>
import { Row, Col, Select, Option } from 'element-ui';
import Auth from '@/helpers/auth';
import VueTrix from 'vue-trix';
import { validation } from '@/helpers/utility';

export default {
  props: {
    attendee: {
      type: Object,
    },
    attendeesEmails: {
      type: Array,
      default() {
        return [];
      },
    },
    reset: Boolean,
    processing: Boolean,
    processingTestEmail: Boolean,
  },
  components: {
    ElRow: Row,
    ElCol: Col,
    ElSelect: Select,
    ElOption: Option,
    VueTrix,
  },
  data() {
    const { firstName, email } = Auth.currentUser;
    return {
      formData: {
        content: '',
        senderName: firstName || '',
        from: email,
        to: '',
        subject: '',
      },
      rules: {
        content: [{ required: true, trigger: 'blur', message: 'please enter a message' }],
        senderName: [{ required: true, trigger: 'blur', message: "please enter sender's name" }],
        from: [
          {
            required: true,
            message: "please enter sender's email address",
            trigger: 'blur, change',
          },
          { type: 'email', message: "please use a valid sender's email address", trigger: 'blur' },
        ],
        to: [
          {
            validator: this.validateAttendee,
            message: 'please specify recipient(s) email address',
            trigger: 'blur, change',
          },
        ],
        testCC: [
          {
            type: 'email',
            message: "please enter a valid test recipient's email address",
            trigger: 'blur',
          },
        ],
        subject: [{ required: true, trigger: 'blur', message: 'please enter an email subject' }],
      },
    };
  },
  computed: {
    sendIsDisabled() {
      return Object.values(this.formData).some(p => p === '');
    },
  },
  methods: {
    validateAttendee(_rule, value, callback) {
      if (this.formData.testCC !== undefined) {
        callback();
      } else {
        const email = this.returnAttendee(value);
        validation.isValidEmailCsv(_rule, email, callback);
      }
    },
    returnAttendee(value) {
      return value === 'email all attendees' ? this.attendeesEmails.toString() : value;
    },
    resetForm() {
      this.$refs.attendeesEmailForm.clearValidate();
    },
    saveTest() {
      this.save(true);
    },
    save(testing) {
      this.$refs.attendeesEmailForm.validate((valid) => {
        if (valid) {
          this.formData.testing = testing;
          this.$emit('save', this.formData);
          this.$refs.attendeesEmailForm.resetFields();
        } else {
          this.$message.error('Please review the errors and try again');
        }
      });
    },
    update() {
      this.$emit('input', this.to);
    },
  },
};
</script>

<style lang="scss" scoped>
.attendees--form {
  min-height: 15em;
  width: 100%;
  &-body {
    padding: 4rem 5% 0;
  }
}
.form-clear-input {
  margin-bottom: 2rem;
}
.test-email-prompt {
  margin-bottom: 0;
  @media screen and (min-width: 992px) {
    width: 36rem;
  }
}
.el-select_custom {
  width: 100%;
}
.footer--block {
  border-radius: 0 0 10px 10px;
  background-color: rgba(196, 196, 196, 0.2);
  margin-top: 5.3rem;
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
    height: 3rem;
    font-size: 0.875em;
    font-weight: normal;
    padding: 0;
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
.grey-border {
  border: 1px solid rgba(0, 0, 0, 0.2);
}
.trix--editor {
  margin-top: 0.6rem;
}
.el-row--flex {
  @media screen and (max-width: 767px) {
    display: block;
  }
}
</style>
