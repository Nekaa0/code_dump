<template>
  <div>
    <navigation></navigation>
    <main>
      <div class="event--view" ref="event">
        <transition name="fade" mode="out-in">
          <event-form :edit='true' :event="Object.assign({}, event)" :eventType="event.eventType" :processing="processing" @save="updateEvent" v-if="editEvent" @back="editEvent = false"/>
          <create-discount v-else-if="newDiscount" @back="newDiscount = false" @next="createDiscount"/>
          <div v-else>
            <transition-group name="fade">
              <div key="loader" v-if="isFetching">
                <div class="u-loader" v-loading="true"></div>
              </div>
              <div key="event" v-else-if="event">
                <div class="event-header">
                  <h1 class="event-header__header">{{ event.title }}</h1>
                  <div class="event-header__status">
                    <event-status v-bind="event" :createdTickets="tickets.length" @verificationCompleted="view = 'tickets'" :hasMeeting="hasMeeting()" @addMeeting="addMeeting" @createTicket="createTicket" @update="updateEventStatus" @createEvent="createEvent" @updateEvent="canEdit" />
                  </div>
                </div>
                <div class="tab">
                  <el-tabs v-model="view" @tab-click="updateRoute">
                    <el-tab-pane name="about">
                      <span slot="label" class="tab__header" :class="{active: onAboutTab }">about</span>
                      <manage-event v-bind="event" @edit="canEdit"/>
                    </el-tab-pane>
                    <el-tab-pane name="tickets">
                      <span slot="label" class="tab__header" :class="{active: 'tickets' == this.$route.query.view }">tickets</span>
                      <div class="default-tickets-view">
                        <event-tickets :eventId="event.id" :eventFrequency="event.frequency" :tickets="tickets" @updateEvent="$apollo.queries.event.refresh()" />
                      </div>
                    </el-tab-pane>
                    <el-tab-pane name="orders">
                      <span slot="label" class="tab__header" :class="{active: 'orders' == this.$route.query.view}">orders</span>
                      <div class="default-orders-view">
                        <el-tabs v-model="subview" @tab-click="updateRouteWithSubview" v-show="!singleOrderViewPayload">
                          <el-tab-pane name="orders">
                            <span slot="label" class="orders-content__header">view</span>
                            <event-orders :eventId="event.id" :eventSlug="event.slug" :updateOrderTab="updateOrderTab" v-if="loadOrdersTab" @open-order="openOrder" />
                          </el-tab-pane>
                          <el-tab-pane name="attendees">
                            <span slot="label" class="orders-content__header">email attendees</span>
                              <event-attendees :eventId="event.id" :eventSlug="event.slug" v-if="loadOrdersTab"/>
                          </el-tab-pane>
                        </el-tabs>
                        <transition name="fade" v-if="singleOrderViewPayload">
                          <single-order-view :eventSlug="event.slug" :event="event" :orderInfo="singleOrderViewPayload" @newPage="updateOrderView" @close-order="singleOrderViewPayload = null"/>
                        </transition>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane name="sales">
                      <span slot="label" class="tab__header" :class="{active: 'sales' == this.$route.query.view }">sales</span>
                      <div class="default-tickets-view">
                        <event-sales :eventId="event.id" :tickets="tickets" :eventSlug="event.slug" v-if="loadSalesTab"/>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane name="manage">
                      <span slot="label" class="tab__header" :class="{active: 'manage' == this.$route.query.view }">manage</span>
                      <div class="default-orders-view">
                        <el-tabs v-model="subview" @tab-click="updateRouteWithSubview">
                          <el-tab-pane name="online">
                            <span slot="label" class="orders-content__header">online events</span>
                            <online-event-form v-if="loadOnlineTab" v-bind="event" @emailAttendees="emailAttendees"/>
                          </el-tab-pane>
                          <el-tab-pane name="discounts">
                            <span slot="label" class="orders-content__header">discounts</span>
                            <discount-codes :eventId="event.id" :endDate="event.endDate" :tickets="tickets" :codeType="codeType" :create="showDiscountForm" @create="showDiscount" @createTicket="createTicket" />
                          </el-tab-pane>
                        </el-tabs>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </div>
              <div key="error" v-else>
                <empty-state title="event not found" instruction="we couldn't find any event with this url. please confirm it is correct and try again."
                button-text="home" target-route="home" />
              </div>
            </transition-group>
          </div>
        </transition>
      </div>
    </main>
  </div>
