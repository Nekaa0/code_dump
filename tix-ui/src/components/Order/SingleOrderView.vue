<template>
  <div class="order__body">
    <section class="order">
      <div class="order-cta">
        <div class="back-arrow" @click="goBack">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.5 6H2.5"
              stroke="#FC6435"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6 9.5L2.5 6L6 2.5"
              stroke="#FC6435"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <div class="order__pagination">
          <span class="order-pagination__pages">
            {{ orderNumber }} of {{ totalOrders }}
          </span>
          <pagination-arrows-only
            :noPreviousPage="!hasPreviousPage && !previousOrderExists"
            :noNextPage="!hasNextPage && !nextOrderExists"
            @goto-previous-page="previousOrder"
            @goto-next-page="nextOrder"
          />
        </div>
      </div>
      <section class="order-info">
        <div class="order-info__column">
          <div
            v-for="(data, index) in firstColumnData"
            :key="index"
            class="order-detail"
          >
            <span class="order-detail__title">{{ data.title }}</span>
            <span class="order-detail__info">{{ data.value }}</span>
          </div>
          <div class="order-cta__buttons">
            <button
              class="u-button u-button--medium"
              :class="{ 'u-button--disabled': processing }"
              @click.prevent="resendOrderConfirmation"
              :disabled="processing"
            >
              <i v-if="processing" class="el-icon-loading"></i>
              <span v-else>resend order confirmation</span>
            </button>
          </div>
        </div>
        <div class="order-info__column">
          <div
            v-for="(data, index) in secondColumnData"
            :key="index"
            class="order-detail"
          >
            <span class="order-detail__title">{{ data.title }}</span>
            <span class="order-detail__info">{{ data.value }}</span>
          </div>
          <div class="order__pagination">
            <div v-html="currentQrCode" class="ticket-barcode"></div>
            <span class="ticket-barcode_pages">
              {{ currentQrCodeIndex + 1 }} of {{ qrCodes.length }}
            </span>
            <pagination-arrows-only
              :noPreviousPage="!hasPreviousQrCode"
              :noNextPage="!hasNextQrCode"
              @goto-previous-page="previousBarcode"
              @goto-next-page="nextBarcode"
            />
          </div>
          <div>
            <p class="order__event-name">{{ event.title }}</p>
            <p class="order__event-duration">{{ eventDuration }}</p>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
import moment from 'moment';
import { formatDatesAsDuration, formatToMoney } from '@/helpers/utility';
import RESEND_ORDER_EMAIL from '@/graphql/ResendOrderEmail.gql';
import ErrorHandler from '@/helpers/error-handler';
import Auth from '@/helpers/auth';
import PaginationArrowsOnly from '../Global/PaginationArrowsOnly';

