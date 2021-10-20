<template>
  <section>
    <cart-step :step="cartStep" @cancel="back" />
    <cart-header title="checkout" message="success" :image="image" />
    <div class="receipts">
      <div class="receipt-frame">
        <div class="receipts__summary">
          <p>hi {{ buyerFirstName }},</p>
          <p>your order was successful.</p>
          <p>We've also sent a copy to your email address at {{ buyerEmail }}.</p>
          <el-row class="mt-4">
            <el-button type="default" @click.prevent="downloadPNG" :loading="downloading">
              <span>download</span>
            </el-button>
            <el-button type="primary" @click.prevent="$emit('newOrder')">
              <span>buy again</span>
            </el-button>
          </el-row>
        </div>
      </div>
      <!-- <div class="receipt-frame">
        <receipt v-bind="visibleReceiptData" @download="downloadPNG" />
      </div> -->
      <div class="receipt-frame receipt-frame--downloadable" v-if="downloading">
        <receipt v-bind="downloadableReceiptData" :event="event" :currency="currency" />
      </div>
    </div>
  </section>
</template>

<script>
import * as download from 'downloadjs';
import html2canvas from 'html2canvas';
import Receipt from '@/components/Global/Receipt';
import CartHeader from '@/components/Cart/CartHeader';
import CartStep from '@/components/Cart/CartStep';

export default {
  name: 'order-complete',
  props: {
    id: String,
    shortId: String,
    status: String,
    quantity: [Number, String],
    buyerEmail: String,
    buyerFirstName: String,
    buyerLastName: String,
    buyerPhoneNumber: String,
    price: [Number, String],
    ticketSchedules: Object,
    qrCodes: Array,
    qrCodeNos: Array,
    createdAt: [Number, String],
    event: Object,
    cardDetails: String,
    windowWidth: Number,
    onlyFreeTickets: Boolean,
    currency: String,
  },
  components: {
    Receipt,
    CartHeader,
    CartStep,
  },
  created() {
    if (this.windowWidth <= this.mobileBreakpoint) {
      this.image = 'happy_fila.png';
    }
    this.cartStep = {
      title: 'order complete',
      current: 3,
      total: 3,
      hasMargin: false,
      showStep: true,
    };
    if (this.onlyFreeTickets) {
      this.cartStep.showStep = false;
    }
  },
  data() {
    return {
      downloading: false,
      cartStep: {},
      image: 'happy_fila1.png',
      mobileBreakpoint: 480,
      symbolSpace: false,
    };
  },
  computed: {
    confirmationMessage() {
      return `your receipt is right below. we've sent a copy to your email address at ${this.buyerEmail}.`;
    },
    visibleReceiptData() {
      return Object.assign({
        downloading: this.downloading,
        ticketsInfo: this.ticketSchedules.edges.map(value => value.node),
        owner: this.event.owner,
      }, this.$props);
    },
    downloadableReceiptData() {
      return Object.assign({
        domId: 'downloadableReceipt',
        showDownload: false,
        ticketsInfo: this.ticketSchedules.edges.map(value => value.node),
        eventName: this.event.title,
        owner: this.event.owner,
      }, this.$props);
    },
    ticketsPurchased() {
      return this.ticketSchedules.edges.map(value => value.node);
    },
  },
  methods: {
    downloadPNG() {
      this.downloading = true;
      setTimeout(() => {
        const node = document.getElementById('downloadableReceipt');
        html2canvas(node).then((canvas) => {
          download(canvas.toDataURL(), `receipt-${this.shortId}.png`);
        }).then(() => {
          this.downloading = false;
        }).catch(() => {
          this.downloading = false;
        });
      }, 1000);
    },
    back() {
      this.$emit('back');
    },
  },
  watch: {
    windowWidth(val) {
      if (val > this.mobileBreakpoint) {
        this.image = 'happy_fila1.png';
        this.symbolSpace = true;
      } else {
        this.image = 'happy_fila.png';
        this.symbolSpace = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.receipts {
  position: relative;
  padding: 0 5rem;

  &__summary {
    position: relative;
    background: white;
    min-height: 75vh;
    p {
      font-size: 14px;
      font-weight: 300;
      margin-bottom: 1.5rem;
      text-transform: lowercase;
    }
    &--item {
      border-bottom: 1px solid rgba($color-orange, 0.4);
      padding: 20px 0;
    }
    &--item, &--total {
      margin: 0 0 20px;
      font-weight: 300;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      @media screen and (max-width: 480px) {
        font-size: 12px;
      }
    }
    &--total {
      margin-bottom: 80px;
    }
  }
}
.receipt-frame {
  position: relative;
  &--downloadable {
    position: absolute;
    width: 100%;
    z-index: -1;
    top: 0;
    left: 0;
    padding: 0 5rem;
  }
}
.mt-4 {
  margin-top: 4rem;
}
</style>
