<template>
  <div v-if="isProcessing" class="process">
    <i class="el-icon-loading"></i>
  </div>
</template>

<script>
import CREATE_ZOOM_ACCOUNT from '@/graphql/CreateZoomAccount.gql';
import ErrorHandler from '@/helpers/error-handler';

export default {
  name: 'oauth',
  event: '',
  isProcessing: false,
  beforeMount() {
    this.isProcessing = true;
  },
  mounted() {
    this.isProcessing = true;
    const code = this.$route.query.code;
    const eventSlug = this.$route.query.state;
    // const eventJsonState = JSON.parse(eventState);
    const zoomData = {
      eventSlug,
      code,
    };
    // const slug = eventJsonState.slug;
    this.$apollo.mutate({
      mutation: CREATE_ZOOM_ACCOUNT,
      variables: zoomData,
    }).then(() => {
      this.$router.push({
        name: 'CompleteZoom',
        params: { slug: eventSlug },
      });
    })
    .catch((error) => {
      ErrorHandler.throwGraphQLError(error);
    });
  },
};
</script>
<style lang="scss" scoped>
  .process {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    margin-top: 30rem;
  }
</style>
