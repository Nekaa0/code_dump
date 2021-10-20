<template>
  <div>
    <div class="no--events">
      <img src="@/assets/no-events-icon.svg" alt="no events icon">
      <h1 class="no--events__title">you currently do not have any upcoming events.</h1>
      <h2 class="no--events__subtitle" @click="$router.push({ name: 'NewEvent' })">create an event to change this</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoEventsView',
};
</script>

<style lang="scss" scoped>
  .no--events {
    text-align: center;
    margin: 7em auto 0;
    &__title {
      opacity: 0.5;
      width: 37.5rem;
      margin: 1.8rem auto 1.5rem;
      @media screen and (max-width: 960px) {
        width: 20rem;
      }
    }
    &__subtitle {
      color: $--color-green;
      cursor: pointer;
   
      &:hover {
        color: #026f7c;
        font-weight: 400;
      }
    }
  }
</style>
