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
          <asterisk title="add a virtual location to your event"/>
        <el-row class="zoom">
          <el-col :md='7'>
            <img src="@/assets/zoom-logo.svg" alt="zoom logo">
          </el-col>
          <el-col class="zoom__details" :md="17">
            <p>Zoom has been successfully authorised</p>
          </el-col>
        </el-row>
        <div class="connect">
          <button class="connect__button u-button" @click="connectYourZoom()">
            <i v-if="processing" class="el-icon-loading"></i>
            save and return to event
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import CreateEventHeader from '@/components/Event/CreateEventHeader';
import FormHeader from '@/components/Global/FormHeader';
import Asterisk from '@/components/Global/Asterisk';

export default {
  name: 'join-event',
  components: {
    CreateEventHeader,
    FormHeader,
    Asterisk,
  },
  data() {
    return {
      processing: false,
      eventId: undefined,
      slug: undefined,
    };
  },
  methods: {
    connectYourZoom() {
      this.processing = true;
      this.$notify({
        type: 'success',
        title: 'link created',
        message: 'Zoom meeting was created successfuly.',
      });
      this.$router.push(`/events/manage/${this.slug}`);
    },
  },
  mounted() {
    this.slug = this.$route.params.slug;
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
        font-weight: 300;
        line-height: 1.2;
        color: $--color-pink;
        margin-top: 3rem;
        @media screen and (max-width: 768px) {
          margin-top: 0px;
        }
      }
    }
  }
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
  .connect {
    margin-top: 5rem;
    @media screen and (max-width: 450px) {
      display: flex;
      flex-direction: column-reverse;
      margin-top: 2rem;
    }
    &__button {
      width: 22rem;
      @media screen and (max-width: 380px) {
        margin-bottom: 1.4rem;
      }
    }
  }
</style>
