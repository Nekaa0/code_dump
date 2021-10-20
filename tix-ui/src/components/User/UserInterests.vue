<template>
  <div>
    <h2 class="interests--card-text">select up to three interests that describe the events you organize</h2>
    <div class="interests--card">
      <el-button class="interests--card__button" @click="clicked(index)" :class="{'active': displaySelectedInterests(index)}"
        v-for="(interest, index) in interests" :key="index">
      {{interest}}
      </el-button>
    </div>
    <button
      class="u-button"
      native-type="submit"
      type="primary"
      :class="{ 'u-button--disabled': processing }"
      @click.prevent="submitInterests">
      <i v-if="processing" class="el-icon-loading"></i>
      <span v-else>save</span>
    </button>
  </div>
</template>

<script>
/* eslint-disable */
import FETCH_INTERESTS from '@/graphql/FetchInterests.gql';
import CREATE_UPDATE_INTERESTS from '@/graphql/CreateUpdateInterest.gql';
import ErrorHandler from '@/helpers/error-handler';
import Auth from '@/helpers/auth';
import { pick, some, remove } from 'lodash';

export default {
  name: 'user-interests',
  data() {
    function formatInterests(interests) {
      const formatInterests = interests.map(interest => _.pick(interest, [ 'name' ]));
      return formatInterests;
    }

    return {
      processing: false,
      interests: [],
      isSelected: [],
      selectedInterests: formatInterests(Auth.currentUser.interests.slice()),
    };
  },
  apollo: {
    interests: {
      query: FETCH_INTERESTS,
      update: data => data.interests.map(interest => interest.name),
    },
  },
  methods: {
    clicked(index) {
      this.$set(this.isSelected, index, !this.isSelected[index]);
      const formattedInterests = JSON.parse(JSON.stringify(this.selectedInterests));
      const exists = _.some(formattedInterests, { name: this.interests[index] });

      if (!exists) {
        if (this.selectedInterests.length === 3) {
          return this.$message.error('select a maximum of 3 interests');
        }
        this.selectedInterests.push({ name: this.interests[index] });
      } else {
         _.remove(this.selectedInterests, { name: this.interests[index] });
      }
    },
    displaySelectedInterests(index) {
      const formattedInterests = JSON.parse(JSON.stringify(this.selectedInterests));
      const interestsExists = _.some(formattedInterests, { name: this.interests[index] });
      const selected = this.isSelected[index] === true;

      if(selected && !interestsExists) {
        return false;
      };
      if (interestsExists || selected) {
        return true;
      } else {
        return false;
      }
    },
    submitInterests() {
      if (this.selectedInterests.length < 1) {
        return this.$message.error('select a minimum of 1 interest');
      }
      if (this.selectedInterests.length > 3) {
        return this.$message.error('select a maximum of 3 interests');
      }
      if (this.selectedInterests.length < 4) {
        this.processing = true;
        return this.$apollo.mutate({
          mutation: CREATE_UPDATE_INTERESTS,
          variables: { interestChoices: this.selectedInterests },
        }).then(() => {
          this.$message.success('your interests are saved');
        }).catch((error) => {
          ErrorHandler.throwGraphQLError(error);
        });
      }
      return this.$message.error('Please review the errors and try again');
    },
  },
};
</script>

<style lang="scss" scoped>
  .interests--card {
    padding: 1.875em 1em 0.875em;
    border-radius: 9px;
    margin-bottom: 2rem;
    background-color: rgba(0,136,151,0.05);
    @media screen and (min-width: 1360px) {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-evenly;
    }
    &-text {
      margin-bottom: 1rem;
      @media screen and (min-width: 768px) {
        font-size: 1.8rem;
      }
    }
    &__button  {
      background-color: rgba(255,255,255,0.5);
      border: 1px solid rgba(0,0,0,0.5);
      border-radius: 9px;
      padding: 0.5625em 1.25em;
      margin: 0 0.375em 1em;
      opacity: 0.7;

      &.active {
        background-color: #FCEFEC;
        color: $color-orange;
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
