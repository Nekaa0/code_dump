<template>
  <div class="sales">
    <div class="revenue-summary">
      <div class="revenue-summary_block">
        <h1 class="revenue-summary_block__header"> {{ totalTicketsSold }} </h1> 
        <h3 class="revenue-summary_block__text">total tickets sold</h3>
      </div>
      <div class="revenue-summary_block">
        <h1 class="revenue-summary_block__header"> {{ totalSalesRevenue }} </h1>
        <h3 class="revenue-summary_block__text">total sales revenue</h3>
      </div>
      <div class="revenue-summary_block">
        <h1 class="sales__payout-date">{{ payoutDate }}</h1>
        <h3 class="revenue-summary_block__text">next payout date</h3>
      </div>
    </div>
    <div class="sales-summary">
      <sales-tab-table 
        :header="'sales summary'" 
        :tableHeader="salesSummaryHeaders" 
        :tableData="salesSummary" 
        :noTableData="'there are no sales yet'"/>
    </div>
    <div class="payment-history">
      <sales-tab-table 
        :header="'payment history'" 
        :tableHeader="paymentHistoryHeaders" 
        :tableData="paymentHistory" 
        :noTableData="'there are no payouts yet'" 
        :bodyColor="'#F2F9FA'" 
        :mobileBlockBorderBottom="'0.5px solid rgba(3, 133, 149, 0.05)'"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import FETCH_TOTAL_TICKETS_SOLD from '@/graphql/FetchTotalTicketsSold.gql';
import FETCH_TOTAL_SALES_REVENUE from '@/graphql/FetchTotalSalesRevenue.gql';
import FETCH_PAYOUT_DATE from '@/graphql/FetchPayoutDate.gql';
import FETCH_SALES_SUMMARY from '@/graphql/FetchSalesSummary.gql';
import FETCH_PAYMENT_HISTORY from '@/graphql/FetchPaymentHistory.gql';
import { formatNumberToDecimal, formatToMoney, formatAccountNumber } from '@/helpers/utility';
import Auth from '@/helpers/auth';
import SalesTabTable from './SalesTabTable';

export default {
  name: 'event-sales-summary',
  components: { SalesTabTable },
  props: {
    eventId: String,
    eventSlug: String,
  },
  data() {
    return {
      salesSummaryHeaders: [
        'ticket name',
        'tickets sold',
        'sales revenue',
        'fees',
        'net sales revenue',
      ],
      paymentHistoryHeaders: [
        'recipient',
        'bank account',
        'transfer fee',
        'payout',
        'payment date',
      ],
      total_tickets_sold: 0,
      total_sales_revenue: 0,
      payout_date: 0,
      sales_summary: null,
      payment_history: null,
    };
  },
  apollo: {
    total_tickets_sold: {
      query: FETCH_TOTAL_TICKETS_SOLD,
      variables() {
        return {
          slugOrCustomName: this.eventSlug,
        };
      },
      update: data => data.fetchTotalTicketsSold.totalTicketsSold,
      fetchPolicy: 'network-only',
    },
    total_sales_revenue: {
      query: FETCH_TOTAL_SALES_REVENUE,
      variables() {
        return {
          slugOrCustomName: this.eventSlug,
        };
      },
      update: data => data.fetchTotalSalesRevenue.totalSalesRevenue,
      fetchPolicy: 'network-only',
    },
    payout_date: {
      query: FETCH_PAYOUT_DATE,
      variables() {
        return {
          slugOrCustomName: this.eventSlug,
        };
      },
      update: data => data.fetchPayoutDate.payoutDate,
      fetchPolicy: 'network-only',
    },
    sales_summary: {
      query: FETCH_SALES_SUMMARY,
      variables() {
        return {
          slugOrCustomName: this.eventSlug,
        };
      },
      update: data => data.fetchSalesSummary,
      fetchPolicy: 'network-only',
    },
    payment_history: {
      query: FETCH_PAYMENT_HISTORY,
      variables() {
        return {
          slugOrCustomName: this.eventSlug,
        };
      },
      update: data => data.fetchPaymentHistory,
      fetchPolicy: 'network-only',
    },
  },
  computed: {
    totalTicketsSold() {
      return this.total_tickets_sold ? this.total_tickets_sold : 0;
    },
    totalSalesRevenue() {
      return this.total_sales_revenue ? formatNumberToDecimal(this.total_sales_revenue, 2) : '0.00';
    },
    payoutDate() {
      return this.payout_date ? moment(this.payout_date).format('ddd MMM Do, YYYY') : '-';
    },
    salesSummary() {
      if (this.sales_summary) {
        const data = this.sales_summary.ticketsSalesData.edges.map(value => value.node);
        return this.mutateSalesSummary(data);
      }
      return [];
    },
    paymentHistory() {
      if (this.payment_history) {
        const data = this.payment_history.paymentData.edges.map(value => value.node);
        return this.mutatePaymentHistory(data);
      }
      return [];
    },
  },
  methods: {
    mutateSalesSummary(data) {
      const mutatedData = [];
      data.forEach((Obj) => {
        let objValues = Object.values(Obj).slice(0, -1);
        objValues = objValues.map((value, index) => {
          if (index > 1) { return formatToMoney(value, `${Auth.userCurrency()}`, 2); }
          return value;
        });
        mutatedData.push(objValues);
      });
      return mutatedData;
    },
    mutatePaymentHistory(data) {
      const mutatedData = [];
      data.forEach((Obj) => {
        let objValues = Object.values(Obj).slice(0, -1);
        objValues = objValues.map((value, index) => {
          if (index === 1) { return formatAccountNumber(value); }
          if (index === 4) { return moment(value).format('MMM D, YYYY'); }
          if (index > 1) { return formatToMoney(value, `${Auth.userCurrency()}`, 2); }
          return value;
        });
        mutatedData.push(objValues);
      });
      return mutatedData;
    },
  },
};
</script>

