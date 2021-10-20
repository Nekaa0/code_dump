<template>
  <section>
    <div class="event-status" >
      <div class="event-status__body" v-if="userIsVerified || !userHasAPaidEvent">
        <div class="event-status__body__toggle" v-if="createdTickets && !isPast">
          <!-- <el-switch v-if="!createdTickets || isPast" :width="30" :disabled="true"></el-switch> -->
          <el-switch v-model="published" active-color="#FC6435" :width="30" @change="toggleStatus"></el-switch>
        </div>
        <div class="event-status__body__info">
          <div v-if="isPast">
            this event ended {{ relativeEndDate }}. to republish it,
            <span v-if="hasOrders">create a <a class="new-event" @click="createEvent">new event</a></span>
            <span v-else>update the <a class="new-event" @click="$emit('updateEvent')">event date</a></span>
          </div>
          <div v-else-if="!published">
            <div class="event-status__body__dropdown">
              <div class="event-status__body__dropdown--text">
                <p v-if="!(createdTickets && hasMeeting)">things to do before you can make your event live</p>
                <div v-if="showList">
                  <alert
                    v-for="option in alerts"
                    :key="option.id"
                    :showIcon="false" 
                    :title="option.title"
                    :action="option.actionText"
                    :actionPosition="option.actionPosition"
                    @clicked="option.clicked"
                    :show="option.show"
                  />
                </div>
                <div v-if="!userIsVerified">
                   <alert 
                    :showIcon="false" 
                    title="almost there! please add payment details so we know where to pay you" 
                    action="add payment details" 
                    @clicked="profileCompleteDialogVisible = true" 
                    v-if="verifyMobileNumber === false" 
                   />
                  <alert 
                    :showIcon="false" 
                    title="almost there! verify phone number"
                    :action="'add otp code'" 
                    @clicked="verifyNumberDialogVisible = true" 
                    v-if="verifyMobileNumber === true" 
                  />
                </div>
              </div>
              <div class="dropdown" @click="showList = !showList">
                <img src="../../assets/chevron-right.svg" alt="chevron-right" :class="{'rotate': showList }">
              </div>
            </div>
          </div>
          <div v-else>
            <span class="event-status__body__label">published</span>
            <div class="event-status__body__share">
              <a :href="url" target="_blank">
                <i class="el-icon-back u-rotate--top-right"></i>
              </a>
              <a class="copy" :aria-label="url">copy link</a>
              <a :href="twitterUrl" target="_blank">
                <el-tooltip content="tweet" placement="top">
                  <img class="social" src="../../assets/twitter.svg" alt="Tweet" />
                </el-tooltip>
              </a>
              <a :href="facebookUrl" target="_blank">
                <el-tooltip content="post to facebook" placement="top">
                  <img class="social" src="../../assets/facebook.svg" alt="Facebook" />
                </el-tooltip>
              </a>
            </div>
          </div>
      </div>
      </div>
      <div class="verify" v-else>
        <alert :showIcon="false" title="almost there! please add payment details so we know where to pay you"
        :action="'add payment details'" @clicked="profileCompleteDialogVisible = true" v-if="verifyMobileNumber === false" />

        <alert :showIcon="false" title="almost there! verify phone number"
        :action="'add otp code'" @clicked="verifyNumberDialogVisible = true" v-if="verifyMobileNumber === true" />
      </div>
    </div>
    <el-dialog title="add payment details" width="500px" :visible.sync="profileCompleteDialogVisible" :append-to-body="true" :show-close="false">
      <user-verification @complete="onVerificationComplete" @mobile="onMobileAccount" v-if="accountType === 'personal'" @back="closeDialog"/>
      <organization-verification @complete="onOrgVerificationComplete" mobile="onMobileAccount" v-if="accountType === 'organization'" @back="closeDialog" />
    </el-dialog>
    <el-dialog title="verify phone number" width="500px" :visible.sync="verifyNumberDialogVisible" :append-to-body="true" :show-close="false" @mobile="onMobileAccount">
      <verify-number @verified="onNumberVerified" @resend="resendCode" />
    </el-dialog>
  </section>
</template>

<script>
import moment from 'moment';
import * as Clipboard from 'clipboard';
import { Switch, Dialog, Tooltip } from 'element-ui';
import Alert from '@/components/Global/Alert';
import TOGGLE_STATUS from '@/graphql/ToggleStatus.gql';
import FETCH_CURRENT_USER from '@/graphql/FetchCurrentUser.gql';
import UserVerification from '@/components/User/Verification/Index';
import VerifyNumber from '@/components/Global/VerifyNumber';
import OrganizationVerification from '@/components/Organization/VerificationForm';
import ErrorHandler from '@/helpers/error-handler';
import IsPhone from '@/mixins/IsPhone';

