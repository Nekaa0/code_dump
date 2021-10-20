<template>
  <div>
    <button
      class="u-button billings-cta"
      @click.prevent="upgradeTopro"
    >
      upgrade to pro
    </button>
    <el-dialog width="664px" 
      :visible.sync="openBillingPopup"
      >
        <billing-popup :isPhone="isPhone" />
    </el-dialog>
    <transition name="fade">
      <billing-popup v-if="isPhone && openMobileBillingView" :isPhone="isPhone"  @back="openMobileBillingView = false" />
    </transition>
  </div>
</template>

<script>
import { Dialog } from 'element-ui';
import IsPhone from '@/mixins/IsPhone';
import BillingPopup from '@/components/Global/TixPro/BillingPopup/Index';

export default {
  name: 'upgrade-to-pro',
  components: {
    ElDialog: Dialog,
    BillingPopup,
  },
  mixins: [IsPhone],
  data() {
    return {
      openBillingPopup: false,
      openMobileBillingView: false,
    };
  },
  methods: {
    upgradeTopro() {
      if (!this.isPhone) {
        this.openBillingPopup = true;
      } else {
        this.openMobileBillingView = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.billings {
  &-cta {
    background-color: $color-orange;
  }
}
</style>
