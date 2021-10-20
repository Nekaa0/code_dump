<template>
  <div class="invoice">
    <section v-if="invoices.length || isFetching">
      <div class="invoice-summary">
        <transition name="fade">
          <invoice-summary
            :isFetching="isFetching"
            :invoiceHistory="activePageInvoices"
          />
        </transition>
      </div>
      <div class="pagination-block" v-if="hasPreviousPage || hasNextPage">
        <pagination
          :hasPreviousPage="hasPreviousPage"
          :hasNextPage="hasNextPage"
          @previous-page="previousPage"
          @next-page="nextPage"
          :currentPageNum="currentPageNum"
        />
      </div>
    </section>
    <p class="invoice-summary__none" v-else>you have no invoice history yet.</p>
  </div>
</template>

<script>
import moment from 'moment';
import Pagination from '@/components/Global/Pagination';
import FETCH_INVOICES from '@/graphql/TixPro/FetchInvoices.gql';
import InvoiceSummary from './InvoiceSummary';

export default {
  name: 'billings-invoice',
  components: {
    Pagination,
    InvoiceSummary,
  },
  data() {
    return {
      currentPageNum: 1,
      invoiceHistory: null,
      first_limit: 10,
      last_cursor: '',
      last_limit: null,
      first_cursor: null,
    };
  },
  apollo: {
    invoiceHistory: {
      query: FETCH_INVOICES,
      variables() {
        return {
          first_cursor: this.first_cursor,
          last_cursor: this.last_cursor,
          first_limit: this.first_limit,
          last_limit: this.last_limit,
        };
      },
      update: data => data.fetchInvoices.invoices,
      fetchPolicy: 'network-only',
    },
  },
  computed: {
    isFetching() {
      return this.$apollo.queries.invoiceHistory.loading;
    },
    pageInfo() {
      return this.invoiceHistory ? this.invoiceHistory.pageInfo : null;
    },
    hasPreviousPage() {
      return this.pageInfo ? this.pageInfo.hasPreviousPage : false;
    },
    hasNextPage() {
      return this.pageInfo ? this.pageInfo.hasNextPage : false;
    },
    invoices() {
      return this.invoiceHistory ? this.invoiceHistory.edges : [];
    },
    activePageInvoices() {
      const data = [];
      if (this.invoices.length) {
        const invoices = this.invoices.map(invoice => invoice.node);
        invoices.forEach((invoiceInfo) => {
          data.push(this.invoiceRowData(invoiceInfo));
        });
      }
      return data;
    },
  },
  methods: {
    previousPage() {
      const cursor = this.invoices[0].cursor;
      this.updateInvoiceQueryVariables(cursor, 'previous');
      if (!this.isFetching) {
        this.currentPageNum -= 1;
      }
    },
    nextPage() {
      const cursor = this.invoices[this.invoices.length - 1].cursor;
      this.updateInvoiceQueryVariables(cursor, 'next');
      if (!this.isFetching) {
        this.currentPageNum += 1;
      }
    },
    updateInvoiceQueryVariables(cursor, step) {
      this.last_limit = (step === 'previous') ? 10 : null;
      this.first_cursor = (step === 'previous') ? cursor : null;

      this.first_limit = (step === 'next') ? 10 : null;
      this.last_cursor = (step === 'next') ? cursor : null;
    },
    invoiceRowData(invoiceInfo) {
      const { id, shortId, amountKobo, createdAt, subscriptionType, endDate } = invoiceInfo;
      const invoiceDate = moment.unix(createdAt).format('MMMM D, YYYY');
      const invoiceEndDate = moment.unix(endDate).format('MMM D, YYYY');
      return {
        id,
        invoiceDate,
        shortId,
        amountKobo,
        subscriptionType,
        invoiceEndDate,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.invoice {
  &-summary {
    min-height: 30vh;
    &__none {
      padding: 2rem 0;
      font-weight: 300;
      line-height: 1.2;
      font-size: 1.2rem;
      margin: 0;
    }
  }
  @media screen and(min-width: 768px) {
    &-summary {
      min-height: 50rem;
      &__none {
        padding: 3rem 0;
        font-size: 1.4rem;
      }
    }
  }
}
.pagination-block {
  width: 10rem;
  float: right;
  padding-bottom: 0.9rem;
}
</style>
