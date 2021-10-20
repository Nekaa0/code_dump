<template>
  <div class="undo-downgrade">
    <h2 class="undo-downgrade__title">undo downgrade</h2>
    <p class="undo-downgrade__subtitle">
      this will undo your tix pro downgrade and restart your billing on your
      next charge date. would you like to continue?
    </p>
    <div class="undo-downgrade__cta">
      <button
        class="u-button u-button--medium u-button--grey"
        @click.prevent="goBack"
      >
        go back
      </button>
      <button
        class="u-button u-button--medium"
        @click.prevent="undoDowngrade"
      >
        <i v-if="processing" class="el-icon-loading"></i>
        <span v-else>yes</span>
      </button>
    </div>
  </div>
</template>

<script>
import ErrorHandler from '@/helpers/error-handler';
import UNDO_DOWNGRADE from '@/graphql/TixPro/UndoCancellation.gql';

export default {
  name: 'undo-downgrade',
  data() {
    return {
      processing: false,
    };
  },
  methods: {
    undoDowngrade() {
      this.processing = true;
      this.$apollo.mutate({
        mutation: UNDO_DOWNGRADE,
      }).then(() => {
        this.processing = false;
        this.$router.go();
        this.$message.success('you are now back on the pro plan');
      }).catch((error) => {
        this.processing = false;
        ErrorHandler.throwGraphQLError(error);
      });
    },
    goBack() {
      this.$emit('back');
    },
  },
};
</script>

<style lang="scss" scoped>
.undo-downgrade {
  position: relative;
  color: $--color-black;
  padding: 3rem 2.6rem 8.2rem;
  margin: -6rem -2rem -3rem;
  &__title {
    font-size: 1.6rem;
    margin-bottom: 1.9rem;
  }
  &__subtitle {
    font-size: 1.2rem;
    opacity: 0.8;
  }
  &__cta {
    position: absolute;
    right: 2.6rem;
    bottom: 3rem;
  }
  @media screen and (min-width: 768px) {
    padding: 2rem 2.5rem 7.4rem 1.9rem;
    margin: -6rem -3.2rem -3rem -2.1rem;
    max-width: 42rem;
    &__title {
      font-size: 1.8rem;
      margin-bottom: 1.7rem;
    }
    &__subtitle {
      font-size: 1.4rem;
    }
    &__cta {
      position: absolute;
      right: 2.1rem;
      bottom: 2rem;
    }
  }
}
.u-button {
  width: 8.7rem;
  &--grey {
    margin-right: 2.2rem;
  }
}
</style>