<style lang="scss" scoped>
  .sales {
    min-height: 45rem;
    @media screen and (max-width: 600px) {
      margin: 0 1.5rem;
    }
    @media screen and (min-width: 800px) {
      min-height: 48rem;
    }
    &__payout-date {
      font-size: 1.4rem;
      padding: 1rem 0 0;
      text-transform: lowercase;
      padding-bottom: 0.8rem;
      line-height: 1.2;
      @media screen and (max-width: 800px) {
        padding: 0.5rem 0 0;
        font-size: 1.2rem;
      }
      @media screen and (max-width: 600px) {
        padding: 0rem 0 1rem;
        font-size: 1.6rem;
      }
    }
  }
  .revenue-summary {
    margin-bottom: 3.7rem;
    min-height: 9.8rem;
    padding: 2.2rem 5.8% 1.5rem 7%;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    border: 1px solid $--color-green;
    background: $--color-pale-cyan;
    border-radius: 4px;
    @media screen and (max-width: 800px) {
      padding: 3rem 5.8% 2.2rem 7%;
      margin-bottom: 2.8rem;
    }
    @media screen and (max-width: 600px) {
      flex-direction: column;
      padding: 0 2.2rem;
      margin-bottom: 0;
    }
    &_block {
      text-align: center;
      align-self: stretch;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      @media screen and (max-width: 600px) {
        padding: 3.7rem 0;
        flex-direction: column;
        border-bottom: 1px solid rgba($color: #000000, $alpha: 0.15);
      }
      &:last-child {
        border-bottom: 0;
      }
      &__header {
        padding-bottom: 0.8rem;
        line-height: 1.2;
        @media screen and (max-width: 800px) {
          font-size: 2rem;
        }
        @media screen and (max-width: 450px) {
          font-size: 1.6rem;
        }
      }
      &__text {
        font-size: 1.6rem;
        @media screen and (max-width: 450px) {
          font-size: 1.4rem;
        }
      }
    }
  }
  .sales-summary {
    padding: 4.2rem 0 3.7rem;
  }
  .payment-history {
    @media screen and (min-width: 768px) {
      padding-top: 2.3rem;
    }
  }
</style>
