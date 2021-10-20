<template>
  <section>
    <navigation></navigation>
    <main>
      <div class="not-found">
        <empty-state title="awww! don’t cry" instruction="we couldn’t find that name on the guest list, let’s take you back to the main entrance."
          button-text="home" target-route="Home" />
      </div>
    </main>
  </section>
</template>

<script>
import EmptyState from '@/components/Global/EmptyState';

export default {
  components: {
    EmptyState,
  },
};
</script>

<style lang="scss" scoped>
  .not-found {
    margin: 10% 13.8% 0 9.6%;
  }
</style>
