<template>
  <div :class="{'no-scroll': cartIsVisible}">
    <navigation :admin="false" />
    <main>
      <div class="checkoutpage">
        <transition-group name="fade">
          <div key="loading" v-if="isFetching">
            <div class="u-loader" v-loading="true"></div>
          </div>
          <div key="valid-event" v-else-if="!error">
            <div class="about">
              <transition name="fade">
                <div class="about__overlay" v-if="cartIsVisible" @click="cartVisible"></div>
              </transition>
              <about-event @clickedCart="cartIsVisible = true" @movePoster="onMovePoster" v-bind="eventDetails" @selectSchedule="selectSchedule" :step="step" />
            </div>
            <div class="cart" :class="{'cart--is-visible': cartIsVisible, 'cart--is-complete': paymentCompleted}">
              <transition name="slide-in">
                <cart
                  v-if="cartIsVisible"
                  :step="step"
                  :event="event"
                  :tickets="tickets"
                  :discounts="discounts"
                  :inviteeId="inviteeId"
                  :schedule="schedule"
                  :closeCart="closeCart"
                  @back="cartIsVisible = false"
                  @complete="completePayment"
                  @reset="refresh"
                  @changeStep="changeStep"
                  @keepCart="keepCart"
                />
              </transition>
            </div>
          </div>
          <div key="invalid-event" v-else>
            <empty-state :title="error.title" :instruction="error.message" button-text="home" target-route="Home" />
          </div>
        </transition-group>
      </div>
    </main>
  </div>
</template>

<script>
import moment from 'moment';
import FETCH_PUBLIC_EVENT from '@/graphql/FetchPublicEvent.gql';
import FETCH_DISCOUNT_CODE from '@/graphql/FetchPublicDiscount.gql';
import INVITE_CLAIMED from '@/graphql/InviteClaimed.gql';
import IsMobile from '@/mixins/IsMobile';
import EmptyState from '@/components/Global/EmptyState';
import Divider from '@/components/Global/Divider';
import Auth from '@/helpers/auth';
import FloatingCallToAction from '@/components/Global/FloatingCallToAction';
import AboutEvent from '@/components/Event/About';
import Cart from '@/components/Cart/Cart';

