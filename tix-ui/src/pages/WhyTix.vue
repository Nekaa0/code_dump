<template>
  <div>
    <navigation></navigation>
    <main>
      <div>
        <el-row class="why-tix">
          <el-col class="why-tix__div__image" :xs="24" :sm="24" :md="12">
              <img class="why-tix__div__image_svg" src="@/assets/happy-customers.svg" alt="Tix Customers">
          </el-col>
          <el-col class="why-tix__content" :xs="24" :sm="24" :md="12">
            <why-tix :contents="contents" />
          </el-col>
        </el-row>
      </div>
    </main>
  </div>
</template>

<script>
import WhyTix from '@/components/WhyTix/WhyTix';

export default {
  components: {
    WhyTix,
  },
  data() {
    return {
      contents: [
        { title: 'set up is smooth and simple', detail: 'create a customizable page in less than 5 minutes' },
        { title: 'free to use for free events', detail: "we only make money if you're doing so too" },
        { title: 'great value', detail: 'for paid events, tix is great value and as a pro user, you have access to more tools to manage your event.' },
        { title: 'manage your event', detail: 'create multiple ticket types, get instant sale notifications, message guests with updates, check guests in with our mobile app on event day' },
        { title: 'specialized solutions', detail: 'for large and complex events, we offer tailored solutions to improve your ticketing operation' },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
  .why-tix {
    &__div__image {
      text-align: center;
      margin-top: 6.3em;
      @media screen and (max-width: 960px) {
        margin-top: 3em;
        padding-right: 2em;
        padding-left: 2em;
      }
    }
  }
</style>
