<template>
  <div>
    <div class="about">
      <div class="about__header">
        <div class="header">
          <div class="about__image">
            <poster :src="headerImage" :alt="title" />
          </div>
          <div class="about__cta">
            <select
              class="u-button u-button-choose"
              v-model="scheduleIndex"
              @change="selectSchedule"
              v-if="reOccurringEvent"
            >
              <option :value="null">Choose Date</option>
              <option
                v-for="(option, index) in ticketSchedules[0]"
                :key="index"
                :value="index"
              >
                {{ formatDate(option.schedule.startDate) }}
              </option>
            </select>
            <button
              class="u-button u-button-buytickets"
              :class="outOfStock || scheduleIndex === null ? 'disabled' : ''"
              @click.prevent="$emit('clickedCart')"
              :disabled="outOfStock || scheduleIndex === null"
            >
              <span v-if="outOfStock">Tickets Sold Out</span>
              <span v-else>{{ freeOrPaidEvent }}</span>
            </button>
            <button v-if="lng || lat" class="u-button u-button-directions hidden-on-mobile">
              <a target="_blank" :href="`https://www.google.com/maps/?q=${lat},${lng}`">
                Directions
              </a>
            </button>
          </div>
        </div>
        <div class="event_content title__address">
          <h1 class="title__main">{{ title }}</h1>
          <div class="date">
            <img class="svg" src="@/assets/date.svg">
            <p class="event__period">{{ eventPeriod }}</p>
          </div>
          <div v-if="address" class="event__address">
            <div class="address">
              <img src="@/assets/gray-location.svg">
              <a target="_blank" :href="`https://www.google.com/maps/?q=${lat},${lng}`" :class="{'event__address-no-coordinates': !coordinatesExist}">
                {{ address }}
              </a>
            </div>
              <div class="address-tip" v-if="addressTips">
                <img src="@/assets/address-tip.svg"><p> {{ addressTips }}</p>
              </div>
          </div>
        </div>
      </div>
      <div class="about__content">
        <div class="event_content content__description-div">
          <div class="content__description" v-html="description" />
        </div>
        <div class="event_content content__contact-us">
            <h2 class="contact__us">contact us</h2>
            <p class="contact__us-icons">
              <a class="contact-icon email" target="_blank" :href="`mailto: ${user.email}`">
                <img src="@/assets/email.svg" alt="email">
              </a>
              <a class="contact-icon" v-if="website"  target="_blank" :href="formatWebsite">
                <img class="contact-icon-img" src="@/assets/website.svg" alt="website">
              </a>
              <a class="contact-icon" :href="formatInstagram" v-if="instagram" target="_blank">
                <img src="@/assets/instagram.svg" alt="instagram">
              </a>
              <a class="contact-icon" :href="formatFacebook" target="_blank" v-if="facebook">
                <img src="@/assets/facebook.svg" alt="facebook">
              </a>
              <a class="contact-icon" :href="formatTwitter" target="_blank" v-if="twitter">
                <img src="@/assets/twitter.svg" alt="twitter">
              </a>
            </p>
        </div>
        </div>
    </div>
    <div class="security">
      <img class="security-image" :src="require(`@/assets/${paymentImage}`)" :alt="paymentImageAlt">
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { formatDatesAsDuration, isValidURL, isValidHttpURL } from '@/helpers/utility';
import IsMobile from '@/mixins/IsMobile';
import Poster from '@/components/Global/Poster';

