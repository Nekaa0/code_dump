<template>
  <section>
    <list-header v-bind="listHeader">
      <button class="u-button" native-type="submit" :class="{'u-button--disabled': orders.length === 0}" :disabled="orders.length === 0" @click.prevent="exportOrders"><i v-if="exporting" class="el-icon-loading"></i>export</button>
    </list-header>
    <div class="orders-block" v-if="isFetching || orders.length">
      <div>
        <div class="orders-summary">
          <transition name="fade">
            <order-summary :activePageOrders="activePageOrders" :isFetching="isFetching" @open-order="emitSelectedOrder" />
          </transition>
        </div>
        <div class="pagination-block" v-if="hasPreviousPage || hasNextPage">
          <pagination :hasPreviousPage="hasPreviousPage" :hasNextPage="hasNextPage" @previous-page="previousPage" @next-page="nextPage" :currentPageNum="currentPageNum"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ErrorHandler from '@/helpers/error-handler';
import ListHeader from '@/components/Global/ListHeader';
import OrderSummary from '@/components/Order/OrderSummary';
import axios from 'axios';
import * as download from 'downloadjs';
import FETCH_ORDERS from '@/graphql/FetchOrders.gql';
import FETCH_TOTAL_TICKETS_SOLD from '@/graphql/FetchTotalTicketsSold.gql';
import Pagination from '@/components/Global/Pagination';
import moment from 'moment';

export default {
  name: 'event-orders',
  components: {
    ListHeader,
    OrderSummary,
    Pagination,
  },
  props: {
    eventId: String,
    eventSlug: String,
    updateOrderTab: Object,
  },
  data() {
    return {
      exporting: false,
      ordersTabData: null,
      first_cursor: null,
      last_cursor: '',
      first_limit: 10,
      last_limit: null,
      totalTicketsSold: 0,
      currentPageNum: 1,
      nextSingleOrder: null,
    };
  },
  apollo: {
    ordersTabData: {
      query: FETCH_ORDERS,
      variables() {
        return {
          slug: this.eventSlug,
          first_cursor: this.first_cursor,
          last_cursor: this.last_cursor,
          first_limit: this.first_limit,
          last_limit: this.last_limit,
          status: 'complete',
        };
      },
      update: data => data.findBySlug,
      fetchPolicy: 'network-only',
    },
    totalTicketsSold: {
      query: FETCH_TOTAL_TICKETS_SOLD,
      variables() {
        return {
          slugOrCustomName: this.eventSlug,
        };
      },
      update: data => data.fetchTotalTicketsSold.totalTicketsSold,
      fetchPolicy: 'network-only',
    },
  },
  watch: {
    orders() {
      if (this.nextSingleOrder === 'next') {
        this.selectedOrderInfo(0);
      }
      if (this.nextSingleOrder === 'previous') {
        this.selectedOrderInfo(9);
      }
      this.nextSingleOrder = null;
    },
    updateOrderTab(payload) {
      this.nextSingleOrder = payload.direction;
      switch (this.nextSingleOrder) {
        case 'previous':
          this.previousPage();
          break;
        case 'next':
          this.nextPage();
          break;
        default:
          break;
      }
    },
  },
  computed: {
    totalOrders() {
      return this.ordersTabData ? this.ordersTabData.orderTicketSchedules.totalCount : null;
    },
    isFetching() {
      return this.$apollo.queries.ordersTabData.loading;
    },
    orders() {
      return this.ordersTabData ? this.ordersTabData.orderTicketSchedules.edges : [];
    },
    pageInfo() {
      return this.ordersTabData ? this.ordersTabData.orderTicketSchedules.pageInfo : null;
    },
    listHeader() {
      return {
        message: this.totalTicketsSold ? `${this.totalTicketsSold} tickets sold` : 'no orders yet',
      };
    },
    hasPreviousPage() {
      return this.pageInfo ? this.pageInfo.hasPreviousPage : false;
    },
    hasNextPage() {
      return this.pageInfo ? this.pageInfo.hasNextPage : false;
    },
    activePageOrders() {
      const data = [];
      if (this.orders.length) {
        const orders = this.orders.map(order => order.node);
        orders.forEach((orderInfo) => {
          data.push(this.orderRowData(orderInfo));
        });
      }
      return data;
    },
  },
  methods: {
    emitSelectedOrder(selectedOrderIndex) {
      this.selectedOrderInfo(selectedOrderIndex);
    },
    selectedOrderInfo(selectedOrderIndex) {
      this.$emit(
        'open-order',
        { selectedOrderIndex,
          totalOrders: this.totalOrders,
          orders: this.orders,
          pageInfo: this.pageInfo,
          currentPageNum: this.currentPageNum,
        });
    },
    exportOrders() {
      this.exporting = true;
      axios(
        {
          url: `/events/${this.eventId}/orders.csv`,
          method: 'GET',
          responseType: 'blob',
        },
      )
      .then((response) => {
        const fileName = `event-${this.eventSlug}-orders-${Date.now().toString()}.csv`;
        download(new Blob([response.data]), fileName, 'text/csv');
      })
      .catch(() => {
        ErrorHandler.throwError('unable to export. contact support');
        this.errored = true;
      })
      .finally(() => {
        this.exporting = false;
      });
    },
    orderRowData(orderInfo) {
      const { ticketSchedule: { ticket }, quantity, order, createdAt } = orderInfo;
      const { buyerFirstName, buyerLastName, shortId } = order;
      const orderDate = moment.unix(createdAt).format('MMM D, YYYY');
      return {
        ticketName: ticket.name,
        quantity,
        buyerFullName: `${buyerFirstName} ${buyerLastName}`,
        shortId,
        orderDate,
      };
    },
    nextPage() {
      const cursor = this.orders[this.orders.length - 1].cursor;
      this.updateOrdersQueryVariables(cursor, 'next');
      if (!this.isFetching) {
        this.currentPageNum += 1;
      }
    },
    previousPage() {
      const cursor = this.orders[0].cursor;
      this.updateOrdersQueryVariables(cursor, 'previous');
      if (!this.isFetching) {
        this.currentPageNum -= 1;
      }
    },
    updateOrdersQueryVariables(cursor, step) {
      this.last_limit = (step === 'previous') ? 10 : null;
      this.first_cursor = (step === 'previous') ? cursor : null;
      this.first_limit = (step === 'next') ? 10 : null;
      this.last_cursor = (step === 'next') ? cursor : null;
    },
  },
};
</script>

<style lang="scss" scoped>
  .u-button {
    width: 12.9rem;
  }
  .orders {
    &-block {
      padding: 0 5%;
    }
    &-summary {
      min-height: 30vh;
      @media screen and (min-width: 601px){
        min-height: 50rem;
      }
    }
  }
  section {
    padding-bottom: 1rem;
  }
  .pagination-block {
    width: 10rem;
    float: right;
    padding-bottom: 0.9rem;
  }
  .loading {
    min-height: 30vh;
    @media screen and (min-width: 601px){
      min-height: 50rem;
    }
  }
</style>
