<template>
  <router-link class="event-preview" :class="[eventType === 'live'? 'live-event-background' : 'online-event-background']"  :to="{name: 'ViewEvent', params: {slug: slug}}">
    <div class="poster" :class="{'poster__faded': past}">
      <img class="poster__img" :src="headerImage" />
    </div>
    <div class="details">
      <p class="details__title">{{ title }}</p>
      <p class="details__period">{{ relativeTime }}</p>
    </div>
    <div class="icon">
      <img v-if="eventType === 'online'" src="@/assets/blue-video.svg" alt="">
      <img v-else src="@/assets/orange-calender.svg" alt="">
      <p class="details__sales">tickets sold ({{ ticketsSold }})</p>
    </div>
  </router-link>
</template>

<script>
import moment from 'moment';
import Status from '@/components/Global/Status';
import Capitalize from '@/mixins/Capitalize';

export default {
  name: 'event-preview',
  mixins: [Capitalize],
  components: {
    Status,
  },
  props: {
    title: String,
    slug: String,
    address: String,
    startDate: [Number, String],
    endDate: [Number, String],
    headerImage: String,
    status: String,
    ticketsSold: Number,
    past: Boolean,
    eventType: String,
  },
  data() {
    return {
      formattedDate: null,
    };
  },
  computed: {
    published() {
      return this.status === 'active';
    },
    relativeTime() {
      const isStarted = moment.unix(this.startDate).utc().isBefore(moment().utc());
      const isEnded = moment.unix(this.endDate).utc().isBefore(moment().utc());
      let message;
      if (isStarted && !isEnded) {
        message = `started ${moment.unix(this.startDate).utc().fromNow()}`;
      } else if (isStarted && isEnded) {
        message = `ended ${moment.unix(this.endDate).utc().fromNow()}`;
      } else {
        message = moment.unix(this.endDate).utc().format('ddd MMM D YYYY, h:mm a');
      }
      return message;
    },
  },
};
</script>

<style lang="scss" scoped>
.live-event-background {
  background-color: $--background-color-pink;
}
.online-event-background {
  background-color: $--background-color-lighter-blue;
}
.event-preview {
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 0.6rem;
  border-radius: 9px;
  transition: border 0.2s ease;
  width: 100%;
  padding: 1.6rem 1rem;
  @media screen and (max-width: 767px) {
    padding: 0;
    margin-top: 10px;
  }
  .poster {
    width: 6rem;
    height: 6rem;
    border-radius: 5px;
    overflow: hidden;
    margin: 0 0 0 1rem;
    transition: opacity 0.3s ease;
    border-radius: 5px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    @media screen and (max-width: 767px) {
      margin: 1rem;
    }
    &__img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    &__faded {
      opacity: 0.5;
    }
  }
  &:hover {
    box-shadow: 0 2px 3px rgba($color: #000000, $alpha: 0.05);
    .poster {
      opacity: 1;
    }
  }
  .details {
    padding-left: 1.6rem;
    flex: 1;
    @media screen and (max-width: 969px) {
      padding: 10px;
    }
    &__title {
      margin: 0;
      font-size: 1.6rem;
      font-weight: 400;
      position: relative;
    }
    &__period {
      margin: 0;

      padding-top: 0.9rem;
      line-height: 1.2;
      color: rgba(0,0,0,0.7);
      font-size: 1.4rem;
      text-transform: lowercase;
      @media screen and (max-width: 969px) {
        font-size: 1.2rem;
      }
    }
    &__sales {
      color: $color-grey;
      font-size: 1.4rem;
      padding-top: 1.3rem;
      padding-bottom: 0.4rem;
      @media screen and (max-width: 969px) {
        font-size: 1.2rem;
      }
    }
  }
  .icon {
    text-align: right;
    padding-right: 1.4rem;
    padding-top: 1.1rem;
    @media screen and (max-width: 450px) {
      padding-top: 0;
    }
  }
}
</style>