</template>

<script>
import { Tabs, TabPane } from 'element-ui';
import FETCH_EVENT from '@/graphql/FetchEvent.gql';
import EDIT_EVENT from '@/graphql/EditEvent.gql';
import EmptyState from '@/components/Global/EmptyState';
import Divider from '@/components/Global/Divider';
import EventStatus from '@/components/Event/Status';
import ManageEvent from '@/components/Event/Manage';
import EventTickets from '@/components/Event/Tickets';
import EventAttendees from '@/components/Event/Attendees';
import EventOrders from '@/components/Event/Orders';
import EventSales from '@/components/Event/Sales';
import EventForm from '@/components/Event/Form';
import ErrorHandler from '@/helpers/error-handler';
import OnlineEventForm from '@/components/Event/Online/OnlineForm';
import SingleOrderView from '@/components/Order/SingleOrderView';
import DiscountCodes from '@/components/Event/DiscountCodes/Index';
import CreateDiscount from '@/components/Event/DiscountCodes/Create';

export default {
  props: ['slug'],
  components: {
    ElTabs: Tabs,
    ElTabPane: TabPane,
    EmptyState,
    Divider,
    EventStatus,
    ManageEvent,
    EventTickets,
    EventAttendees,
    EventOrders,
    EventSales,
    EventForm,
    OnlineEventForm,
    SingleOrderView,
    DiscountCodes,
    CreateDiscount,
  },
  data() {
    return {
      event: null,
      view: this.$route.query.view || 'about',
      processing: false,
      editEvent: false,
      newDiscount: false,
      codeType: '',
      showDiscountForm: false,
      subview: this.$route.query.subview,
      singleOrderViewPayload: null,
      updateOrderTab: null,
    };
  },
  apollo: {
    event: {
      query: FETCH_EVENT,
      variables() {
        return {
          slug: this.slug,
        };
      },
      update: data => data.findBySlug,
      fetchPolicy: 'network-only',
    },
  },
  computed: {
    loadSalesTab() {
      return (this.$route.query.view === 'sales');
    },
    loadOnlineTab() {
      return this.$route.query.view === 'manage';
    },
    loadOrdersTab() {
      return (this.$route.query.view === 'orders');
    },
    isFetching() {
      return this.$apollo.queries.event.loading;
    },
    tickets() {
      if (!this.event) return [];
      return this.event.tickets.edges.map(value => value.node);
    },
    onAboutTab() {
      return (this.$route.query.view === undefined || this.$route.query.view === 'about');
    },
  },
  methods: {
    updateEventStatus(published) {
      this.event.status = published ? 'active' : 'inactive';
    },
    addMeeting() {
      this.view = 'manage';
      this.updateRoute({ name: 'manage' });
    },
    createTicket() {
      this.view = 'tickets';
      this.updateRoute({ name: 'tickets' });
    },
    createEvent() {
      this.$router.push('/events/create');
    },
    showDiscount() {
      this.newDiscount = true;
    },
    createDiscount(val) {
      this.newDiscount = false;
      this.codeType = val;
      this.showDiscountForm = true;
    },
    emailAttendees() {
      this.view = 'orders';
      this.subview = 'attendees';
      this.$router.replace({
        path: this.$route.path,
        query: { view: this.view, subview: this.subview },
      });
    },
    updateOrderView(payload) {
      this.updateOrderTab = payload;
    },
    openOrder(payload) {
      this.singleOrderViewPayload = payload;
    },
    hasMeeting() {
      const event = this.event;
      const internalMeeting = event.internalMeeting;
      const externalMeeting = event.externalMeeting;
      if (event.eventType === 'online' && internalMeeting == null && externalMeeting == null) {
        return false;
      }
      return true;
    },
    updateRoute(tab) {
      this.$router.replace({ path: this.$route.path, query: { view: tab.name } });
      if (tab.name === 'manage') {
        this.subview = 'online';
      } else if (tab.name === 'orders') {
        this.subview = 'orders';
      }
    },
    updateRouteWithSubview(tab) {
      const currentView = this.$route.query.view;
      this.$router.replace({
        path: this.$route.path,
        query: { view: currentView, subview: tab.name },
      });
    },
    canEdit() {
      this.editEvent = true;
      const eventRef = this.$refs.event;
      this.$nextTick(() => {
        eventRef.scrollIntoView({ behavior: 'smooth' });
      });
    },
    updateEvent(variables) {
      this.processing = true;
      this.$apollo.mutate({
        mutation: EDIT_EVENT,
        variables,
      }).then((response) => {
        this.event = Object.assign(this.event, response.data.editEvent);
        this.processing = false;
        this.editEventDialogVisible = false;
        this.editEvent = false;
        this.$message.success('Event Updated');
      }).catch((error) => {
        this.processing = false;
        ErrorHandler.throwGraphQLError(error);
      });
    },
  },
};
</script>
<style lang="scss">
 .default-orders-view  .el-tabs__nav-scroll {
    padding: 3.2rem 5% 0;
    @media screen and (max-width: 992px) {
      padding: 1.2rem 5% 0;
    }
  }
  .event--view .el-dialog__header {
    border: none;
    font-weight: 300;
    font-size: 2rem;
    line-height: 1.2;
    color: $--color-pink;
    padding: 2.6rem 2.5rem 1.8rem;
    width: 100%;
  }
  .event--view .el-dialog__body {
    padding: 0 3.2rem 0 2.1rem;
    font-weight: 300;
    line-height: 1.2;
    color: $--color-black;
    width: 100%;
  }

  .default-tickets-view {
    padding: 3.2rem 5%;
  }
  .empty-state {
    margin: 10% -9.6% 0 -13.8%;
    &-content__paragraph {
      max-width: 40rem;
    }
  }