export default {
  name: 'event-details',
  mixins: [IsMobile],
  components: {
    Poster,
  },
  props: {
    id: String,
    slug: String,
    status: String,
    title: String,
    description: String,
    address: String,
    addressTips: String,
    lng: [Number, String],
    lat: [Number, String],
    startDate: [Number, String],
    endDate: [Number, String],
    twitter: String,
    instagram: String,
    facebook: String,
    website: String,
    headerImage: String,
    user: Object,
    tickets: Array,
    outOfStock: Boolean,
    repeats: Number,
    eventType: String,
    step: String,
  },
  data() {
    return {
      onScroll: () => {
        if (!this.$refs.instructions) return;
        const rect = this.$refs.instructions.getBoundingClientRect();
        if (rect.top <= 250) {
          const distanceToMovePoster = 250 - rect.top;
          this.$emit('movePoster', distanceToMovePoster);
        }
      },
      scheduleIndex: null,
    };
  },
  mounted() {
    if (this.isMobile) {
      window.addEventListener('scroll', this.onScroll);
    }
  },
  created() {
    if (!this.reOccurringEvent) {
      this.selectSingleSchedule();
    }
  },
  beforeDestroy() {
    if (this.isMobile) {
      this.$emit('movePoster', 0);
      window.removeEventListener('scroll', this.onScroll);
    }
  },
  computed: {
    ticketSchedules() {
      const schedule = [];
      this.tickets.forEach((val) => {
        schedule.push(this.selectLiveSchedules(val.ticketSchedules.edges.map(value => value.node)));
      });
      return schedule;
    },
    reOccurringEvent() {
      return this.repeats !== 0;
    },
    coordinatesExist() {
      return this.lng && this.lat;
    },
    eventPeriod() {
      return formatDatesAsDuration(this.startDate, this.endDate);
    },
    actualStartDate() {
      return moment.unix(this.startDate).format('MMM D, YYYY');
    },
    relativeStartDate() {
      return moment.unix(this.startDate).fromNow();
    },
    linksAvailable() {
      const { website, twitter, instagram, facebook, lng, lat } = this;
      return website || twitter || instagram || facebook || lng || lat;
    },
    ticketsInStock() {
      return this.tickets.filter(ticket => ticket.unlimited || ticket.limit > 0);
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
    formatWebsite() {
      return isValidHttpURL(this.website);
    },
    freeOrPaidEvent() {
      const sumOfAllTicketsPrice = this.tickets.map(ticket => ticket.price)
        .reduce((sum, ticketPrice) => sum + parseInt(ticketPrice, 0), 0);
      if (sumOfAllTicketsPrice === 0) return 'Register';
      return 'Buy Tickets';
    },
    paymentProvider() {
      return this.user.paymentProvider;
    },
    paymentImage() {
      return this.paymentProvider === 'paystack' ? 'paystack-resized.png' : 'flutterwave_footer.png';
    },
    paymentImageAlt() {
      return this.paymentProvider === 'paystack' ? 'paystack-security' : 'flutterwave-security';
    },
  },
  methods: {
    selectSingleSchedule() {
      this.scheduleIndex = 0;
      this.selectSchedule();
    },
    formatDate(val) {
      return moment.unix(val).utcOffset(0).format('ddd MMM D, YYYY hh:mm a');
    },
    selectLiveSchedules(val) {
      return val.filter(option =>
        moment.unix(option.schedule.endDate).utcOffset(-1).isAfter(moment()));
    },
    selectSchedule() {
      const data = [];
      if (this.scheduleIndex !== null) {
        for (let i = 0; i < this.ticketSchedules.length; i += 1) {
          const schedule = this.ticketSchedules[i][this.scheduleIndex];
          data.push(Object.assign({}, schedule, { ticket: this.tickets[i].id }));
        }
      }
      this.$emit('selectSchedule', data);
    },
  },
  watch: {
    step(val) {
      if (val === 'order') {
        this.selectSchedule();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  @media screen and (max-width: 1170px) {
    .about__cta {
      padding: 0 2rem;
      @media screen and (max-width: 992px) {
        position: relative;
        bottom: 0;
        left: 6.8%;
        align-self: flex-start;
        text-align: left;
        padding: 0;
        .u-button {
          width: 20rem;
          font-size: 2rem;
          @media screen and (max-width: 768px) {
            height: 3.9rem;
            font-size: 1.6rem;
            margin-top: 0rem;
            margin-bottom: 1.5rem;
          }
        }
      }
      @media screen and (max-width: 768px) {
        margin-top: 4rem;
      }
    }
  }
  @media screen and (max-width: 992px) {
    flex-direction: column;
  }
}
select {
  -moz-appearance: none;
  -webkit-appearance: none;
  background-repeat: no-repeat, repeat;
  padding-left: 2.5rem;
  padding-right: 3rem;
  text-align: center;
  background-position: right 1rem top 50%, 0 0;
  background-size: 1rem auto, 100%;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI2IiB2aWV3Qm94PSIwIDAgOCA2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuMDY2NjcgMC43MzMzOThMOCAxLjY2NjczTDQgNS42NjY3M0wwIDEuNjY2NzNMMC45MzMzMzMgMC43MzMzOThMNCAzLjgwMDA2TDcuMDY2NjcgMC43MzMzOThaIiBmaWxsPSIjRkM2NDM1Ii8+Cjwvc3ZnPgo=);
}
.u-button {
  width: 100%;
  max-width: 23rem;
  height: 56px;
  font-size: 16px;
  font-weight: 300;
  line-height: 1.2;
  margin-top: 2.9rem;
  &-directions {
    color: $--color-pink;
    background: rgba(252, 100, 53, 0.2);
    border: 1px solid $--color-pink;
  }
  &-choose {
    background-color: rgba($color-orange, 0.2);
    color: $color-orange;
  }
}
.u-button.disabled {
  opacity: 0.5;
}
.direction {
  margin-top: 2rem;
  background: $--color-light-pink;
  color: $--color-pink;
  border: 0px;
}
.about {
   background: $--background-color-pink;
  &__image {
    margin-left: -8%;
    margin-top: -3.8rem;
    width: 70%;
    overflow: hidden;
    @media screen and (max-width: 992px) {
      width: 100%;
      margin: 0;
    }
  }
  &__content {
    padding: 0 6.8% 3.6%;
    text-transform: capitalize;
    @media screen and (max-width: 768px) {
      margin-top: 0;
      width: 100%;
      display: flex;
      flex-direction: column;
    }
  }
  &__cta {
    align-self: flex-end;
    padding: 0 4rem;
    width: 40%;
    text-align: center;
  }
  &__header {
    @media screen and (max-width: 992px) {
      position: relative;
    }
  }
}
.content__description {
  padding-top: 2.5rem;
  color: rgba($color: #000000, $alpha: 0.7);
  line-height: 1.8;
  text-transform: none;
  @media screen and (max-width: 768px) {
    font-size: 1.2rem;
    padding-top: 1.8rem;
  }
}
.date {
  padding-top: 2rem;
  @media screen and (max-width: 768px) {
    padding-top: 1.8rem;
  }
}
.date {
  display: flex;
  align-items: flex-start;
  @media screen and (min-width: 768px) {
    font-size: 2rem;
    align-items: baseline;
    img {
      margin-top: 0.5rem;
    }
  }
  p {
    line-height: 1.2;
    @media screen and (max-width: 768px) {
      line-height: 1.4;
    }
  }
  img {
    padding-right: 1rem;
  }
}
p {
  margin: 0;
}
.title__main {
  font-size: 4rem;
  @media screen and (max-width: 768px) {
    font-size: 1.6rem;
  }
}
.title__address {
  padding: 3.6% 6.8% 0;
  text-transform: capitalize;
  @media screen and (max-width: 992px) {
    padding: 3.7rem 6.8% 9%;
  }
  @media screen and (max-width: 768px) {
    padding: 3.7rem 6.8% 4%;
  }
}
.event__period {
  text-transform: none;
  @media screen and (max-width: 768px) {
    font-size: 1.2rem;
  }
}
.event__address {
  display: flex;
  flex-direction: column;
  padding-top: 2rem;
  font-size: 2rem;
  &-no-coordinates {
    pointer-events: none;
  }
  @media screen and (min-width: 768px) {
    .address {
      display: flex;
      align-items: center;
      padding-top: 0.5rem;
      img {
        padding-right: 1rem;
      }
      a {
        padding-top: 0.2rem;
      }
    }
  }
  @media screen and (max-width: 768px) {
    font-size: 1.2rem;
    padding-top: 1.1rem;
  }
}
.email {
  img {
    height: 2rem;
  }
}
.contact__us {
  padding-top: 3rem;
  line-height: 1.2;
  padding-bottom: 1rem;
  margin: 0;
  @media screen and (max-width: 768px) {
    padding-top: 4.4rem;
  }
  &-icons {
    padding-top: 1rem;
    margin: 0;
    display: flex;
    margin-bottom: 7rem;
  }
}
.security {
  text-align: center;
  margin: 3rem;
  img {
    height: 5rem;
  }
}
.address-tip {
  text-transform: none;
  padding-left: 2rem;
  font-size: 1.2rem;
  padding-top: 0.7rem;
  display: flex;
  align-items: center;
  p {
    padding-left: 0.6rem;
  }
  @media screen and (max-width: 768px) {
    font-size: 1rem;
    padding-left: 1.4rem;
  }
}
.contact-icon {
  padding-right: 1rem;
}
.hidden-on-mobile {
  @media screen and (max-width: 992px) {
    display: none;
  }
}
</style>
