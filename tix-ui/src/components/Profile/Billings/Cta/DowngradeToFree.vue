<template>
  <div>
    <button
      class="u-button billings-cta"
      @click.prevent="downgradeToFree"
      :class="{ 'disable-button': downgradedUser }"
    >
      downgrade to free
    </button>
    <el-dialog
      width="420px"
      :visible.sync="openCancellationPopup"
      :show-close="false"
    >
      <cancellation-popup :nextPaymentDate="nextPaymentDate" @back="closeCancellationPopup"/>
    </el-dialog>
  </div>
</template>

<script>
import SubscriptionPlan from '@/mixins/SubscriptionPlan';
import { Dialog } from 'element-ui';
import CancellationPopup from '@/components/Global/TixPro/Cancellation';

export default {
  name: 'downgrade-to-pro',
  components: {
    ElDialog: Dialog,
    CancellationPopup,
  },
  mixins: [SubscriptionPlan],
  props: {
    nextPaymentDate: Number,
  },
  data() {
    return {
      openCancellationPopup: false,
    };
  },
  methods: {
    downgradeToFree() {
      this.openCancellationPopup = true;
    },
    closeCancellationPopup() {
      this.openCancellationPopup = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.billings {
  &-cta {
    background-color: $--color-black;
  }
}
.disable-button {
  cursor: auto;
  opacity: 0.5;
  pointer-events: none;
}
</style>
