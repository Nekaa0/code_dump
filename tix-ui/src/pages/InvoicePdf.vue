<template>
  <div>
    <vue-html2pdf
      :preview-modal="false"
      :pdf-quality="2"
      :manual-pagination="true"
      pdf-format="a4"
      pdf-orientation="portrait"
      pdf-content-width="100%"
      ref="html2Pdf"
      :filename="invoicePdfName"
    >
      <section slot="pdf-content">
        <div class="invoice">
          <p class="invoice-logo">
            tix.africa
          </p>
          <p class="invoice-details">invoice number: {{invoice.shortId}}
          <br>
            invoice date: {{invoice.invoiceDate}}
          </p>
          <p class="invoice-details">account name: {{username}}
          <br>
            account email: {{user.email}}
          </p>
          <div class="invoice-subscription__header">invoice details</div>
          <table cellpadding="0" cellspacing="0" border="0" width="100%" class="invoice-details__table">
            <thead
              class="invoice-details__table-head">
              <tr>
                <td>subscription type</td>
                <td>service period</td>
                <td>amount</td>
              </tr>
            </thead>
            <tbody>
              <tr class="invoice-details__table-body-row">
                <td>tix pro {{invoice.subscriptionType}}</td>
                <td>{{dateRange()}}</td>
                <td>{{amount(invoice.amountKobo)}}</td>
              </tr>
              <tr class="invoice-details__table-body-row invoice-details__table-body-row__total">
                <td></td>
                <td>invoice total</td>
                <td>{{amount(invoice.amountKobo)}}</td>
              </tr>
            </tbody>
          </table>
          <div class="invoice-footer">
            <p class="invoice-footer__para">
              This invoice has been charged to the card on file.
            </p>
            <p class="invoice-footer__para">If you have any questions, please contact us at support@tix.africa.</p>
            
            <p class="invoice-footer__para">Thank you for your business!</p>
          </div>
        </div>
      </section>
    </vue-html2pdf>
  </div>
</template>

<script>
import VueHtml2pdf from 'vue-html2pdf';
import Auth from '@/helpers/auth';
import { formatKoboToActualValue, formatToMoney } from '@/helpers/utility';

export default {
  name: 'invoice-pdf',
  props: {
    invoice: Object,
  },
  components: {
    VueHtml2pdf,
  },
  data() {
    return {
      user: Auth.currentUser,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.generateInvoicePdf();
    });
  },
  computed: {
    username() {
      return `${this.user.firstName} ${this.user.lastName}`.trim();
    },
    invoicePdfName() {
      return `tix-${this.invoice.subscriptionType}-subscription-${this.invoice.shortId}`;
    },
  },
  methods: {
    generateInvoicePdf() {
      this.$refs.html2Pdf.generatePdf();
      this.$emit('reset-invoice-data');
      this.$destroy();
    },
    amount(amount) {
      const value = formatKoboToActualValue(amount);
      return formatToMoney(value, `${Auth.userCurrency()}`, 2);
    },
    dateRange() {
      const { invoiceDate, invoiceEndDate } = this.invoice;
      const endDateArray = invoiceEndDate.split(',');
      const invoiceDateArray = invoiceDate.split(',');
      if (endDateArray[1] !== invoiceDateArray[1]) {
        const date = `${invoiceDate} - ${invoiceEndDate}`;
        return date;
      }
      const date = `${invoiceDateArray[0]} - ${endDateArray[0]}, ${endDateArray[1]}`;
      return date;
    },
  },
};
</script>

<style lang="scss" scoped>
  .invoice {
    margin: 0 auto;
    text-transform: lowercase;
    margin-top: 4.4rem;
    &-logo {
      font-size: 2.4rem;
      font-weight: 400;
      color: $color-orange;
      line-height: 3.3rem;
      padding-bottom: 4px;
    }
    &-logo, &-account, &-subscription__header {
      margin-left: 4rem;
    }
    &-details {
      margin: 5rem 0 5rem 4rem;
      font-size: 1.4rem;
      font-weight: 300;
      @media screen and (max-width: 767px) {
        font-size: 1.4rem;
        font-weight: 300;
      }
    }
    &-subscription__header {
      font-size: 1.6rem;
      font-weight: 400;
      line-height: 1.9rem;
    }
    &-details {
      &__account {
        margin: 0; 
        line-height: 1.7rem;
      }
      &__para {
        font-size: 1.4rem;
        font-weight: 300;
      }
      &__table {
        border-collapse: collapse;
        font-weight: 400;
        line-height: 1.7rem;
        margin-top: 2.5rem;
        &-head {
          height: 3.4rem;
          background-color: rgba(252, 100, 53, 0.3);
          tr {
            font-size: 1.4rem;
            font-weight: 400;
            td {
              line-height: 1.7rem;
              padding: 0.9rem 0 0.8rem;
              &:first-child {
                padding-left: 4rem;
              }
            }
          }
        }
        &-body-row {
          margin: 1.2rem 0 0 3rem;
          padding: 0 4rem;
          font-size: 1.2rem;
          font-weight: 300;
          &__total {
            font-size: 1.4rem;
            font-weight: 400;
            height: 3.4rem;
            background-color: rgba(252, 100, 53, 0.3);
          }
        }
      }
    }
    &-footer {
      margin-top: 10rem;
      margin-left: 4rem;
      &__para {
        font-weight: 300;
        font-size: 1.2rem;
        @media screen and (max-width: 767px) {
          font-size: 1.2rem;
          font-weight: 300;
        }
        margin: 0;
        &:nth-of-type(2) {
          margin: 1.5rem 0;
        }
      }
    }
  }
  td:first-child {
    padding-left: 4rem;
    padding-right: 0;
  }
  tbody tr:first-child td {
    padding-top: 1.2rem;
    padding-bottom: 3rem;
  }
  td:last-child {
    padding-right: 4rem;
  }
</style>
