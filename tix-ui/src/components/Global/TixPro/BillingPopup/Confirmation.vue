<template>
  <div class="confirmation">
    <div class="confirmation-popup">
      <header class="confirmation-popup__header">
        <h3>magic! you are now on the tix pro plan</h3>
      </header>
      <div class="confirmation-popup__image">
        <img src="/static/images/tickets-booked.png">
      </div>
    </div>
  </div>
</template>

<script>
export default {
};
</script>

<style lang="scss" scoped>
.confirmation {
  min-height: 350px;
  margin: -6rem -2rem -3rem;
}
.confirmation-popup {
  display: flex;
  padding-top: 3rem;
  padding-bottom: 3rem;
  flex-direction: column;
  align-items: center;
  &__header {
    margin-bottom: 4rem;
  }
  &__image {
    height: 210px;
    img {
      height: 100%;
    }
  }
}
</style>
