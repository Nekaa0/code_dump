<template>
  <div>
    <h2 class="categories--card-text">select up to three categories that describe the events you organize</h2>
    <div class="categories--card">
      <el-button class="categories--card__button" v-for="(category, index) in categories" :key="index">{{category}}</el-button>
    </div>
    <el-button class="u-button" native-type="submit" type="primary" size="medium" :loading="processing" @click.prevent="update">
      save
    </el-button>
  </div>
</template>

<script>
import FETCH_CATEGORIES from '@/graphql/FetchCategories.gql';

export default {
  name: 'user-categories',
  data() {
    return {
      processing: false,
      categories: [],
    };
  },
  apollo: {
    categories: {
      query: FETCH_CATEGORIES,
      update: data => data.categories.map(category => category.name),
    },
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
  .categories--card {
    padding: 1.875em 1em 0.875em;
    border-radius: 9px;
    margin-bottom: 1.75em;
    background-color: rgba(0,136,151,0.05);
    @media screen and (min-width: 1360px) {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-evenly;
    } 
    &-text {
      font-size: 1.125em;
      font-weight: 300;
      margin-bottom: 1rem;
    }
    &__button {
      background-color: rgba(255,255,255,0.5);
      border: 1px solid rgba(0,0,0,0.5);
      border-radius: 9px;
      padding: 0.5625em 1.25em;
      margin: 0 0.375em 1em;
      opacity: 0.7;
      &:focus {
        background-color: #FCEFEC;
        border: 1px solid $--color-pink;
          span {
            color: $color-orange;
          }
      }
      @media screen and (min-width: 1360px) {
        &:last-of-type {
          margin-left: -1.5625em;
        }
      }       
    }
  }
</style>