export default {
  props: {
    slug: String,
    ticketId: String,
    inviteeId: String,
    token: String,
  },
  mixins: [IsMobile],
  components: {
    EmptyState,
    Divider,
    AboutEvent,
    Cart,
    FloatingCta: FloatingCallToAction,
  },
  metaInfo() {
    let title;
    let meta;
    if (this.event) {
      title = `Buy tickets to ${this.event.title}`;
      meta = [
        { property: 'twitter:image', content: this.event.headerImage },
        { property: 'og:image', content: this.event.headerImage },
      ];
      return { title, meta };
    }
    return { };
  },
  data() {
    const views = {
      DETAILS: 'details',
      CART: 'cart',
    };

    return {
      closeCart: false,
      step: 'order',
      event: null,
      views,
      view: views.DETAILS,
      posterOffset: 0,
      cartIsVisible: false,
      paymentCompleted: false,
      inviteClaimed: false,
      schedule: [],
    };
  },
  apollo: {
    event: {
      query: FETCH_PUBLIC_EVENT,
      variables() {
        return {
          slugOrCustomName: (this.slug || this.token),
        };
      },
      update: data => data.publicEvents.events.edges.map(value => value.node)[0],
      fetchPolicy: 'network-only',
      result() {
        if (!this.ticketId && this.event.ticketsVariation === 'invite') {
          if (!Auth.loggedIn()) {
            this.$router.push('/404');
          }
        }
      },
    },
    inviteClaimed: {
      query: INVITE_CLAIMED,
      variables() {
        return {
          invitee: this.inviteeId,
          ticket: this.ticketId,
        };
      },
      update: data => data.inviteClaimed,
      fetchPolicy: 'network-only',
    },
    discounts: {
      query: FETCH_DISCOUNT_CODE,
      variables() {
        return {
          slugOrCustomName: (this.slug || this.token),
          codeType: 'automated',
        };
      },
      update: data => data.fetchDiscountCodes,
      fetchPolicy: 'network-only',
    },
  },
  watch: {
    /* eslint object-shorthand: ["error", "always", { "avoidQuotes": false }] */
    '$route'() {
      this.$apollo.queries.event.refetch();
      this.$apollo.queries.inviteClaimed.refetch();
    },
    cartIsVisible() {
      this.paymentCompleted = false;
      this.$apollo.queries.event.refetch();
    },
  },
  computed: {
    isFetching() {
      return !this.event && this.$apollo.queries.event.loading;
    },
    tickets() {
      if (!this.event) return [];
      if (this.ticketId) {
        return this.event.tickets.edges.map(value => value.node).filter(ticket => ticket.id === this.ticketId && ticket.status === 'active');
      }
      return this.event.tickets.edges.map(value => value.node).filter(ticket => ticket.inviteOnly === false && ticket.status === 'active');
    },
    outOfStock() {
      let valid = false;
      if (this.ticketId) {
        const availableTickets = this.tickets;
        valid = !availableTickets.length;
      }
      if (this.schedule.length > 0) {
        const availableTickets = this.schedule.filter(
          ticket => ticket.unlimited || ticket.limit > 0,
        );
        valid = !availableTickets.length;
      }
      return valid;
    },
    eventDetails() {
      return Object.assign({}, this.event, {
        tickets: this.tickets,
        outOfStock: this.outOfStock,
      });
    },
    eventIsPast() {
      return this.event && moment.unix(this.event.endDate).isBefore(moment());
    },
    relativeEndDate() {
      return this.event && moment.unix(this.event.endDate).fromNow();
    },
    error() {
      const networkFetchComplete = !this.$apollo.queries.event.loading;
      if (networkFetchComplete) {
        let title;
        let message;

        if (!this.event) {
          title = 'event not found';
          message = 'we couldn\'t find any event with this url. please confirm it is correct and try again.';
          return { title, message };
        }

        if (this.ticketId && this.inviteeId && this.inviteClaimed) {
          title = 'invite claimed';
          message = 'you’ve already claimed your invite for this event 😞';
          return { title, message };
        }

        if (this.eventIsPast) {
          title = 'a little too late';
          message = `this event ended ${this.relativeEndDate} 😞`;
          return { title, message };
        }
      }

      return null;
    },
  },
  methods: {
    onMovePoster(offset) {
      this.posterOffset = offset;
    },
    refresh() {
      this.$apollo.queries.event.refresh();
      this.$apollo.queries.inviteClaimed.refresh();
      setTimeout(() => {
        this.changeStep('order');
      }, 1500);
    },
    changeStep(val) {
      this.step = val;
    },
    completePayment() {
      this.paymentCompleted = true;
      this.changeStep('complete');
    },
    cartVisible() {
      if (this.step === 'pay') {
        this.closeCart = true;
      } else this.cartIsVisible = false;
    },
    keepCart() {
      this.closeCart = false;
    },
    selectSchedule(val) {
      this.schedule = val;
    },
  },
};
</script>

<style lang="scss">
  .empty-state {
    margin: 8% 4rem;
    &-content__paragraph {
      max-width: 43rem;
    }
  }
</style>

<style lang="scss" scoped>
.checkoutpage {
  margin: 12.5% 6% 6rem 14.5%;
  @media screen and (max-width: 992px) {
    margin: 12.5% 6% 6rem;
  }
}
.no-scroll {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.about {
  &__overlay {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.75);
    z-index: 100;
  }
}

.cart {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 50%;
  z-index: 500;
  transition: 0.3s ease;
  transform: translateX(100%);
  box-shadow: -2px 0 3px rgba(0, 0, 0, 0.1);
  background: white;
  padding-top: 2rem;
  padding-bottom: 2rem;
  @media screen and (max-width: 767px) {
    transform: translateY(100%);
    box-shadow: 0 -2px 3px rgba(0, 0, 0, 0.1);
  }
  @media screen and (max-width: 480px) {
    width: 100%;
  }
  &--is-visible {
    transform: translateX(0) translateY(0);
  }
}
</style>

