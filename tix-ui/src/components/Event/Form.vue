<template>
  <div>
    <el-form :model="formData" :rules="rules" ref="aboutLocationForm">
      <div class="event__form--section">
        <div class="event__form--section__header">
          <form-header subtitle="event details" />
          <div class="horizontal--line">
          </div>
        </div>
        <div class="event__form--section__content">
          <el-form-item class="first--child" placeholder="event101" label="event name" prop="title" :show-message="false">
            <el-input @input="updateForm('title', $event)" v-model="formData.title" />
          </el-form-item>
          <el-form-item label="describe your event" prop="description" :show-message="false">
            <VueTrix inputId="editor1" id="message-trix" @trix-file-accept="disableUploads($event)" v-model="formData.description"/>
          </el-form-item>
          <el-form-item v-if="eventType === 'live'" label="location of event" prop="address" :show-message="false">
            <input-location @input="updateForm('address', $event)" :defaults="formData" @update="onChangeLocation"></input-location>
          </el-form-item>
          <el-form-item label="use custom url" prop="customName">
            <el-input @input="updateForm('customName', $event)" placeholder="max 6 characters" v-model="formData.customName" :disabled="isPublished()">
              <template slot="prepend">tix.africa/</template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="eventType === 'live'" label="location & parking tips" prop="address_tips">
            <el-input @input="updateForm('addressTips', $event)" placeholder="use an uber, it's the green building on the left, etc" v-model="formData.addressTips" />
          </el-form-item>
          <el-form-item label="event category" prop="interest">
            <el-select v-model="formData.interest" :placeholder="''" @input="updateForm('interest', $event)">
              <el-option :value="interest.id" :label="interest.name" v-for="(interest, index) in interests" :key="index">{{interest.name}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="event image (800 * 400px)" prop="headerImage">
            <upload v-model="formData.headerImage" :eventType="eventType" mode="picture" :uploadIsEmpty="eventImageIsEmpty" />
          </el-form-item>
        </div>
      </div>
      <div class="event__form--section">
        <div class="event__form--section__header">
          <form-header subtitle="event time & date" />
          <div class="horizontal--line">
          </div>
        </div>
        <div class="event__form--section__content">
          <div class="event__form--section__timing" v-if="!edit">
            <el-button :class="{'active': isActive(option.value)}"
              v-for="(option, index) in eventTiming" :key="index" @click="selectEventTiming(option.value)">
              {{option.name}}
              <tix-pro-icon :width="10" :height="10" v-if="option.value === ''"/>
            </el-button>
          </div>
          <div v-if="formData.frequency === 'once'">
            <p class="event__form--section__content--text error" v-if="hasOrders">please note: date for single events cannot be edited if an order exists</p>
            <el-form-item class="first--child" label="event starts on" prop="startDate" :show-message="false">
              <input-datetime v-model="formData.startDate" @input="onChangeStartDate" :disabled="hasOrders" />
            </el-form-item>
            <el-form-item label="event ends on" prop="endDate" :show-message="false">
              <input-datetime placeholder="time" v-model="formData.endDate" :min="formData.startDate" :disabled="hasOrders" />
            </el-form-item>
          </div>
          <div v-else-if="viewRecurringEvents">
            <p class="event__form--section__content--text error" v-if="edit">please note: date for recurring events cannot be edited</p>
            <p class="event__form--section__content--text" v-else>multiple events happen more than once and attendees can choose a date to attend</p>
            <multiple-date v-model="formData" :edit="edit" @validate="validateForm" />
          </div>
        </div>
      </div>
      <div class="event__form--section last--section">
        <div class="event__form--section__header">
          <form-header subtitle="social details" />
          <div class="horizontal--line">
          </div>
        </div>
        <div class="event__form--section__content">
          <el-form-item class="first--child" label="website" prop="website">
            <el-input @input="updateForm('website', $event)" v-model="formData.website" placeholder="https://website.com" />
          </el-form-item>
          <el-form-item label="twitter" prop="twitter">
            <el-input @input="updateForm('twitter', $event)" v-model="formData.twitter" placeholder="handle">
              <template slot="prepend">https://twitter.com/</template>
            </el-input>
          </el-form-item>
          <el-form-item label="instagram" prop="instagram">
            <el-input @input="updateForm('instagram', $event)" v-model="formData.instagram" placeholder="page">
              <template slot="prepend">https://instagram.com/</template>
            </el-input>
          </el-form-item>
          <el-form-item label="facebook" prop="facebook">
            <el-input @input="updateForm('facebook', $event)" v-model="formData.facebook" placeholder="page">
            <template slot="prepend">https://facebook.com/</template>
            </el-input>
          </el-form-item>
        </div>
      </div>
      <div class="buttons">
        <button class="u-button u-button--grey" @click.prevent="goBack">
          back
        </button>
        <button v-if="isEdit === false" class="u-button u-button-large" @click.prevent="finishLater">
          <i v-if="finish" class="el-icon-loading"></i>
          finish later
        </button>
        <button class="u-button" native-type="submit" :class="{'u-button--disabled': !isDisabled()}" :disabled="!isDisabled()" @click.prevent="save">
          <i v-if="processing" class="el-icon-loading"></i>
          save
        </button>
      </div>
    </el-form>
    <tix-pro-banner
      :header="tixProBannerHeader"
      :buttonText="tixProBannerButtonText"
      :openTixProBanner="openTixProBanner"
      :openMobileBannerView="openMobileBannerView"
      :isPhone="isPhone"
      @back="openMobileBannerView = false"
      @closeBanner="openTixProBanner = false"
    />
  </div>
</template>

<script>
import VueTrix from 'vue-trix';
import IsPhone from '@/mixins/IsPhone';
import SubscriptionPlan from '@/mixins/SubscriptionPlan';
import InputGroup from '@/components/Global/InputGroup';
import InputLocation from '@/components/Global/InputLocation';
import InputDatetime from '@/components/Global/InputDatetime';
import MultipleDate from '@/components/Global/MultipleDate';
import OrganizationSelect from '@/components/Global/OrganizationSelect';
import Upload from '@/components/Global/Upload';
import { isValidDomain } from '@/helpers/utility';
import FormHeader from '@/components/Global/FormHeader';
import FETCH_CATEGORIES from '@/graphql/FetchInterests.gql';
import TixProIcon from '../Global/Icons/TixProIcon';
import TixProBanner from '../Global/TixPro/Banner/Index';

export default {
  name: 'event-form',
  mixins: [IsPhone, SubscriptionPlan],
  props: {
    event: {
      type: Object,
      required: true,
    },
    processing: Boolean,
    edit: Boolean,
    eventType: {
      type: String,
    },
  },
  components: {
    InputGroup,
    InputLocation,
    InputDatetime,
    OrganizationSelect,
    Upload,
    FormHeader,
    VueTrix,
    MultipleDate,
    TixProIcon,
    TixProBanner,
  },
  data() {
    const validateCustomName = (_rule, _value, callback) => {
      if (/^([a-zA-Z0-9]{1,6})$/.test(this.formData.customName) || !this.formData.customName) {
        callback();
      } else {
        callback(new Error('maximum 6 characters allowed'));
      }
    };

    const validateCustomUrl = (_rule, _value, callback) => {
      if (typeof _value === 'undefined' || _value === null || _value === '') callback();
      if (isValidDomain(this.formData.website)) {
        callback();
      } else {
        callback(new Error('invalid url'));
      }
    };
    return {
      isEdit: this.edit,
      formData: this.event,
      organizerDialogVisible: false,
      eventImageIsEmpty: false,
      interests: [],
      externalMeeting: {
        link: '',
      },
      rules: {
        title: [
          { required: true, trigger: 'blur, change' },
        ],
        description: [
          { required: true, trigger: 'blur, change' },
        ],
        customName: [
          { validator: validateCustomName, trigger: 'blur, change' },
        ],
        address: [
          { required: true, trigger: 'blur' },
        ],
        startDate: [
          { required: true, trigger: 'blur' },
        ],
        endDate: [
          { required: true, trigger: 'blur' },
        ],
        frequency: [
          { required: true, trigger: 'blur' },
        ],
        repeats: [
          { required: true, trigger: 'blur' },
          { type: 'number', trigger: 'blur', min: 1, max: 19, message: 'please enter a number between 1 - 19' },
        ],
        startTime: [
          { required: true, trigger: 'blur' },
        ],
        endTime: [
          { required: true, trigger: 'blur', message: 'please select an end time' },
        ],
        interest: [
          { required: !this.edit, message: 'please select an event category' },
        ],
        headerImage: [
          { required: true, message: 'please upload the header image for your event' },
        ],
        website: [
          { validator: validateCustomUrl, trigger: 'blur, change', message: 'invalid url' },
        ],
        owner: [
          { required: false },
        ],
      },
      eventTiming: [
        {
          name: 'single event',
          value: 'once',
        },
        {
          name: 'recurring events',
          value: '',
        },
      ],
      finish: false,
      validReoccurence: true,
      openTixProBanner: false,
      openMobileBannerView: false,
      tixProBannerHeader: 'upgrade to add recurring events',
      tixProBannerButtonText: 'upgrade to add recurring events',
    };
  },
  apollo: {
    interests: {
      query: FETCH_CATEGORIES,
      update: data => data.interests,
    },
  },
  mounted() {
    if (this.isEdit) {
      const { id } = this.formData.interest;
      this.formData.interest = id;
    }
  },
  methods: {
    isPublished() {
      return this.event.status === 'active';
    },
    onChangeLocation(location) {
      Object.assign(this.formData, location);
    },
    onChangeStartDate() {
      const { startDate, endDate } = this.formData;
      const endTime = 1800;
      const futureEndDate = endDate && (endDate > startDate);
      if (!startDate || futureEndDate) return;
      this.formData.endDate = startDate + endTime;
    },
    goBack() {
      if (this.edit) this.$emit('back');
      else this.$router.go(-1);
    },
    validateForm(val) {
      this.validReoccurence = val;
    },
    save() {
      this.$refs.aboutLocationForm.validate((valid) => {
        if (valid) {
          this.formData.eventType = this.eventType;
          this.$emit('save', this.formData);
          localStorage.removeItem('formData');
        } else {
          if (!this.formData.headerImage) this.eventImageIsEmpty = true;
          this.$message.error('Please review the errors and try again');
        }
      });
    },
    finishLater() {
      this.finish = true;
      this.formData.eventType = this.eventType;
      this.saveStorage(this.formData);
      setTimeout(() => {
        this.$message.success('your event is saved for later');
        this.finish = false;
      }, 500);
    },
    updateForm(inputData, value) {
      if (this.isEdit === false) {
        if (inputData === 'customName') {
          this.formData[inputData] = value.toLowerCase();
        } else this.formData[inputData] = value;
        let storedForm = this.openStorage();
        if (!storedForm) storedForm = {};
        storedForm[inputData] = value;
        this.saveStorage(storedForm);
      }
    },
    openStorage() {
      return JSON.parse(localStorage.getItem('formData'));
    },
    saveStorage(formData) {
      localStorage.setItem('formData', JSON.stringify(formData));
    },
    disableUploads(event) {
      event.preventDefault();
    },
    selectEventTiming(val) {
      if (val !== 'once' && this.freePlan) {
        this.openProBanner();
        return;
      }
      this.formData.frequency = val;
      if (val === 'once') {
        this.formData.repeats = 0;
        this.validReoccurence = true;
      }
    },
    openProBanner() {
      if (!this.isPhone) {
        this.openTixProBanner = true;
      } else {
        this.openMobileBannerView = true;
      }
    },
    isActive(val) {
      return (val === 'once' && this.formData.frequency === 'once') || (val !== 'once' && this.formData.frequency !== 'once');
    },
    isDisabled() {
      return this.formData.title
       && this.formData.description
       && this.formData.startDate
       && this.formData.endDate
       && this.formData.headerImage
       && this.validateAddressForOnlineEvent
       && this.formData.interest
       && this.validReoccurence;
    },
  },
  computed: {
    hasOrders() {
      if (this.edit) {
        if (this.formData.attendeesEmails && this.formData.attendeesEmails.length > 0) return true;
      } return false;
    },
    validateAddressForOnlineEvent() {
      if (this.eventType === 'live') {
        return this.formData.address;
      }
      return true;
    },
    meetingLink() {
      if (this.isEdit && this.formData.eventType === 'online') return true;
      return false;
    },
    viewRecurringEvents() {
      return this.formData.frequency !== 'once' && !this.freePlan;
    },
  },
  created() {
    const storedForm = this.openStorage();
    if (this.isEdit === false && storedForm) {
      Object.keys(storedForm).forEach((key) => {
        this.formData[key] = storedForm[key];
      });
    }
    if (this.eventType === 'online') this.formData.address = '';
    if (this.formData.externalMeeting === null) {
      this.formData.externalMeeting = this.externalMeeting;
    }
  },
};
</script>

<style lang="scss">
  h4 {
    letter-spacing: 0;
    line-height: 1;
  }
  .el-select {
    width: 100%;
  }
  .el-form-item__error {
    margin-bottom: 10px;
  }
</style>

<style lang="scss" scoped>
  .event__form--section {
    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 2.3rem;
        @media screen and (max-width: 992px) {
          width: max-content;
          padding-bottom: 0.5em;
          margin-bottom: 1.25em;
          border-bottom: 1px solid $--color-green;
      }
    }
    &__content {
      .el-form-item {
        margin-bottom: 1.3rem;
      }
      .first--child {
        margin-bottom: 2rem;
      }

      &--text {
        font-weight: 300;
        font-size: 14px;
        margin-bottom: 1.5rem;
      }
    }
    &__timing {
      margin-bottom: 2rem;

      .el-button.active {
        color: #FC6435;
        border-color: #fed1c2;
        background-color: #fff0eb;
      }
    }
  }
  .buttons {
    padding-bottom: 3rem;
    display: flex;
    @media screen and (max-width: 350px) {
      :nth-child(2) {
        margin-left: 0px;
      }
      :nth-child(3) {
        margin-left: 0px;
      }
    }
    @media screen and (max-width: 768px){
      padding-bottom: 6rem;
    }
  }
  .u-button {
    margin-right: 1.6rem;
    &-large {
      width: 11rem;
    }
  }
  .horizontal--line {
    height: 1px;
    margin-top: 0.2rem;
    width: 65%;
    background-color: $--color-green;
      @media screen and (max-width: 992px) {
        display: none;
      }
  }
  .last--section {
    padding-top: 1.3rem;
    padding-bottom: 1.8rem;
  }
  .error {
    color: #f56c6c;
  }
</style>
