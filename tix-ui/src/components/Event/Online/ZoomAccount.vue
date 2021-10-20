<template>
  <div>
    <asterisk  title="instantly share conferencing details with attendees"/>
    <div v-if="finalPage === ''">
      <el-row class="zoom">
        <el-col :md='7'>
          <img src="@/assets/zoom-logo.svg" alt="zoom logo">
        </el-col>
        <el-col class="zoom__details" :md="17">
          <p>automatically create and include zoom details in tix events</p>
          <p class="requirement">requirements</p><br>
          <p class="download">zoom pro account</p>
          <p class="download">zoom admin privileges</p>
        </el-col>
      </el-row>
      <div class="connect">
        <button class="u-button--grey u-button" @click="goToPreviousPage">back</button>
        <button class="connect__button u-button" @click="connectYourZoom()">
          <i v-if="processing" class="el-icon-loading"></i>
          connect your zoom account</button>
      </div>
    </div>
    <div v-else>
      <complete-zoom-event />
    </div>

  </div>
</template>

<script>
import Asterisk from '@/components/Global/Asterisk';

export default {
  name: 'zoom-account',
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
      finalPage: '',
      processing: false,
      eventDetails: {
        id: this.eventId,
        slug: this.slug,
      },
    };
  },
  methods: {
    connectYourZoom() {
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
      }
      p:first-of-type {
        padding-bottom: 2.7rem;
      }
    }
    .requirement {
      font-size: 1.4rem;
    }
    .download {
      font-size: 1.2rem;
    }
  }
  .u-button {
    margin-right: 2rem;
    margin-left: 0;
  }
  .connect {
    margin-top: 5rem;
    @media screen and (max-width: 450px) {
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
