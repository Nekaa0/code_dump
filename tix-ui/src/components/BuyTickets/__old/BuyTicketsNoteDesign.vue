<template>
  <main>
    <navigation :admin="false"></navigation>
    <div class="u-loader" v-loading="$apollo.queries.event.loading"></div>
    <transition name="fade">
      <div v-if="!$apollo.queries.event.loading">
        <empty-state title="event not found" instruction="we couldn't find any event with this url. please confirm it is correct and try again."
        button-text="home" target-route="Home" v-if="!event" />
        <div class="note" v-if="event">
          <div class="note-side">
            <event-details v-bind="event" />
          </div>
          <div class="note-side note-side--padded note-side--darker note-side--overflow">
            <cart :event="event" :tickets="tickets" @reset="$apollo.queries.event.refresh()" />
          </div>
        </div>
      </div>
    </transition>
  </main>
</template>

<script>
import FETCH_PUBLIC_EVENT from '@/graphql/FetchPublicEvent.gql';
import EmptyState from '@/components/Global/EmptyState';
import Divider from '@/components/Global/Divider';
import EventDetails from '@/components/Events/EventDetails';
import Cart from '@/components/Cart/Cart';

export default {
  props: {
    slug: String,
  },
  components: {
    EmptyState,
    Divider,
    EventDetails,
    Cart,
  },
  data() {
    return {
      event: null,
    };
  },
  apollo: {
    event: {
      query: FETCH_PUBLIC_EVENT,
      variables() {
        return {
          slug: this.slug,
        };
      },
      update: data => data.publicEvents.events.edges.map(value => value.node)[0],
      fetchPolicy: 'network-only',
    },
  },
  watch: {
    /* eslint object-shorthand: ["error", "always", { "avoidQuotes": false }] */
    '$route'() {
      this.$apollo.queries.event.refresh();
    },
  },
  computed: {
    tickets() {
      if (!this.event) return [];
      return this.event.tickets.edges.map(value => value.node).filter(ticket => ticket.status === 'active');
    },
  },
};
</script>

<style lang="scss" scoped>
.note {
  border-radius: 6px 6px 0 0;
  overflow: hidden;
  margin: 64px 64px 0 64px;
  position: relative;
  height: calc(100vh - 64px);
  display: flex;
  border: solid 1px whitesmoke;
  &-side {
    background: white;
    &:first-child {
      flex: 1;
    }
    &--darker {
      background: #FBFBFB;
      border-left: solid 1px #ececec;
      width: 650px;
    }
    &--padded {
      padding: 44px;
    }
    &--overflow {
      overflow: auto;
    }
  }
  &-header {
    h4 {
      font-weight: 600;
      margin-bottom: 10px;
    }
    &__cta {
      float: right;
    }
  }
}
</style>