</style>

<style lang="scss" scoped>
  .event--view {
    margin: 0 20.5%;
    padding-top: 3.8rem;
    line-height: 120%;
    @media screen and (max-width: 767px) {
      margin: 0 5%;
    }
    @media screen and (min-width: 767px) and (max-width: 992px){
      margin: 0 10%;
    }
  }
  .event-header {
    &__header {
      margin-bottom: 4.4rem;
      font-size: 1.75em;
      font-weight: 300;
      line-height: 1.2;
      @media screen and (max-width: 767px){
        margin-bottom: 2.5rem;
        font-size: 1.6rem;
      }
    }
    &__meeting-status {
      padding: 2.3rem;
      border: 1px dashed $--color-green;
      @media screen and (max-width: 767px){
        padding: 1.3rem;
      }
      border-radius: 4px;
      &--title {
        font-size: 1.4rem;
      }
      &--link {
        color: $--color-pink;
      }
    }
    &__status {
      margin-bottom: 3.3rem;
      @media screen and (max-width: 767px) {
        margin-top: 1.1rem;
      }
    }
  }
  .default-orders-view, .default-tickets-view {
    border: solid 1px rgba($color: #000000, $alpha: 0.05);
    border-radius: 9px;
    min-height: 15em;
    width: 100%;
    margin-top: 1.8rem;
  }
  .orders-content {
    &__header {
      font-size: 1em;
      font-weight: normal;
      padding-right: 2em;
      @media screen and (max-width: 767px){
        padding-right: 0;
      }
    }
    &__text {
      padding: 2.7rem 5%;
      color: $--color-green;
      line-height: 1.2;
      font-size: 1em;
      margin: 0;
    }
  }
  .tab {
    margin-bottom: 30%;
    &__header {
      font-size: 1.25em;
      font-weight: normal;
      opacity: 0.4;
      color: $--color-black;
      line-height: 1.2;
      width: max-content;
      &:hover {
        border-bottom: 2px solid rgba($color: $--color-pink, $alpha: 0.5);
      }
      padding-bottom: 0.8rem;
      margin-right: 5.1rem;
      @media screen and (max-width: 767px){
        margin-right: 0;
        font-size: 1.6rem;
      }
    }
  }
  .active {
    opacity: 1;
    border-bottom: 2px solid $--color-pink;
  }
  .el-sub-tab {
    color: #303133;
    text-decoration-line: underline;
  }
  .u-button {
    font-weight: 300;
    font-size: 1.4rem;
    width: 14.9rem;
    @media screen and (min-width: 767px){
      float: right;
    }
    @media screen and (max-width: 767px){
      margin-top: 1.3rem;
    }
  }
</style>
