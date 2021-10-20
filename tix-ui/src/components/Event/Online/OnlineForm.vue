<template>
  <section class="online--form">
    <el-form :rules="rules" ref="onlineEventForm" v-if="eventType === 'online'">
      <div class="online--form__content">
        <el-tooltip placement="top">
          <div slot="content">
            learn more about the different types of event links here
          </div>
        </el-tooltip>
        <el-form-item label="how will people join this event online ?" prop="meetingType">
          <select
            v-model="selected"
            class="online--form__input"
          >
            <option
              v-for="(item,index) in meetingTypes"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
              {{ item.label }}
            </option>
          </select>
        </el-form-item>
        <el-form-item label="add the event link" v-if="selected === '3rdPartyMeetingLink'">
          <el-input type="textarea" :autosize="{ minRows: 5}"
            :placeholder="placeholder"
            v-model="link">
          </el-input>
        </el-form-item>
        <el-form-item label="zoom event link" v-if="selected === 'meetingLink'">
          <el-input v-model="zoomLink" placeholder="zoom meeting link" disabled>
          </el-input>
        </el-form-item>
        <div class="note" v-if="showWarning">
          <p>
            <span>please note </span>that these details can be changed even after an event has been published.
            if you make any changes we advise you let attendees know by <a @click="emailAttendees()">sending an email</a>.
          </p>
        </div>
        <connect-zoom v-if="selected === 'zoomAccount'" />
      </div>
      <div class="online--form__btn">
        <el-button type="primary" @click.prevent="save" :loading="processing" :disabled="disabled()">
          <span>{{buttonText}}</span>
        </el-button>
        <el-button class="black-button" v-if="showStartButton" :disabled="past" @click="startZoomEvent()">
          <span>start event</span>
        </el-button>
      </div>
    </el-form>
    <div class="not-online" v-else>
      <span>managing online events is only available for virtual events learn more about online events </span>
      <a :href="blog" target="__blank"> here</a>
    </div>
    <tix-pro-banner
      :header="tixProBannerHeader"
      :buttonText="tixProBannerButtonText"
      :openTixProBanner="openTixProBanner"
      :openMobileBannerView="openMobileBannerView"
      :isPhone="isPhone"
      @back="openMobileBannerView = false"
      @closeBanner="openTixProBanner = false"
    />
  </section>
</template>

<script>
import moment from 'moment';
import { Tooltip } from 'element-ui';
import IsPhone from '@/mixins/IsPhone';
import SubscriptionPlan from '@/mixins/SubscriptionPlan';
import CREATE_EXTERNAL_MEETING from '@/graphql/CreateExternalMeeting.gql';
import ErrorHandler from '@/helpers/error-handler';
import GENERATE_ZOOM_MEETING from '@/graphql/CreateInternalMeeting.gql';
import ConnectZoom from '@/components/Event/Online/ConnectZoom';
import TixProBanner from '@/components/Global/TixPro/Banner/Index';

