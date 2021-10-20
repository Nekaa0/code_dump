<template>
  <div>
    <navigation></navigation>
    <main>
      <div class="new-event">
        <div class="event-type">
          <div class="event-type__header">
            <form-header title="new event"></form-header>
          </div>
          <div class="event-type__list" @click="selectType('online')">
            <div class="event-type__personal">
              <div class="event-type__details">
                <div class="event-type__icon">
                  <img src="@/assets/large-video.svg" alt="online event svg" />
                </div>
                <div class="event-type__text">
                  <p class="event-type__text__title">online event</p>
                  <p class="event-type__text__detail">a virtual event that takes place online and attendees join using web conferencing services </p>
                </div>
              </div>
              <div class="event-type__step" :class="{ 'current-step': selected === 'online'}">
              </div>
            </div>
          </div>
          <div
            class="event-type__list" @click="selectType('live')">
            <div class="event-type__business">
              <div class="event-type__details">
                <div class="event-type__icon">
                  <img src="@/assets/large-calender.svg" alt="calender Logo" />
                </div>
                <div class="event-type__text">
                  <p class="event-type__text__title">live event</p>
                  <p class="event-type__text__detail">an event that takes place at a physical location and attendees join in person</p>
                </div>
              </div>
                <div class="event-type__step" :class="{ 'current-step': selected === 'live'}">
              </div>
            </div>
          </div>
          <div class="event-type__buttons">
            <button class="u-button u-button--grey" @click="$router.go(-1)">back</button>
            <button class="u-button" :class="{'u-button--disabled': selected === ''}" :disabled="selected === ''" @click="next($router)">next</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>


<script>
import IsMobile from '@/mixins/IsMobile';
import FormHeader from '@/components/Global/FormHeader';
import Step from '@/components/Global/Step';

export default {
  mixins: [IsMobile],
  components: {
    FormHeader,
    Step,
  },
  name: 'new-event',
  data() {
    return {
      selected: '',
      currentPage: '',
      currentStep: 0,
    };
  },
  methods: {
    selectType(type) {
      if (this.selected === type) {
        this.selected = '';
      } else {
        this.selected = type;
      }
    },
    next($router) {
      if (this.selected === 'online') {
        return $router.push({ name: 'OnlineEvent' });
      }
      return $router.push({ name: 'CreateEvent' });
    },
    goToPreviousPage() {
      this.currentPage = '';
      this.currentStep = 0;
    },
    stepTwo() {
      this.currentStep = 1;
    },
  },
};
</script>

<style lang="scss" scoped>
  p {
    line-height: 1.7rem;
  }
  .new-event {
    .event-type {
      width: 65rem;
      @media screen and (min-width: 768px) {
        margin: 4% auto;
      }
      @media screen and (min-width: 1200px) {
        margin: 4% 20.5%;
      }
      @media screen and (max-width: 767px) {
        width: auto;
        margin: 0 6%;
      }
      &__header {
        margin-bottom: 4rem;
        @media screen and (max-width: 767px) {
          padding: 8% 0;
        }
      }
      &__list {
        padding: 1.7rem 1.4rem 2.3rem;
        margin-bottom: 1rem;
        background-color: $--background-color-gray;
        border-radius: 5px;
      }
      &__personal {
        display: flex;
      }
      &__business {
        display: flex;
      }
      &__text {
        &__detail {
          opacity: 0.5;
          font-size: 1.2rem;
          padding-top: 0.7rem;
          @media screen and (max-width: 450px) {
            margin-right: 0.5rem;
          }
        }
      }
      &__details {
        display: flex;
        align-items: center;
        flex: 1;
      }
      &__buttons {
        margin-left: 0.4rem;
        margin-top: 3rem;
        display: flex;
      }
      &__icon {
        padding-right:2.2rem;
        padding-left: 1.1rem;
        min-width: 5rem;
        @media screen and (max-width: 450px) {
          padding-left: 0;
        }
      }
      &__step {
        width: 1.3rem;
        height: 1.3rem;
        border-radius: 50%;
        float: right;
        background: grey;
      }
      .current-step {
        background: $--color-deep-green;
      }
    }
  }
  .u-button {
    margin-right: 1.6rem;
  }
</style>
