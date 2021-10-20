<template>
  <div>
    <el-dialog width="664px" :visible.sync="tixProBannerVisible" :append-to-body="true" :show-close="false" @close="$emit('closeBanner')">
      <banner-body :bannerInfo="$props" @closeBanner="$emit('closeBanner')"/>
    </el-dialog>
    <banner-body :bannerInfo="$props" v-if="isPhone && openMobileBannerView" @closeBanner="$emit('back')" />
  </div>
</template>

<script>
import { Dialog } from 'element-ui';
import BannerBody from './Banner';

export default {
  name: 'tix-pro-banner',
  props: {
    header: String,
    buttonText: String,
    openTixProBanner: Boolean,
    isPhone: Boolean,
    openMobileBannerView: Boolean,
  },
  components: {
    ElDialog: Dialog,
    BannerBody,
  },
  watch: {
    openTixProBanner(value) {
      this.tixProBannerVisible = value;
    },
  },
  data() {
    return {
      tixProBannerVisible: this.openTixProBanner,
    };
  },
};
</script>

<style lang="scss" scoped>

</style>