export default {
  mixins: [IsPhone, SubscriptionPlan],
  props: {
    id: String,
    slug: String,
    eventType: String,
    onlineEventType: String,
    externalMeeting: Object,
    internalMeeting: Object,
    endDate: [String, Number],
  },
  components: {
    ConnectZoom,
    ElTooltip: Tooltip,
    TixProBanner,
  },
  mounted() {
    switch (this.onlineEventType) {
      case 'external':
        this.selected = '3rdPartyMeetingLink';
        this.link = this.externalMeeting.link;
        break;
      case 'internal':
        this.selected = 'meetingLink';
        this.zoomLink = this.internalMeeting.joinUrl;
        break;
      case 'custom':
        this.selected = 'zoomAccount';
        break;
      default:
        break;
    }
    if (this.internalMeeting) {
      this.zoomLink = this.internalMeeting.joinUrl;
    }
  },
  data() {
    return {
      meetingTypes: [
        {
          label: 'connect my zoom account',
          value: 'zoomAccount',
        },
        {
          label: 'manually add an event link',
          value: '3rdPartyMeetingLink',
        },
        {
          label: 'generate a zoom link with tix',
          value: 'meetingLink',
        },
      ],
      rules: {
        meetingType: [
          { required: true, trigger: 'blur', message: 'please enter a name for your ticket' },
        ],
      },
      selected: '',
      link: '',
      zoomLink: '',
      processing: false,
      blog: 'https://intercom.help/tixafrica/en/articles/4450377-how-to-create-an-online-event',
      placeholder: `add the event link to an external service here\n\nensure meeting passwords are included, this information will be sent to all attendees after successful registration and/or payment
      \nif you prefer to share this information with attendees later, you can add a note here to let attendees to know they will receive the link later`,
      openTixProBanner: false,
      openMobileBannerView: false,
      tixProBannerHeader: 'upgrade to connect your zoom account',
      tixProBannerButtonText: 'upgrade to connect your zoom account',
    };
  },
  computed: {
    past() {
      return moment.unix(this.endDate).isBefore(moment());
    },
    showWarning() {
      return (this.selected === 'meetingLink' || this.selected === '3rdPartyMeetingLink') && (this.zoomLink !== '' || this.link !== '');
    },
    showProBanner() {
      return this.freePlan && this.selected === 'zoomAccount';
    },
    showStartButton() {
      return this.internalMeeting || this.externalMeeting;
    },
    buttonText() {
      let text = 'save';
      switch (this.selected) {
        case 'zoomAccount':
          if (this.onlineEventType === 'custom') {
            text = 'connected to zoom';
          } else text = 'connect to zoom';
          break;
        case '3rdPartyMeetingLink':
          if (this.externalMeeting && this.link === this.externalMeeting.link) {
            text = 'saved';
          } else text = 'save';
          break;
        case 'meetingLink':
          if (this.onlineEventType === 'internal') {
            text = 'generated';
          } else text = 'generate';
          break;
        default:
          break;
      }
      return text;
    },
  },
  methods: {
    disabled() {
      if (this.onlineEventType === 'custom' && this.selected === 'zoomAccount') return true;
      if (this.selected === '3rdPartyMeetingLink' && this.link === '') return true;
      if (this.onlineEventType === 'external' && this.selected === '3rdPartyMeetingLink' && this.link === this.externalMeeting.link) return true;
      if (this.onlineEventType === 'internal' && this.selected === 'meetingLink') return true;
      return this.selected === '';
    },
    emailAttendees() {
      this.$emit('emailAttendees');
    },
    openProBanner() {
      if (!this.isPhone) {
        this.openTixProBanner = true;
      } else {
        this.openMobileBannerView = true;
      }
    },
    startZoomEvent() {
      if (this.onlineEventType === 'external') {
        const { link } = this.externalMeeting;
        return window.open(`${link}`, '_blank');
      }
      const { startUrl } = this.internalMeeting;
      return window.open(`${startUrl}`, '_blank');
    },
    save() {
      if (this.showProBanner) {
        this.openProBanner();
        return;
      }
      this.processing = true;
      switch (this.selected) {
        case 'zoomAccount':
          this.connectZoom();
          break;
        case '3rdPartyMeetingLink':
          this.addLink();
          break;
        case 'meetingLink':
          this.generateLink();
          break;
        default:
          break;
      }
    },
    addLink() {
      this.$apollo.mutate({
        mutation: CREATE_EXTERNAL_MEETING,
        variables: { event: this.id, link: this.link },
      }).then(() => {
        this.processing = false;
        this.$message.success('meeting link was successfully created');
        location.reload();
      }).catch((error) => {
        this.processing = false;
        ErrorHandler.throwGraphQLError(error);
      });
    },
    generateLink() {
      this.$apollo.mutate({
        mutation: GENERATE_ZOOM_MEETING,
        variables: { eventSlug: this.slug },
      }).then(({ data }) => {
        this.processing = false;
        this.$message.success('your zoom meeting link has been successfully created');
        location.reload();
        this.zoomLink = data.createInternalMeeting.joinUrl;
      }).catch((error) => {
        this.processing = false;
        ErrorHandler.throwGraphQLError(error);
      });
    },
    connectZoom() {
      const clientId = process.env.ZOOM_CLIENT_ID;
      const redirectUrl = process.env.ZOOM_REDIRECT_URL;
      const url = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}&state=${this.slug}`;
      this.processing = false;
      window.open(url, '_blank');
    },
  },
};
</script>

<style lang="scss" scoped>
.online--form {
  padding: 2.3rem 5% 2.5rem;
  &__input {
    padding: 1rem;
    width: 100%;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    color: $color-black;
    -moz-appearance: none;
    -webkit-appearance: none;
    background-repeat: no-repeat, repeat;
    background-position: right 1rem top 50%, 0 0;
    background-size: 1rem auto, 100%;
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg width='8' height='6' viewBox='0 0 8 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M7.06667 0.733307L8 1.66664L4 5.66664L-4.07973e-08 1.66664L0.933333 0.733307L4 3.79997L7.06667 0.733307Z' fill='%23333333'/%3E%3C/svg%3E%0A");
  }
  .note {
    margin-top: 2rem;
    margin-bottom: 3rem;
    font-weight: normal;
    background-color: #F2F9FA;
    padding: 1.25rem;
    border-radius: 4px;

    p {
      font-size: 12px;
      line-height: 24px;
      font-weight: 300;
    }
    span {
      font-weight: 400;
    }
  }
  &__input:focus {
    outline: none;
  }
  &__content {
    min-height: 350px;
  }
  &__btn {
    display: flex;
    .el-button {
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .black-button {
      background-color: black;
      color: white;
    }
    .black-button.is-disabled {
      background-color: rgba(black, 0.6);
    }
  }
}
.not-online {
  height: 350px;
  font-weight: 300;
  font-size: 12px;
  line-height: 4rem;
  a {
    color: $color-orange;
  }
}
</style>
