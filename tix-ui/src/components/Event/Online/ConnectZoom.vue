<template>
  <div class="connect-zoom">
    <div class="connect-zoom__body">
      <div class="image">
        <img src="@/assets/zoom-logo.svg" alt="zoom logo">
      </div>
      <div class="content">
        <el-tooltip placement="right" content="this is a pro feature">
          <tix-pro-icon :width="12" :height="12"/>
        </el-tooltip>
        <p>how to use tix.africa and zoom</p>
        <div class="content__body">
          <span>automatically create zoom links for online events on tix</span>
          <span>automatically create zoom meetings at the same time a one on one event is scheduled</span>
          <span>instantly share unique conferencing details upon confirmation</span>
        </div>
        <p>requirements</p>
        <div class="content__body">
          <span>zoom pro account</span>
          <span>zoom admin privileges</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TixProIcon from '@/components/Global/Icons/TixProIcon';

export default {
  props: {
    eventId: String,
    slug: String,
  },
  components: { TixProIcon },
  data() {
    return {
      processing: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.connect-zoom {
  &__body {
    border-radius: 9px;
    display: flex;
    flex-direction: row;

    @media screen and (max-width: 767px){
      flex-direction: column;
      align-items: center;

      .image {
        margin-bottom: 2rem;

        img {
          width: 100%;
        }
      }

    }

    .image {
      height: 94px;
      margin-right: 5rem;

      img {
        height: 100%;
        width: 94px;
      }
    }

    .content {
      width: 70%;

      &__body {
        margin-bottom: 2rem;
        span {
          display: block;
          font-weight: 300;
          font-size: 12px;
          color: rgba(black, 0.8);
          margin-bottom: 0.75rem;
        }
      }

      p {
        font-weight: 300;
        font-size: 14px;
        margin-bottom: 0.75rem;
        color: black;
      }

      @media screen and (max-width: 767px){
        width: 100%;
      }
    }
  }
}
</style>
