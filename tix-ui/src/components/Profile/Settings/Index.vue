<template>
  <div class="settings">
    <div class="settings__form--section">
      <div class="settings__form--section__header">
        <form-header subtitle="order notifications" />
        <div class="horizontal--line">
        </div>
      </div>
        <order class="order" />
      <div class="settings__form--section__header">
        <form-header subtitle="payment settings" />
        <div class="horizontal--line">
        </div>
      </div>
        <payment />
    </div>
  </div>
</template>

<script>
import FormHeader from '@/components/Global/FormHeader';
import Payment from '@/components/Profile/Settings/Payment';
import Order from '@/components/Profile/Settings/Order';

export default {
  name: 'SettingsSection',
  components: {
    FormHeader,
    Payment,
    Order,
  },
};
</script>

<style lang="scss">
.el-form-item__label {
  margin-bottom: 1.5rem;
  @media screen and (max-width: 767px) {
    font-size: 1rem;
  }
}
.el-radio__inner {
  border-radius: 4px;
}
.el-radio {
  white-space: normal;
}
.el-radio__label {
  font-size: 1.2rem;
  padding-left: 1.6rem;
  color: $--color-black;
  @media screen and (max-width: 767px) {
    font-size: 1rem;
    padding-left: 1rem;
    line-height: 1.4;
  }
}
</style>

<style lang="scss" scoped>
  .settings {
    padding-top: 2.3rem;
    max-width: 70rem;
    @media screen and (max-width: 767px) {
      max-width: 40rem;
      padding: 0;
    }
    &__form {
      width: 100%;
      margin: 0 auto;
      &--header {
        padding-bottom: 3.5rem;
      }
    &--section {
      &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 2rem;
        @media screen and (max-width: 767px) {
          width: max-content; 
          padding-bottom: 0.5em;
          margin-bottom: 1.25em;
          border-bottom: 1px solid $--color-green;
        }
      }
    }
  }
  .horizontal--line {
    height: 1px;
    width: 68%;
    background-color: $--color-green;
    @media screen and (max-width: 767px) {
      display: none;
    }
  }
}
.order {
  margin-bottom: 4rem;
}
</style>
