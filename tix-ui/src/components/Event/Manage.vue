<template>
  <div class="default-about-view">
    <div class="details">
      <div class="image">
        <img :src="headerImage" :alt="title">
      </div>
      <div class="default-about-view__body">
        <div class="header">
          <h2>{{ title }}</h2>
        </div>
        <div class="description" v-html="description" />
        <div class="info__body">
          <div class="first-col">
          <div class="info-group">
            <div class="info">
              <div class="info__icon calender">
                <img src="@/assets/date.svg" alt="calendar icon">
              </div>
              <div class="info__details">
                <p class="info__label">event starts on</p>
                <p class="info__text">{{ startTime }}</p>
              </div>
            </div>
            <div class="info">
              <div class="info__icon calender">
                <img src="@/assets/date.svg" alt="calendar icon">
              </div>
              <div class="info__details">
                <p class="info__label">event ends on</p>
                <p class="info__text">{{ endTime }}</p>
              </div>
            </div>
            <div>
              <div v-if="website" class="info">
                <div class="info__icon">
                  <img src="@/assets/website.svg" alt="website icon">
                </div>
                <div class="info__details">
                  <p class="info__label">website</p>
                  <p class="info__text">
                    <a target="_blank" :href="formatWebsite">
                      https://{{ website | truncate(20) }}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="info-group">
            <div v-if="twitter" class="info">
              <div class="info__icon">
                <img src="@/assets/twitter.svg" alt="twitter icon">
              </div>
              <div class="info__details">
                <p class="info__label">twitter</p>
                <p class="info__text">
                  <a target="_blank" :href="formatTwitter">
                    https://twitter.com/{{ truncateSocialHandles(this.twitter) }}
                  </a>
                </p>
              </div>
            </div>
            <div v-if="instagram" class="info">
              <div class="info__icon">
                <img src="@/assets/instagram.svg" alt="instagram icon">
              </div>
              <div class="info__details">
                <p class="info__label">instagram</p>
                <p class="info__text">
                  <a target="_blank" :href="formatInstagram">
                    https://instagram.com/{{ truncateSocialHandles(this.instagram) }}
                  </a>
                </p>
              </div>
            </div>
            <div>
              <div v-if="facebook"  class="info">
                <div class="info__icon">
                  <img src="@/assets/facebook.svg" alt="facebook icon">
                </div>
                <div class="info__details">
                  <p class="info__label">facebook</p>
                  <p class="info__text">
                    <a target="_blank" :href="formatFacebook">
                      https://facebook.com/{{ truncateSocialHandles(this.facebook) }}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
          </div>
          <div class="info-group third-col">
            <div v-if="lng || lat" class="info">
              <div class="info__icon location--icon">
                <img src="@/assets/location.svg" alt="instagram icon">
              </div>
              <div class="info__details">
                <p class="info__label">location of event</p>
                <p class="info__text">
                  <a target="_blank" :href="`https://www.google.com/maps/?q=${lat},${lng}`">
                     {{ address | truncate(22) }}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="edit">
          <button class="u-button u-button--green" @click="editTicketConfirmationDialogVisible = true">
            edit ticket email
          </button>
          <button class="u-button" @click="$emit('edit')">
            edit event
          </button>
          <div v-show="internalMeeting">
            <button class="u-button u-button--black is-web" :class="{'u-button--disabled grey': past}" :disabled="past" @click="startZoomEvent()">
              start event
            </button>
        </div>
        </div>
        <div v-show="internalMeeting">
          <button class="u-button u-button--black is-mobile" :class="{'u-button--disabled grey': past}" :disabled="past" @click="startZoomEvent()">
            start event
          </button>
        </div>
      </div>
    </div>
    <el-dialog title="customize ticket email" width="600px" :visible.sync="editTicketConfirmationDialogVisible" :close-on-click-modal="false">
      <edit-ticket-confirmation-form
        @hook:mounted="updatesuccessMessage()"
        :event="Object.assign({}, $props)"
        :processing="processingTicketConfirmation"
        @save="updateTicketConfirmationEmail"
        :reset="editTicketConfirmationDialogVisible"
        @saveTest="updatesuccessMessage('your test email has been sent')" />
    </el-dialog>
  </div>
