<template>
  <div>
    <transition name="fade" mode="out-in">
      <discount-form v-if="editDiscount" :edit="true" :discount="discount" :tickets="tickets" :eventId="eventId" :endDate="endDate" @back="editDiscount = false" @createTicket="createTicket" />
      <div v-else>
        <discount-preview v-for="(option, index) in discounts" :key="index" v-bind="option" @edit="edit(option)" @delete="deleteDiscount(option)" @onUpdate="$emit('onUpdate')" />
        <div class="create--discount">
          <p>create discount</p>
          <button class="create--discount__button" @click="createDiscount">
            <span>+</span>
            <el-tooltip content="this is a tix pro feature" placement="right">
              <tix-pro-icon :width="14" :height="14" v-if="showProIcon"/>
            </el-tooltip>
          </button>
        </div>
      </div>
    </transition>
    <tix-pro-banner
      :header="tixProBannerHeader"
      :buttonText="tixProBannerButtonText"
      :openTixProBanner="openTixProBanner"
      :openMobileBannerView="openMobileBannerView"
      :isPhone="isPhone"
      @back="openMobileBannerView = false"
      @closeBanner="openTixProBanner = false"
    />
  </div>
</template>

<script>
import DELETE_DISCOUNT from '@/graphql/DeleteDiscount.gql';
import ErrorHandler from '@/helpers/error-handler';
import IsPhone from '@/mixins/IsPhone';
import SubscriptionPlan from '@/mixins/SubscriptionPlan';
import TixProIcon from '@/components/Global/Icons/TixProIcon';
import TixProBanner from '@/components/Global/TixPro/Banner/Index';
import DiscountPreview from './Preview';
import DiscountForm from './Form';

export default {
  mixins: [IsPhone, SubscriptionPlan],
  components: {
    DiscountPreview,
    DiscountForm,
    TixProIcon,
    TixProBanner,
  },
  props: {
    discounts: Array,
    tickets: Array,
    eventId: String,
    endDate: [String, Number],
  },
  data() {
    return {
      editDiscount: false,
      discount: {},
      openTixProBanner: false,
      openMobileBannerView: false,
      tixProBannerHeader: 'upgrade to add extra discount codes',
      tixProBannerButtonText: 'upgrade to add extra discount codes',
    };
  },
  computed: {
    showProIcon() {
      return this.discounts.length > 0;
    },
  },
  methods: {
    createTicket() {
      this.editDiscount = false;
      this.$emit('createTicket');
    },
    edit(val) {
      this.discount = Object.assign({}, val);
      this.editDiscount = true;
    },
    createDiscount() {
      if (this.showProIcon && this.freePlan) {
        this.openProBanner();
      } else this.$emit('create');
    },
    openProBanner() {
      if (!this.isPhone) {
        this.openTixProBanner = true;
      } else {
        this.openMobileBannerView = true;
      }
    },
    deleteDiscount(val) {
      if (val.discountUsage > 0) {
        this.$message.error('you cannot delete this discount code because you already have orders for it');
        return;
      }
      const deleteWarningMessage = 'this will permanently delete this discount code and it will no longer be available for purchase. would you like to continue with this action?';
      this.$confirm(deleteWarningMessage, 'confirm delete', {
        confirmButtonText: 'yes, delete',
        cancelButtonText: 'cancel',
      }).then(() => {
        this.$apollo.mutate({
          mutation: DELETE_DISCOUNT,
          variables: { id: val.id },
        }).then(() => {
          this.$message.success(`discount ${val.code} has been successfully deleted`);
          this.$emit('onUpdate');
        }).catch((error) => {
          ErrorHandler.throwGraphQLError(error);
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.create--discount {
    height: 9.8rem;
    display: flex;
    align-items: center;
    width: 100%;
    border: 1px dashed $--color-green;
    border-radius: 4px;
    margin-top: 2.1rem;
    p {
      flex: 1;
      opacity: 0.3;
      line-height: 1.2;
      font-weight: 300;
      padding: 3.7%;
    }
    &__button {
      width: 10.5rem;
      float: right;
      height: 100%;
      border: none;
      background-color: $--color-pale-cyan;
      font-size: 4rem;
      line-height: 1.2;
      font-weight: 300;
      color: $--color-green;
      cursor: pointer;
      outline: none;
      display: flex;
      justify-content: center;
      align-items: center;

      svg {
        margin-top: 0.5rem;
        margin-left: 0.5rem;
      }
    }
  }
</style>
