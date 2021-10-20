<template>
  <div>
    <h2 class="billings-tab-plan__description">
      you have downgraded to the free plan
    </h2>
    <h2 class="billings-tab-plan__description">
      you have access to tix pro until {{ formatNextPaymentDate }}. changed your mind? 
      you can undo your downgrade <a @click.prevent="undoDowngrade" class="active-link">here</a>.
    </h2>
    <el-dialog
      width="420px"
      :visible.sync="openUndoDowngradePopup"
      :show-close="false"
    >
      <undo-downgrade @back="closeUndoDowngradePopup" />
    </el-dialog>
  </div>
</template>

<script>
import { Dialog } from 'element-ui';
import UndoDowngrade from '@/components/Global/TixPro/UndoDowngrade';
import { formatDate } from '@/helpers/utility';

export default {
  name: 'billing-downgrade',
  components: {
    ElDialog: Dialog,
    UndoDowngrade,
  },
  props: {
    nextPaymentDate: Number,
  },
  data() {
    return {
      openUndoDowngradePopup: false,
    };
  },
  computed: {
    formatNextPaymentDate() {
      return formatDate(this.nextPaymentDate);
    },
  },
  methods: {
    undoDowngrade() {
      this.openUndoDowngradePopup = true;
    },
    closeUndoDowngradePopup() {
      this.openUndoDowngradePopup = false;
    },
  },
};
</script>
