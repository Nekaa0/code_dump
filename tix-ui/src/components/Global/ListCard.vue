<template>
  <div class="list-card" :class="{ 'list-card--is-inactive': inactive }">
    <div class="list-card__body">
      <div class="list-card__status" v-if="!hideStatus">
        <a @click.prevent="$emit('toggleStatus')" ><i class="el-icon-view"></i></a>
      </div>
      <div class="list-card__info">
        <div class="list-card__title">
          <b>{{ title }}</b>
        </div>
        <div class="list-card__description">
          {{ description | truncate(100) }}
        </div>
      </div>
      <div class="list-card__right" v-if="!inactive">
        <div class="list-card__top-right-label">{{ topRightLabel }}</div>
        <div class="list-card__bottom-right-label">
          <i class="el-icon-warning" v-if="bottomRightWarning" />
          {{ bottomRightLabel }}
        </div>
      </div>
      <div class="list-card__right" v-if="inactive">
        <div class="list-card__bottom-right-label">Inactive</div>
      </div>
    </div>
    <div class="list-card__actions" v-if="!hideActions">
      <div v-if="showEdit">
        <el-tooltip content="Edit" placement="right">
          <a @click="$emit('edit')"><i class="el-icon-edit"></i></a>
        </el-tooltip>
      </div>
      <div v-if="showVerify">
        <el-tooltip content="Verify" placement="right">
          <a @click="$emit('verify')"><i class="el-icon-check"></i></a>
        </el-tooltip>
      </div>
      <div v-if="showDelete">
        <el-tooltip content="Delete" placement="right" v-if="!disableDelete">
          <a @click="$emit('delete')" href="#">
            <i class="el-icon-delete"></i>
          </a>
        </el-tooltip>
        <el-tooltip :content="disabledDeleteMessage" placement="right" v-if="disableDelete">
          <span class="u-link-not-allowed">
            <i class="el-icon-delete"></i>
          </span>
        </el-tooltip>
      </div>
      <div v-if="showInvite">
        <el-tooltip content="Invite" placement="right">
          <a @click="$emit('invite')"><i class="el-icon-message"></i></a>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { Tooltip } from 'element-ui';

export default {
  components: {
    ElTooltip: Tooltip,
  },
  props: {
    hideStatus: Boolean,
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    inactive: Boolean,
    inactiveLabel: {
      type: String,
      default: 'Inactive',
    },
    topRightLabel: String,
    bottomRightLabel: String,
    bottomRightWarning: Boolean,
    hideActions: Boolean,
    showEdit: {
      type: Boolean,
      default() { return true; },
    },
    showDelete: {
      type: Boolean,
      default() { return true; },
    },
    showVerify: Boolean,
    showInvite: Boolean,
    disableDelete: Boolean,
    disableDeleteMessage: {
      type: String,
      default: 'You cannot delete this item',
    },
  },
};
</script>

<style lang="scss" scoped>
.list-card {
  position: relative;
  display: flex;
  margin-bottom: 10px;
  &__body {
    background: white;
    border-radius: 5px;
    border: solid 1px rgba($color: #000000, $alpha: 0.07);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);;
    transition: box-shadow .3s ease;
    padding: 20px;
    flex: 1;
    display: flex;
    .list-card--is-inactive & {
      opacity: 0.8;
    }
    @media screen and (max-width: 560px) {
      display: block;
    }
  }
  &__header {
    padding: 20px;
    display: flex;
  }
  &__status {
    width: 30px;
    font-weight: bold;
    a {
      color: $color-orange;
      .list-card--is-inactive & {
        color: $color-muted;
      }
      &:hover {
        color: $color-orange;
      }
    }
    @media screen and (max-width: 640px) {
      float: right;
      text-align: right;
    }
  }
  &__info {
    flex: 1;
  }
  &__title {
    font-size: 1.6rem;
    margin: 0 0 2px 0;
    transition: color .3s ease;
    .list-card--is-selected & {
      color: $color-orange;
    }
    .list-card--is-inactive & {
      color: $color-muted;
    }
  }
  &__description {
    color: $color-muted;
    font-size: 1.4rem;
  }
  &__right {
    text-align: right;
    margin-left: 20px;
    @media screen and (max-width: 640px) {
      text-align: left;
      margin-left: 0;
      margin-top: 20px;
    }
  }
  &__top-right-label {
    color: $color-orange;
    font-size: 1.5rem;
  }
  &__bottom-right-label {
    font-size: 1.1rem;
    text-transform: uppercase;
    font-weight: bold;
    margin: 2px 0 0;
    color: $color-muted;
  }
  &__actions {
    margin-left: 10px;
    a {
      display: block;
      margin-bottom: 5px;
    }
  }
}
</style>