export default {
  name: 'event-status',
  mixins: [IsPhone],
  components: {
    ElSwitch: Switch,
    ElDialog: Dialog,
    ElTooltip: Tooltip,
    Alert,
    UserVerification,
    OrganizationVerification,
    VerifyNumber,
  },
  props: {
    id: String,
    slug: String,
    customName: String,
    title: String,
    status: String,
    twitter: String,
    startDate: [Number, String],
    endDate: [Number, String],
    createdTickets: Number,
    hasMeeting: Boolean,
    attendeesEmails: Array,
  },
  data() {
    return {
      currentUser: {},
      profileCompleteDialogVisible: false,
      verifyNumberDialogVisible: false,
      verifyMobileNumber: false,
      published: null,
      clipboard: null,
      showList: false,
      alerts: [
        {
          id: 1,
          title: 'so that people can join this event virtually',
          actionText: 'add online event link',
          actionPosition: 'left',
          clicked: () => {
            this.addMeeting();
          },
          show: !this.hasMeeting,
        },
        {
          id: 2,
          title: 'for your event and then you can publish it.',
          actionText: 'create some tickets',
          actionPosition: 'left',
          clicked: () => {
            this.createTicket();
          },
          show: !this.createdTickets,
        },
        {
          id: 3,
          title: 'use the toggle to publish your event',
          clicked: () => {
            this.createTicket();
          },
          show: (this.createdTickets > 0) && (this.hasMeeting),
        },
      ],
    };
  },
  apollo: {
    currentUser: {
      query: FETCH_CURRENT_USER,
      update: data => data.currentUser,
      fetchPolicy: 'network-only',
    },
  },
  watch: {
    status() {
      this.setPublished();
      this.setupClipboard();
    },
    isPhone(val) {
      if (!val) {
        this.showList = true;
      }
    },
  },
  created() {
    this.setPublished();
    this.setupClipboard();
  },
  methods: {
    createEvent() {
      this.$emit('createEvent');
    },
    addMeeting() {
      this.$emit('addMeeting');
    },
    createTicket() {
      this.$emit('createTicket');
    },
    closeDialog() {
      this.profileCompleteDialogVisible = false;
    },
    resendCode() {
      this.verifyMobileNumber = false;
      this.profileCompleteDialogVisible = true;
    },
    setPublished() {
      this.published = this.status === 'active';
    },
    setupClipboard() {
      if (!this.published) {
        if (!this.clipboard) return;
        this.clipboard.destroy();
      } else {
        this.clipboard = new Clipboard('.copy', {
          text(trigger) {
            return trigger.getAttribute('aria-label');
          },
        });
        this.clipboard.on('success', () => {
          this.$message.success('link copied');
        });
      }
    },
    toggleStatus() {
      this.$apollo.mutate({
        mutation: TOGGLE_STATUS,
        variables: {
          toggleable: this.id,
          status: this.published ? 'active' : 'inactive',
        },
      }).then(() => {
        this.$emit('update', this.published);
        this.$message.success('updated event');
      }).catch((error) => {
        this.published = false;
        ErrorHandler.throwGraphQLError(error);
      });
    },
    onVerificationComplete() {
      this.$apollo.queries.currentUser.refetch();
      this.profileCompleteDialogVisible = false;
      this.$emit('verificationCompleted');
    },
    onOrgVerificationComplete() {
      this.profileCompleteDialogVisible = false;
      this.$apollo.queries.currentUser.refetch();
    },
    onNumberVerified() {
      this.verifyNumberDialogVisible = false;
      this.$apollo.queries.currentUser.refetch();
    },
    onMobileAccount() {
      this.verifyNumberDialogVisible = true;
      this.verifyMobileNumber = true;
    },
  },
  computed: {
    isPast() {
      return moment.unix(this.endDate).isBefore(moment());
    },
    relativeEndDate() {
      return moment.unix(this.endDate).fromNow();
    },
    hasOrders() {
      return this.attendeesEmails.length > 0;
    },
    url() {
      return this.customName
        ? `${window.location.origin}/${this.customName}`
        : `${window.location.origin}/buy/${this.slug}`;
    },
    shareCopy() {
      return `Buy tickets to ${this.title} on Tix`;
    },
    twitterUrl() {
      let url = `https://twitter.com/intent/tweet?url=${this.url}&text=${this.shareCopy}`;
      if (this.twitter) url += `&via=${this.twitter}`;
      return url;
    },
    facebookUrl() {
      return `https://www.facebook.com/sharer.php?u=${this.url}`;
    },
    userHasAPaidEvent() {
      return (
        this.currentUser.events &&
        this.currentUser.events.edges.some(value => value.node.hasAPaidTicket)
      );
    },
    userIsVerified() {
      return this.currentUser.verified;
    },
    accountType() {
      return this.currentUser.accountType;
    },
  },
};
</script>

<style lang="scss" scoped>
  section {
    @media screen and (max-width: 767px) {
      background: white;
    }
  }
  a.new-event {
    color: $color-orange;
    padding: 0px !important;
    margin-left: 2.5px;
  }
  .event-status {
    padding: 2.3rem;
    font-size: 0.875em;
    border: 1px dashed $--color-green;
    border-radius: 4px;
    @media screen and (max-width: 767px){
      padding: 1.3rem;
    }
    &__body {
      display: flex;
      align-items: flex-end;
      line-height: 1;
      @media screen and (max-width: 767px){
        align-items: flex-start;
      }
      &__toggle {
        margin-right: 10px;
      }
      &__share {
        float: right;
      }
      &__dropdown {
        display: flex;

        &--text {
          width: 100%;
          @media screen and (max-width: 600px){
            width: 95%;
          }
        }
        .dropdown {
          display: none;
          @media screen and (max-width: 600px){
            display: block;
            height: 24px;
            width: 5%;

            img {
              height: 100%;
            }

            img.rotate {
              transform: rotate(90deg);
            }
          }
        }
      }
      &__info {
        flex: 1;
        a {
          padding: 10px;
        }
        img {
          height: 15px;
          vertical-align: middle;
        }
        p {
          font-weight: 300;
          font-size: 14px;

          span {
            color: $color-orange;
            font-weight: normal;
            cursor: pointer;
          }
        }
        p:not(:last-child) {
          margin-bottom: 1rem;
        }

        @media screen and (max-width: 600px){
          p {
            font-size: 14px;
          }
        }
      }
    }
  }
  .social {
    &:hover {
      filter: invert(68%) sepia(43%) saturate(7284%) hue-rotate(337deg) brightness(98%) contrast(102%);
    }
  }
  .verify {
    padding: 0;
    width: 100%;
  }
</style>
