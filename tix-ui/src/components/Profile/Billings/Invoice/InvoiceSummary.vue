<template>
  <div>
    <div v-if="isFetching || invoiceHistory.length">
      <table class="invoices-table">
        <thead>
          <tr>
            <th
              v-for="(header, index) in tableHeaders"
              :key="index"
              class="invoices-header"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody v-if="isFetching">
          <tr
            class="invoices-row"
            v-for="(data, index) in 10"
            :key="index"
          >
            <td
              class="skeleton"
              v-for="(data, index) in 4"
              :key="index"
            >
              <div
                class="skeleton-animation"
                :class="{ 'hide-on-sm': index === 3 }"
              ></div>
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="invoiceHistory.length">
          <tr
            class="invoices-row"
            v-for="(invoiceData, index) in invoiceHistory"
            :key="index"
          >
            <td class="invoices-row__cell">
              {{ invoiceData.invoiceDate }}
            </td>
            <td class="hide-on-sm invoices-row__cell">
              {{ invoiceData.shortId }}
            </td>
            <td class="invoices-row__cell">
              {{ amount(invoiceData.amountKobo) }}
            </td>
            <td class="invoices-row__cell">
              <button
                @click.prevent="downloadInvoicePdf(invoiceData)"
                class="hide-btn-style"
              >
                <download-icon />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else></div>
    <invoice-pdf
      :invoice="invoice"
      v-if="invoice"
      @reset-invoice-data="invoice = null"
    />
  </div>
</template>

<script>
import InvoicePdf from '@/pages/InvoicePdf';
import { formatKoboToActualValue, formatToMoney } from '@/helpers/utility';
import DownloadIcon from '@/components/Global/Icons/DownloadIcon';
import Auth from '@/helpers/auth';

export default {
  name: 'invoice-summary',
  components: {
    InvoicePdf,
    DownloadIcon,
  },
  props: {
    invoiceHistory: {
      type: Array,
      required: true,
      default: [],
    },
    isFetching: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      tableHeaders: [
        'invoice date',
        'invoice id',
        'amount',
        'download invoice',
      ],
      invoice: null,
    };
  },
  methods: {
    downloadInvoicePdf(invoiceData) {
      this.invoice = invoiceData;
    },
    amount(amount) {
      const value = formatKoboToActualValue(amount);
      return formatToMoney(value, `${Auth.userCurrency()}`, 2);
    },
  },
  created() {
    this.tableHeaders[3] = window.innerWidth <= 767 ? 'download' : 'download invoice';
  },
};
</script>

<style lang="scss" scoped>
.invoices {
  &-header {
    font-size: 1.4rem;
    font-weight: 300;
    padding-bottom: 0.9rem;
    width: 25%;
    &:nth-of-type(2) {
      padding-left: 1.5rem;
    }
    &:nth-of-type(3) {
      padding-left: 0.5rem;
    }
    &:nth-of-type(4) {
      text-align: right;
    }
    @media screen and (max-width: 767px) {
      padding-bottom: 0px;
      font-size: 1.3rem;
      &:nth-of-type(2) {
        display: none;
      }
      width: 33.3%;
      &:nth-of-type(3) {
        padding-left: 3rem;
      }
    }
  }
  &-table {
    width: 100%;
    text-align: left;
    line-height: 1.2;
    font-weight: 300;
    border-collapse: separate;
    border-spacing: 0 0.6rem;
  }
  &-row {
    background-color: $--color-pale-cyan;
    margin-bottom: 0.6rem;
    text-transform: lowercase;
    &__cell {
      font-size: 1.2rem;
      line-height: 1.2;
      padding: 0.9rem 0;
      width: 25%;
      color: rgba($color: $--color-black, $alpha: 0.9);
      @media screen and (max-width: 767px) {
        font-size: 1rem;
      }
      &:first-child {
        padding-left: 1.5rem;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      &:nth-child(2) {
        padding-left: 2rem;
      }
      &:nth-child(3) {
        padding-left: 0.5rem;
        @media screen and (max-width: 767px) {
          padding-left: 2rem;
        }
      }
      &:last-child {
        padding-left: 5rem;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        @media screen and (min-width: 768px) {
          padding-right: 4rem;
          text-align: right;
          padding-left: 0;
        }
      }
    }
  }
}
.skeleton {
  height: 4rem;
  @media screen and (max-width: 767px) {
    padding-left: 2rem;
  }
  &:first-child {
    padding-left: 1.5rem;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  &:last-child {
    padding-left: 2rem;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    @media screen and (max-width: 767px) {
      padding-left: 0;
    }
  }
  &-animation {
    width: 6rem;
    height: 1.6rem;
    @media screen and (min-width: 768px) {
      width: 12rem;
    }
  }
}
@media screen and (max-width: 767px) {
  .hide-on-sm {
    display: none;
  }
  .hide-btn-style {
    svg {
      height: 2rem;
      width: 2rem;
    }
  }
}
.hide-btn-style {
  border: none;
  background: transparent;
  cursor: pointer;
}
</style>
