<template>
  <section class="discount--code">
    <transition name="fade" mode="out-in">
      <discount-form v-if="createDiscount" :tickets="tickets" :codeType="codeType" :eventId="eventId" :endDate="endDate" @back="createDiscount = false" @createTicket="createTicket"/>
      <div v-else>
        <div class="no-discount" v-if="noDiscounts && hasPaidTicket">
          <p>there are currently no discounts for this event</p>
          <el-button type="primary" @click.prevent="$emit('create')">
            <span>create discount</span>
          </el-button>
        </div>
        <div class="no-discount" v-else-if="!hasPaidTicket">
          <p>
            <a @click="createTicket">no discounts created yet, create a paid ticket first so that you can create a discount</a>
          </p>
        </div>
        <discount-list v-else :tickets="tickets" :discounts="discounts" :eventId="eventId" :endDate="endDate" @create="$emit('create')" @createTicket="createTicket" @onUpdate="update" />
      </div>
    </transition>
  </section>
</template>

<script>
import FETCH_DISCOUNT_CODE from '@/graphql/FetchDiscountCode.gql';
import DiscountForm from './Form';
import DiscountList from './List';

export default {
  props: {
    tickets: Array,
    create: Boolean,
    codeType: String,
    eventId: String,
    endDate: [String, Number],
  },
  components: { DiscountForm, DiscountList },
  data() {
    return {
      discounts: [],
      createDiscount: this.create,
      showDiscountForm: false,
    };
  },
  apollo: {
    discounts: {
      query: FETCH_DISCOUNT_CODE,
      variables() {
        return {
          event: this.eventId,
        };
      },
      update: data => data.fetchDiscountCodes,
      fetchPolicy: 'network-only',
    },
  },
  computed: {
    noDiscounts() {
      return this.discounts.length === 0;
    },
    noTickets() {
      return this.tickets.length === 0;
    },
    hasPaidTicket() {
      return this.tickets.find(ticket => ticket.price !== '0.0') !== undefined;
    },
  },
  methods: {
    createTicket() {
      this.createDiscount = false;
      this.$emit('createTicket');
    },
    update() {
      this.$apollo.queries.discounts.refresh();
    },
  },
};
</script>

<style lang="scss" scoped>
.discount--code {
  padding: 2.3rem 5% 2.5rem;
}
.no-discount {
  padding-top: 3rem;
  height: 350px;
  font-weight: 300;
  font-size: 12px;
  line-height: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
    color: $secondary-color;
    font-weight: 300;
    font-size: 14px;
    text-align: center;
    margin-bottom: 4rem;
  }
}
</style>
