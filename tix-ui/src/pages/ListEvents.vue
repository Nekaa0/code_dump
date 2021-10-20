<template>
  <div>
    <navigation></navigation>
    <main>
      <div class="events--page">
        <el-row class="events--page__header">
          <el-col :md="16" :sm="12" :xs="12">
            <el-row>
              <el-col class="event" :sm="24" :md="8" :xs="24">
                <h1 class="events--page__header--text">your events</h1>
              </el-col>
            </el-row>
          </el-col>
          <el-col :md="8" :sm="12" :xs="12">
            <button class="events--page__header--create-event-button u-button u-button--large" native-type="submit" @click="$router.push({ name: 'NewEvent' })">
            <div>
              <img src="@/assets/ticket-icon.svg" alt="ticket icon">
                <span>new event</span>
              <img src="@/assets/arrow.svg" alt="arrow">
            </div>
          </button> 
          </el-col>
        </el-row>
        <transition name="fade">
          <div key="loading" v-if="isFetching">
            <div class="u-loader" v-loading="true"></div>
          </div>
          <div key="has-events" v-else-if="eventList.length > 0">
            <div class="event-group">
              <event-preview v-for="event in eventList" v-bind="event" :key="event.id" />
            </div>
          </div>
          <div key="no-events" v-else>
            <no-events></no-events>
          </div>
        </transition>
      </div>
    </main>
  </div>
</template>

<script>
import Auth from '@/helpers/auth';
import moment from 'moment';
import LIST_EVENTS from '@/graphql/ListEvents.gql';
import NoEventsView from '@/components/Event/NoEvents';
import EventPreview from '@/components/Event/Preview';
import Intercom from '@/helpers/intercom';

export default {
  components: {
    EventPreview,
    NoEvents: NoEventsView,
  },
  apollo: {
    events: {
      query: LIST_EVENTS,
      update: data => data.currentUser.events.edges.map(value => value.node),
      fetchPolicy: 'network-only',
    },
  },
  computed: {
    isFetching() {
      Intercom.loginIntercom(this, Auth.currentUser);
      return !this.events && this.$apollo.queries.events.loading;
    },
    upcoming() {
      return this.events.filter(event => moment.unix(event.endDate).isAfter(moment()));
    },
    past() {
      return this.events.filter(event => moment.unix(event.endDate).isBefore(moment()));
    },
    eventList() {
      return this.events;
    },
  },
};
</script>

<style lang="scss" scoped>
  .select {
    background: #F7FCFF;
    border: 0.5px solid #DBE9F0;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
    outline: none;
    width: 5.1rem;
    font-size: 1rem;
    height: 1.9rem;
    }
  .filter {
    padding-top: 0.5rem;
  }
  .events--page {
    margin: 4% 20.5%;
    padding-bottom: 6rem;
      @media screen and (max-width: 767px) {
        margin: 8% 7%;
      }
    &__header {
      display: flex;
      align-items: center;
      line-height: 1;
      &--text {
        @media screen and (max-width: 969px) {
          font-size: 1.6rem;
        }
      }
      &--filter {
        display: flex;
        flex-direction: row;
        background: #F7FCFF;
        width: 6.7rem;
        height: 1.9rem;
        &_img {
          padding-left: 0.5rem;
          padding-right: 0.5rem;
          border: 0.5px solid  #DBE9F0;
          border-top-left-radius: 2px;
          border-bottom-left-radius: 2px;
        }
      }
      &--create-event-button {
        float: right;
        width: 16.8rem;
        display: flex;
        align-items: center;
        justify-content: center;
        div {
          width: 10.2em;
          font-weight: normal;
          display: flex;
          line-height: 1.2;
          justify-content: space-between;
          span {
            margin-right: 0.57em;
          }
        }
        @media screen and (max-width: 320px) {
          margin-top: 1em;
        }
      }
    }
  }
  .event-group {
    margin-top: 2.4rem;
  }
</style>
