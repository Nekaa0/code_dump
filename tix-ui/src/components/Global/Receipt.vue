<template>
  <div class="receipt" :id="domId">
    <div class="receipt__header">
      <div class="receipt__logo">
        <img src="@/assets/logo.svg" alt="Tix Logo">
        <div class="receipt__download" v-if="showDownload">
          <el-button @click.prevent="$emit('download')" :disabled="downloading" size="small">
            <i class="el-icon-download"></i> download
          </el-button>
        </div>
      </div>
      <div class="receipt__label">
        receipt for order {{ shortId }} <span v-if="eventName">to <b>{{ eventName }}</b></span>
      </div>
      <div class="receipt__summary">
        <div v-for="ticket in ticketsInfo" :key="ticket.id">
          <div class="receipt__summary__item">
            <span class="receipt__summary__item__label"><b>{{ ticket.quantityOrdered }}</b> * {{ ticket.ticket.name }}</span>
            <span class="receipt__summary__item__price">
              <span v-if="ticket.priceOrdered > 0">{{ ticket.priceOrdered | currency(currency, 0, { spaceBetweenAmountAndSymbol: true }) }}</span>
              <span v-else>free</span>
            </span>
          </div>
        </div>
        <div class="receipt__summary__item receipt__summary__item--total">
          <span class="receipt__summary__item__label">Total</span>
          <span class="receipt__summary__item__price">
            <span v-if="price > 0">{{ price | currency(currency, 0, { spaceBetweenAmountAndSymbol: true }) }}</span>
            <span v-else>free</span>
          </span>
        </div>
      </div>
    </div>

    <div v-for="(ticket, index) in combinedTickets()" :key="index">
      <p class="receipt__index" v-if="combinedTickets().length > 1">{{ index + 1 }}.</p>
      <div class="receipt__ocr">
        <!-- <div class="receipt__qr-code">
           {{qrCodeNos[index]}}
          <div class="receipt__qr" v-html="qrCodes[index]"></div>
        </div> -->
        <div class="receipt__info">
          <p>name <br> <b>{{ buyerLastName }} {{ buyerFirstName }}</b></p>
          <p>your email <br> <b>{{ buyerEmail }}</b></p>
          <p>your phone number <br> <b>{{ buyerPhoneNumber }}</b></p>
          <p>purchased on <br> <b>{{ purchaseDate }}</b></p>
          <p>ticket type <br> <b>{{ ticket.ticket.name }}</b></p>
          <p v-if="paidWith">paid with <br> <b>{{ paidWith.card_type | capitalize }} {{ paidWith.last4 }}</b></p>
        </div>
      </div>
    </div>
    <div class="receipt__footer" v-if="owner">
      <p>
        have any questions about your ticket?
        please contact the organizer {{ owner.firstName }} at <a :href="`mailto:${owner.email}`">{{ owner.email }}</a>
      </p>
    </div>
    <div class="receipt__spacer">
      &nbsp;
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import Capitalize from '@/mixins/Capitalize';

export default {
  name: 'receipt',
  mixins: [Capitalize],
  props: {
    id: String,
    shortId: String,
    domId: String,
    status: String,
    quantity: [Number, String],
    buyerEmail: String,
    buyerFirstName: String,
    buyerLastName: String,
    buyerPhoneNumber: String,
    price: [Number, String],
    tickets: Object,
    eventName: String,
    owner: Object,
    qrCodes: Array,
    qrCodeNos: Array,
    createdAt: [Number, String],
    showDownload: {
      type: Boolean,
      default: true,
    },
    downloading: Boolean,
    cardDetails: String,
    ticketsInfo: Array,
    event: Object,
    currency: String,
  },
  computed: {
    purchaseDate() {
      return moment.unix(this.createdAt).format('MMM DD, YYYY');
    },
    paidWith() {
      try {
        return JSON.parse(this.cardDetails);
      } catch (e) {
        return '';
      }
    },
  },
  methods: {
    combinedTickets() {
      const combinedTickets = [];
      this.ticketsInfo.forEach((ticket) => {
        Array.from({ length: ticket.quantityOrdered }, (v, k) => k + 1).forEach(() => {
          combinedTickets.push(ticket);
        });
      });
      return combinedTickets;
    },
  },
};
</script>

<style lang="scss" scoped>
.receipt {
  background: white;
  border: dashed rgba($color: #000000, $alpha: 0.17);
  border-width: 1px 0 0;
  position: relative;
  &__index {
    padding: 30px 20px 20px;
  }
  &__header {
    padding: 30px 20px 20px;
  }
  &__download {
    float: right;
    transform: translateY(-4px);
  }
  &__ocr {
    padding: 40px 20px;
    align-items: center;
    background: whitesmoke;
    @media screen and (min-width: 960px) {
      display: flex;
      padding: 40px;
    }
  }
  &__qr {
    width: 165px;
    margin-bottom: 20px;
    @media screen and (min-width: 960px) {
      margin-right: 40px;
      margin-bottom: 0;
    }
    &-code {
      display: flex;
      flex-direction: column;
    }
  }
  &__info {
    flex: 1;
    font-size: 1.6rem;
    p {
      margin: 0 0 10px;
    }
  }
  &__label {
    margin: 20px 0;
  }
  &__summary {
    margin: 30px 0 0;
    &__item {
      padding: 20px 0;
      border: dashed 1px rgba($color: #000000, $alpha: 0.07);
      border-width: 1px 0;
      display: flex;
      &:last-child {
        border: none;
        font-weight: bold;
      }
      b {
        font-weight: 600;
      }
      &__label {
        flex: 1;
      }
      &__price {
        margin-left: 50px;
      }
      &--total {
        font-size: 1.7rem;
      }
    }
  }
  &__footer {
    padding: 30px 20px;
    width: 100%;
    p {
      margin: 0;
      line-height: 1.4;
    }
    a {
      text-decoration: underline;
    }
    b {
      font-weight: 600;
    }
  }
}
</style>