export default {
  components: { PaginationArrowsOnly },
  name: 'single-order-view',
  props: {
    orderInfo: {
      type: Object,
      required: true,
    },
    event: {
      type: Object,
      required: true,
    },
    eventSlug: String,
  },
  data() {
    return {
      selectedOrderIndex: this.orderInfo.selectedOrderIndex,
      hasPreviousPage: this.orderInfo.pageInfo.hasPreviousPage,
      hasNextPage: this.orderInfo.pageInfo.hasNextPage,
      ordersTabData: this.orderInfo.orders,
      totalOrders: this.orderInfo.totalOrders,
      currentPageNum: this.orderInfo.currentPageNum,
      processing: false,
      currentQrCodeIndex: 0,
    };
  },
  watch: {
    orderInfo(update) {
      const { selectedOrderIndex, pageInfo, orders, totalOrders, currentPageNum } = update;
      this.selectedOrderIndex = selectedOrderIndex;
      this.hasPreviousPage = pageInfo.hasPreviousPage;
      this.hasNextPage = pageInfo.hasNextPage;
      this.ordersTabData = orders;
      this.totalOrders = totalOrders;
      this.currentPageNum = currentPageNum;
    },
  },
  computed: {
    qrCodes() {
      const allQrCodes = [...this.selectedOrder.qrCodes];
      const qrCodesToDisplay = allQrCodes.splice(0, this.selectedOrder.quantity);
      return qrCodesToDisplay;
    },
    currentQrCode() {
      return this.selectedOrder.qrCodes[this.currentQrCodeIndex];
    },
    hasNextQrCode() {
      return this.currentQrCode !== this.qrCodes[this.qrCodes.length - 1];
    },
    hasPreviousQrCode() {
      return this.currentQrCode !== this.qrCodes[0];
    },
    orderNumber() {
      if (this.currentPageNum > 1) {
        return ((this.currentPageNum - 1) * 10) + this.selectedOrderIndex + 1;
      }
      return this.selectedOrderIndex + 1;
    },
    firstColumnData() {
      return [
        {
          title: 'amount',
          value: formatToMoney(this.selectedOrder.price, `${Auth.userCurrency()}`, 2),
        },
        {
          title: 'ticket name',
          value: this.ticket.name,
        },
        {
          title: 'order quantity',
          value: this.selectedOrder.quantity,
        },
        {
          title: 'tix fees',
          value: this.tixFees,
        },
        {
          title: 'order date',
          value: moment.unix(this.selectedOrder.createdAt).format('ddd MMMM Do, YYYY'),
        },
      ];
    },
    secondColumnData() {
      return [
        {
          title: 'order name',
          value: `${this.selectedOrder.buyerFirstName} ${this.selectedOrder.buyerLastName}`,
        },
        {
          title: 'order number',
          value: this.selectedOrder.shortId,
        },
        {
          title: 'email address',
          value: this.selectedOrder.buyerEmail,
        },
        {
          title: 'phone number',
          value: this.selectedOrder.buyerPhoneNumber,
        },
      ];
    },
    tixFees() {
      const fees = this.ticket.tixFees * this.selectedOrder.quantity;
      return formatToMoney(fees, `${Auth.userCurrency()}`, 2);
    },
    eventDuration() {
      return formatDatesAsDuration(this.eventSchedule.startDate, this.eventSchedule.endDate);
    },
    eventSchedule() {
      return this.selectedOrder.schedule;
    },
    allOrders() {
      return this.formatOrder(this.ordersTabData);
    },
    selectedOrder() {
      return this.allOrders[this.selectedOrderIndex];
    },
    ticket() {
      return this.selectedOrder.ticket;
    },
    previousOrderExists() {
      return this.selectedOrder !== this.allOrders[0];
    },
    nextOrderExists() {
      return this.selectedOrder !== this.allOrders[this.allOrders.length - 1];
    },
  },
  methods: {
    formatOrder(fetchedOrders) {
      const orders = fetchedOrders.map((o) => {
        const { cursor, node } = o;
        const { ticketSchedule: { ticket, schedule }, order, quantity, price, createdAt } = node;
        return Object.assign({ cursor, quantity, price, ticket, createdAt, schedule }, order);
      });
      return orders;
    },
    previousOrder() {
      this.currentQrCodeIndex = 0;
      if (!this.hasPreviousPage && !this.previousOrderExists) return;
      if (this.selectedOrderIndex === 0) {
        this.$emit('newPage', { direction: 'previous', order: this.orderNumber });
        return;
      }
      this.selectedOrderIndex -= 1;
    },
    nextOrder() {
      this.currentQrCodeIndex = 0;
      if (!this.hasNextPage && !this.nextOrderExists) return;
      if (this.selectedOrderIndex === 9) {
        this.$emit('newPage', { direction: 'next', order: this.orderNumber });
        return;
      }
      this.selectedOrderIndex += 1;
    },
    previousBarcode() {
      if (this.currentQrCodeIndex !== 0) {
        this.currentQrCodeIndex -= 1;
      }
    },
    nextBarcode() {
      if ((this.qrCodes.length - 1) > this.currentQrCodeIndex) {
        this.currentQrCodeIndex += 1;
      }
    },
    goBack() {
      this.$emit('close-order');
    },
    resendOrderConfirmation() {
      this.processing = true;
      this.$apollo.mutate({
        mutation: RESEND_ORDER_EMAIL,
        variables: {
          order: this.selectedOrder.shortId,
        },
      }).then(() => {
        this.processing = false;
        this.$message.success('Order confirmation email sent');
      }).catch((error) => {
        this.processing = false;
        ErrorHandler.throwGraphQLError(error);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.order {
  background: rgba($color: #c4c4c4, $alpha: 0.15);
  width: 100%;
  padding: 2.4rem 2.2rem 4.6rem;
  @media screen and (min-width: 600px) {
    padding: 2.8rem 4.1rem 4.6rem;
  }
  &-info {
    display: flex;
    &__column {
      padding-top: 2.4rem;
      @media screen and (max-width: 599px) {
        display: none;
        width: 100%;
        &:first-of-type {
          display: block;
        }
      }
      @media screen and (min-width: 600px) {
        width: 50%;
        padding-left: 5.4%;
        border-left: 1px solid rgba($color: $--color-black, $alpha: 0.15);
        &:first-of-type {
          border-left: 0;
          padding-right: 5.4%;
          padding-left: 0;
        }
      }
    }
  }
  &-detail {
    padding: 2.2rem 0;
    border-bottom: 0.5px solid rgba($color: $--color-black, $alpha: 0.15);
    display: flex;
    text-transform: lowercase;
    justify-content: space-between;
    font-size: 1.4rem;
    @media screen and (min-width: 600px) {
      font-size: 1.2rem;
      padding: 1.9rem 0 1.8rem;
    }
    &__title {
      color: $color-orange;
      font-weight: 300;
      font-size: 1.4rem;
      @media screen and (min-width: 600px) {
        font-size: 1.2rem;
      }
    }
  }
  &__pagination {
    font-weight: 300;
    font-size: 1.2rem;
    text-align: right;
  }
  &-pagination {
    &__pages {
      margin-right: 2rem;
    }
  }
  &-cta {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding-bottom: 0.6rem;
    &__buttons {
      margin-top: 6.2rem;
      padding-bottom: 3.4rem;
      @media screen and (min-width: 600px) {
        margin-top: 11.2rem;
      }
    }
  }
  &__event {
    &-name,
    &-duration {
      font-size: 1rem;
      text-align: right;
      margin-top: 1.4rem;
      font-weight: 300;
      line-height: 1.2;
    }
  }
}
.ticket-barcode {
  margin: 6.5rem 0 0.7rem auto;
  max-width: 10rem;
  height: 10rem;
  background: $--color-white;
  width: 100%;
  &_pages {
    margin-right: 0.65rem;
  }
}
.u-button {
  width: 20rem;
  display: block;
  @media screen and (max-width: 599px) {
    margin: 0 auto;
  }
}
.back-arrow {
  cursor: pointer;
}
</style>
