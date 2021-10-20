<template>
  <div>
    <navigation></navigation>
    <main>
      <div class="join-method">
        <div>
          <create-event-header icon="video.svg" title="how will people join this event?" />
        </div>
        <div class="online-event-body__header">
          <form-header subtitle="meeting link" />
          <div class="horizontal--line">
          </div>
        </div>
        <div v-if="currentPage === ''">
          <asterisk title="add a virtual location to your event"/>
          <div class="join-method__types">
            <div class="meeting--link">
              <button class="join-method__types-button u-button u-button--disabled" :class="{'u-button--disabled': true}" @click="selectMeetingType('zoomAccount')">
                <div>
                  <img class="inactive" src="@/assets/full-blue-video.svg" alt="zoom icon">
                  <span>connect your zoom account</span>
                </div>
              </button>
              <p>coming soon</p>
            </div>
            <div class="meeting--link">
              <button class="join-method__types-button u-button u-button--grey"  @click="selectMeetingType('meetingLink')">
                <div>
                  <img src="@/assets/clip.svg" alt="paperclip icon">
                  <span>generate a zoom meeting link</span>
                </div>
              </button>
            </div>
            <div class="meeting--link">
              <button class="join-method__types-button u-button u-button--grey"  @click="selectMeetingType('3rdPartyMeetingLink')">
                <div>
                  <img class="join-method__types-button-svg" src="@/assets/clip.svg" alt="paperclip icon">
                  <span>add a 3rd party meeting link</span>
                </div>
              </button>
            </div>
          </div>
          <div class="next">
            <button class="u-button u-button--grey" @click="$router.go(-1)">back</button>
            <button class="u-button" @click="next">next</button>
          </div>
        </div>
        <div v-else-if="currentPage === 'zoomAccount'" >
          <zoom-account :slug="slug" :eventId="eventId" :goToPreviousPage="goToPreviousPage"/>
        </div>
        <div v-else-if="currentPage === 'meetingLink'" >
          <meeting-link :slug="slug" :eventId="eventId" :goToPreviousPage="goToPreviousPage"/>
        </div>
        <div v-else-if="currentPage === '3rdPartyMeetingLink'" >
          <external-link :slug="slug" :eventId="eventId" :goToPreviousPage="goToPreviousPage"/>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import CreateEventHeader from '@/components/Event/CreateEventHeader';
import FormHeader from '@/components/Global/FormHeader';
import ZoomAccount from '@/components/Event/Online/ZoomAccount';
import MeetingLink from '@/components/Event/Online/MeetingLink';
import ExternalLink from '@/components/Event/Online/ExternalLink';
import Asterisk from '@/components/Global/Asterisk';

export default {
  name: 'join-event',
  components: {
    CreateEventHeader,
    FormHeader,
    ZoomAccount,
    MeetingLink,
    ExternalLink,
    Asterisk,
  },
  data() {
    return {
      currentPage: '',
      selected: '',
      eventId: undefined,
      slug: undefined,
    };
  },
  methods: {
    selectMeetingType(meetingType) {
      if (this.selected === meetingType) {
        this.selected = '';
      } else {
        this.selected = meetingType;
      }
    },
    next() {
      this.currentPage = this.selected;
    },
    goToPreviousPage() {
      this.currentPage = '';
    },
  },
  created() {
    if (this.eventId === undefined) {
      this.eventId = this.$route.params.eventId;
      this.slug = this.$route.params.slug;
    }
  },
};
</script>

<style lang="scss" scoped>
  .join-method {
    max-width: 70rem;
    margin: 4% auto;
    margin-left: 20.5%;
    @media screen and (max-width: 969px) {
      width: 80%;
      margin: 4% auto;
    }
    &__types {
      padding-top: 3.3rem;
      &-button {
        width: 25rem;
        font-weight: normal;
        height: 4.1rem;
        padding: 1.2rem 1.8rem 1.2rem 1.5rem;
        border-radius: 4px;
        div {
          text-align: left;
          display: flex;
          align-items: center;
          img {
            padding-right: 1.1rem;
          }
        }
      }
    }
  }
  .u-button {
    margin-right: 1.6rem;
    margin-left: 0;
  }
  .next {
    margin-top: 10rem;
    display: flex;
    align-items: center;
    @media screen and (max-width: 450px) {
      display: block;
      margin-top: 5rem;
    }
  }
  .skip {
    color: $--color-pink;
    font-size: 1.4rem;
    @media screen and (max-width: 420px) {
      padding-top: 2rem;
      display: block;
    }
  }
  .online-event-body {
    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 2.3rem;
        padding-top: 1.5rem;
        @media screen and (max-width: 992px) {
          width: max-content;
          padding-bottom: 0.5em;
          margin-bottom: 1.25em;
          border-bottom: 1px solid $--color-green;
      }
    }
  }
  .horizontal--line {
    height: 1px;
    margin-top: 0.4rem;
    width: 75%;
    background-color: $--color-green;
      @media screen and (max-width: 992px) {
        display: none;
      }
  }
  .u-button--disabled {
    background-color: rgba($color: $--color-black, $alpha: 0.05);
    color: rgba($color: $--color-black, $alpha: 0.3);
    border: 1px solid rgba(0,0,0,0.02);
    @media screen and (max-width: 570px) {
      margin-right: 0;
    }
  }
  .inactive {
    filter: invert(94%) sepia(0%) saturate(786%) hue-rotate(199deg) brightness(92%) contrast(91%);
  }
  .meeting--link {
    display: flex;
    align-items: center;
    margin-bottom: 3.4rem;
    @media screen and (max-width: 570px) {
      align-items: flex-start;
      flex-direction: column;
    }
    p {
      color: $--color-pink;
      font-size: 1.4rem;
      margin: 0;
      padding: 0;
      line-height: 1;
      @media screen and (max-width: 570px) {
        padding-top: 1rem;
      }
    }
  }
</style>