</template>

<script>
import EDIT_EVENT from '@/graphql/EditEvent.gql';
import EDIT_TICKET_EMAIL from '@/graphql/EditTicketEmail.gql';
import { Dialog } from 'element-ui';
import { isValidURL, isValidHttpURL } from '@/helpers/utility';
import EditTicketConfirmationForm from '@/components/Ticket/EditConfirmationForm';
import EventForm from '@/components/Event/Form';
import ErrorHandler from '@/helpers/error-handler';
import moment from 'moment';

export default {
  name: 'event-details-admin',
  props: {
    id: String,
    slug: String,
    status: String,
    title: String,
    description: String,
    customName: String,
    address: String,
    addressTips: String,
    lng: [Number, String],
    lat: [Number, String],
    startDate: [Number, String],
    endDate: [Number, String],
    frequency: String,
    repeats: Number,
    twitter: String,
    instagram: String,
    facebook: String,
    website: String,
    headerImage: String,
    user: Object,
    ticket: Array,
    customTicketMessage: String,
    eventType: String,
    interest: Object,
    externalMeeting: Object,
    internalMeeting: Object,
  },
  components: {
    EditTicketConfirmationForm,
    EventForm,
    ElDialog: Dialog,
  },
  data() {
    return {
      reset: false,
      editEventDialogVisible: false,
      processing: false,
      processingTicketConfirmation: false,
      editTicketConfirmationDialogVisible: false,
      successMsg: '',
    };
  },
  computed: {
    upcoming() {
      return moment.unix(this.startDate).isAfter(moment());
    },
    past() {
      return moment.unix(this.endDate).isBefore(moment());
    },
    startTime() {
      const formatteddate = this.formatDate(this.startDate);
      return formatteddate.format('ddd MMM D YYYY, h:mm a');
    },
    endTime() {
      const formatteddate = this.formatDate(this.endDate);
      return formatteddate.format('ddd MMM D YYYY, h:mm a');
    },
    isDisabled() {
      if (this.upcoming || this.past) {
        return true;
      }
      return false;
    },
    linksAvailable() {
      const { website, twitter, instagram, facebook, lng, lat } = this;
      return website || twitter || instagram || facebook || lng || lat;
    },
    formatWebsite() {
      return isValidHttpURL(this.website);
    },
    formatFacebook() {
      return isValidURL('fb', this.facebook);
    },
    formatInstagram() {
      return isValidURL('in', this.instagram);
    },
    formatTwitter() {
      return isValidURL('tw', this.twitter);
    },
    startZoomEvent() {
      const { startUrl } = this.internalMeeting;
      return window.open(`${startUrl}`, '_blank');
    },
  },
  methods: {
    updatesuccessMessage(msg = 'your message has been updated') {
      this.successMsg = msg;
    },
    update(variables) {
      this.processing = true;
      this.$apollo.mutate({
        mutation: EDIT_EVENT,
        variables,
      }).then(() => {
        this.processing = false;
        this.editEventDialogVisible = false;
        this.$message.success('Event Updated');
      }).catch((error) => {
        this.processing = false;
        ErrorHandler.throwGraphQLError(error);
      });
    },
    updateTicketConfirmationEmail({ id, message: customTicketMessage, testCC, testEmail }) {
      this.processingTicketConfirmation = !testEmail;
      this.$apollo.mutate({
        mutation: EDIT_TICKET_EMAIL,
        variables: {
          id,
          customTicketMessage,
          testCC,
          testEmail,
        },
      }).then(() => {
        this.processingTicketConfirmation = false;
        this.editTicketConfirmationDialogVisible = false;
        this.$message.success(this.successMsg);
        this.updatesuccessMessage();
      }).catch((error) => {
        this.processingTicketConfirmation = false;
        ErrorHandler.throwGraphQLError(error);
      });
    },
    formatDate(date) {
      const getDate = moment.unix(date).utc();
      return getDate;
    },
    truncateSocialHandles(handle) {
      const truncatedHandle = handle.split('', 12).join('');
      return (handle.split('').length > 12) ? `${truncatedHandle}...` : `${truncatedHandle}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.default-about-view {
  margin-top: 1.8rem;
  border-radius: 9px;
  background-color: rgba($color: $--color-green, $alpha: 0.05);
  &__body {
    padding: 2rem 3.8rem 4rem;
    @media screen and (max-width: 350px) {
      padding: 2rem 2rem 4rem;
    }
  }
}
.details {
  .image {
    width: 100%;
    border: solid 1px rgba($color: #000000, $alpha: 0.05);
    border-bottom: 0;
    max-height: 35rem;
    border-radius: 5px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    overflow: hidden;
    position: relative;
    img {
      width: 100%;
      float: left;
    }
  }
  .header {
    padding-bottom: 1.6rem;
  }
  .description {
    padding-bottom: 3rem;
    font-size: 1.8rem;
    opacity: 0.7;
    @media screen and (max-width: 600px) {
      font-size: 1.4rem;
    }
  }
  .info {
    margin-top: 1.7rem;
    display: flex;
    width: max-content;
    align-items: flex-start;
    &__icon {
      width: 3rem;
    }
    &__body {
      display: flex;
      justify-content: space-between;
      width: 100%;
      @media screen and (max-width: 1200px) {
        flex-direction: column;
      }
    }
    &-group {
      @media screen and (min-width: 960px) {
        display: flex;
        flex-direction: column;
      }
    }
    &__label {
      opacity: 0.3;
      text-transform: lowercase;
      line-height: 1;
      font-weight: normal;
      font-size: 1.4rem;
      margin: 0 0 0.8rem;
    }
    &__text {
      margin: 0;
      opacity: 0.7;
      text-transform: lowercase;
      font-weight: normal;
      font-size: 1.4rem;
    }
  }
  .u-button {
    width: 14.9rem;
    margin-left: 0;
    margin-right: 1.7rem;
    &--green {
      background: $--color-green;
      &:hover, &:focus {
        opacity: 0.8;
      }
    }
    &--meeting-link {
      width: 13rem;
    }
    &--black {
      background: $--color-black;
    }
    @media screen and (max-width: 400px) {
      margin-right: 0;
      width: 12rem;
    }
    @media screen
    and (min-width: 401px)
    and (max-width: 600px)
    {
      margin-right: 2rem;
      width: 13rem;
    }

    @media screen and (max-width: 769px) {
      margin-bottom: 2rem;
    }
  }
  .edit {
    margin-top: 4rem;
    display: flex;
    @media screen and (max-width: 580px) {
      justify-content: space-between;
    }
  }
  .calender {
    filter: invert(29%) sepia(43%) saturate(3820%) hue-rotate(166deg) brightness(94%) contrast(98%);
  }
  .maps-link {
    font-size: 1.3rem;
    color: $color-orange;
  }
}
.third-col {
  width: 25%;
}
.location--icon {
  filter: invert(62%) sepia(54%) saturate(429%) hue-rotate(81deg) brightness(96%) contrast(89%);
}
.first-col {
  width: 70%;
  display: flex;
  justify-content: space-between;
  @media screen and (min-width: 600px) and (max-width: 1200px) {
    width: 100%;
  }
  @media screen and (max-width: 600px) {
    flex-direction: column;
  }
}
.is-web {
  @media screen and (max-width: 499px) {
    display: none;
  }
}
.is-mobile {
  @media screen and (min-width: 500px) {
    display: none;
  }
}
.grey {
  opacity: 0.4;
}
</style>
