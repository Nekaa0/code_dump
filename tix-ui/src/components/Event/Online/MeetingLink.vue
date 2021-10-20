<template>
  <div>
    <asterisk title="instantly share conferencing details with attendees"/>
    <div v-if="finalPage === ''">
      <el-row class="zoom">
        <el-col :md='7'>
          <img src="@/assets/zoom-logo.svg" alt="zoom logo">
        </el-col>
        <el-col class="zoom__details" :md="17">
          <p>automatically generate a zoom meeting link for your tix events</p>
          <p class="requirement">requirements</p> <br>
          <p class="download">download and install zoom on your device</p>
          <p class="download">log on to tix to start your meeting on the event date and time</p>
        </el-col>
      </el-row>
      <div class="connect">
        <button class="u-button--grey u-button" @click="goToPreviousPage">back</button>
        <button class="connect__button u-button" type="primary" @click="generateLink()">
          <i v-if="processing" class="el-icon-loading"></i>
          generate meeting link
        </button>
      </div>
    </div>
    <div v-else>
      <complete-zoom-event />
    </div>
  </div>
</template>

<script>
import Asterisk from '@/components/Global/Asterisk';
import ErrorHandler from '@/helpers/error-handler';
import GENERATE_ZOOM_MEETING from '@/graphql/CreateInternalMeeting.gql';

export default {
  name: 'meeting-link',
  props: {
    goToPreviousPage: Function,
    eventId: String,
    slug: String,
  },
  components: {
    Asterisk,
  },
  data() {
    return {
      processing: false,
      finalPage: '',
      formData: {
        event: this.eventId,
      },
    };
  },
  methods: {
    generateLink() {
      this.processing = true;
      this.$apollo.mutate({
        mutation: GENERATE_ZOOM_MEETING,
        variables: this.formData,
      }).then(() => {
        this.$notify({
          type: 'success',
          title: 'link created',
          message: 'Success - your Zoom meeting link has been created',
        });
        this.$router.push(`/events/manage/${this.slug}`);
      }).catch((error) => {
        ErrorHandler.throwGraphQLError(error);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .zoom {
    margin-top: 5.3rem;
    @media screen and (max-width: 992px) {
      margin-top: 3rem;
    }
    &__details {
      padding-top: 3.6rem;
      @media screen and (min-width: 969px)
      and (max-width: 1200px)  {
        padding-left: 2rem;
      }
      p {
        font-size: 1.6rem;
        opacity: 0.5;
        font-weight: 300;
        line-height: 1.2;
        padding-left: 0px;
      }
      p:first-of-type {
        padding-bottom: 2.7rem;
      }
      .requirement {
        font-size: 1.4rem;
      }
      .download {
        font-size: 1.2rem;
      }
    }
  }
  .u-button {
    margin-right: 2rem;
    margin-left: 0;
  }
  .connect {
    margin-top: 6.8rem;
    @media screen and (max-width: 380px) {
      display: flex;
      flex-direction: column-reverse;
    }
    &__button {
      width: 22rem;
      @media screen and (max-width: 380px) {
        margin-bottom: 1.4rem;
      }
    }
  }
</style>
