<template>
  <div class="discount--list">
    <div class="list-card">
      <div class="list-card__body" :class="{ 'list-card--is-inactive': inactive }">
        <div class="list-card__info">
          <div class="list-card__title">
            <p>{{ code | truncate(truncateTitle) }}</p>
          </div>
          <div class="list-card__description">
            {{ usage }} / {{ total }} uses
          </div>
        </div>
        <div class="list-card__right">
          <p class="list-card__top-right-label">
            started: {{ dateFormat(startDate) }}
          </p>
          <p class="list-card__top-right-label">
            ends: {{ dateFormat(endDate) }}  
          </p>
        </div>
        <div class="list-card__right cta">
          <el-dropdown @command="dropdownAction">
            <span>
              <svg width="6" height="27" viewBox="0 0 6 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="3" cy="3" r="3" fill="black"/>
                <circle cx="3" cy="13.5" r="3" fill="black"/>
                <circle cx="3" cy="24" r="3" fill="black"/>
              </svg>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="edit">
                <a>edit</a>
              </el-dropdown-item>
              <el-dropdown-item command="delete">
                <a>delete</a>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="list-card__actions" :class="{ 'actions--are-inactive': inactive }">
      <div class="list-card__status">
        <a @click="toggleStatus" ><i class="el-icon-view"></i></a>
      </div>
    </div>
  </div>
</template>

<script>
import { Tooltip, Dropdown, DropdownItem, DropdownMenu } from 'element-ui';
import IsMobile from '@/mixins/IsMobile';
import DateHandler from '@/mixins/DateHandler';
import TOGGLE_STATUS from '@/graphql/ToggleStatus.gql';
import ErrorHandler from '@/helpers/error-handler';

export default {
  mixins: [IsMobile, DateHandler],
  components: {
    ElTooltip: Tooltip,
    ElDropdown: Dropdown,
    ElDropdownItem: DropdownItem,
    ElDropdownMenu: DropdownMenu,
  },
  props: {
    id: String,
    code: String,
    startDate: [Number, String],
    endDate: [Number, String],
    unlimited: Boolean,
    limit: Number,
    discountUsage: Number,
    status: String,
    showEdit: {
      type: Boolean,
      default: true,
    },
    showDelete: {
      type: Boolean,
      default: true,
    },
    disableDelete: Boolean,
    disableDeleteMessage: {
      type: String,
      default: 'You cannot delete this item',
    },
    eventFrequency: String,
  },
  data() {
    return {
      localStatus: this.status,
    };
  },
  computed: {
    usage() {
      return this.discountUsage ? this.discountUsage : 0;
    },
    truncateDescription() {
      if (this.isMobile) return 20;
      return 100;
    },
    truncateTitle() {
      if (this.isMobile) return 11;
      return 75;
    },
    total() {
      const unlimited = this.isMobile ? '∞' : 'unlimited';
      return this.unlimited ? unlimited : this.limit;
    },
    inactive() {
      return this.status === 'inactive';
    },
  },
  methods: {
    dropdownAction(command) {
      if (command === 'edit') {
        this.$emit('edit');
      } else if (command === 'delete') {
        this.$emit('delete');
      }
    },
    toggleStatus() {
      const statusReplacer = { inactive: 'active', active: 'inactive' };
      this.localStatus = statusReplacer[this.localStatus];
      this.$apollo.mutate({
        mutation: TOGGLE_STATUS,
        variables: {
          toggleable: this.id,
          status: this.localStatus,
        },
      }).then(() => {
        this.$emit('onUpdate');
      }).catch((error) => {
        this.localStatus = statusReplacer[this.localStatus];
        ErrorHandler.throwGraphQLError(error);
      });
    },
    dateFormat(date) {
      let val;
      val = this.isMobile ? this.formateDateMobile(date) : this.formateDate(date);
      val = date === 0 ? '∞' : val;
      return val;
    },
  },
};
</script>

<style lang="scss">
  .el-dropdown {
    span {
      outline: none;
    }
  }
  trix-editor {
    min-height: 10em;
  }
</style>

<style lang="scss" scoped>
.list-card {
  display: flex;
  margin-top: 2.1rem;
  width: 100%;
  @media screen and (max-width: 767px){
    width: 95%;
  }
  &__body {
    background: $--color-pale-cyan;
    height: 9.8rem;
    border-radius: 4px;
    border: solid 1px $--color-green;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    transition: box-shadow .3s ease;
    padding: 1.5rem 2.7rem 1.5rem 1.9rem;
    flex: 1;
    display: flex;
    align-items: center;
    @media screen and (max-width: 768px) {
      height: auto;
    }
  }
  &__header {
    padding: 2rem;
    display: flex;
  }
  &__status {
    width: 3rem;
    font-weight: bold;
    .actions--are-inactive & {
      opacity: 0.2;
      color: #7C7C7C;
    }
  }
  &__info {
    flex: 1;
    font-weight: 300;
    .list-card--is-inactive & {
      opacity: 0.2;
    }
  }
  &__title {
    margin: 0 0 0.9rem;
    transition: color .3s ease;
    .list-card--is-selected & {
      color: $--color-pink;
    }
    p {
      margin: 0;
      font-weight: 300;
      font-size: 16px;
    }
    @media screen and (max-width: 768px) {
      font-size: 1.4rem;
    }
  }
  &__description {
    color: $color-orange;
    font-size: 14px;
    font-weight: 300;
    @media screen and (max-width: 768px) {
      font-size: 1.2rem;
    }
  }
  &__right {
    text-align: right;
    margin-left: 2rem;
    .list-card--is-inactive & {
      opacity: 0.2;
    }
  }
  &__top-right-label {
    font-weight: 300;
    font-size: 14px;
    color: #000000;
    margin-bottom: 0.9rem;
    text-transform: lowercase;
  }
  &__actions {
    font-size: 2rem;
    padding: 1em 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: absolute;
    right: -0.3em;
    top: 2.1rem;
    height: 9.8rem;
    margin-right: -5%;
    color: $--color-pink;
    @media screen and (min-width: 1300px) {
      right: 0;
    }
  }
}
.el-dropdown-menu {
  padding: 0 0 0.2rem;
  border-radius: 5px;
  &__item {
    font-size: 1.2rem;
    color: $--color-black;
    line-height: 1;
    text-align: center;
    width: 7.1rem;
    padding: 0.4rem 0;
    border-bottom: 0.5px solid rgba(0,0,0,0.1);
    &:last-of-type {
      border: 0;
    }
  }
}
.cta {
  display: flex;
  align-items: flex-end;
  margin-left: 6.5%;
  cursor: pointer;
}
.discount--list {
  display: flex;
  position: relative;
}
.disableButton {
  pointer-events: none;
}
</style>
