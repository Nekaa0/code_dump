<template>
  <div class="custom-fields">
    <button class="custom-fields__header" @click.prevent="showCustomFields">
      <p class="custom-fields__dropdown" :class="{'custom-fields--triggered': show_custom_fields}">
        <arrow-dropdown />
      </p>
      <p class="custom-fields__dropdown-text">do you want to collect additional information?</p>
    </button>
    <transition name="fade">
      <div v-if="show_custom_fields">
        <div v-for="(customField, index) in customFields" :key="index" class="custom-field">
          <el-form-item label="custom question" prop="customQuestion">
            <el-input v-model.trim="customField.question_text" class="custom-fields__input" placeholder="e.g what is your delivery address" @change="emitCustomFieldsdata"/>
            <a class="custom-field__close" @click="removeField(index)" href="javascript:;">
              <close-input />
            </a>
          </el-form-item>
          <el-checkbox v-model="customField.required" @change="emitCustomFieldsdata">make this question required</el-checkbox>
        </div>
        <a class="custom-fields__addQ" @click="addField" :class="{'custom-fields__addQ-inactive': addMoreQuestions}" href="javascript:;">
          <span>
            + add another question
          </span>
          <tix-pro-icon />
        </a>
      </div>
    </transition>
    <tix-pro-banner
      :header="tixProBannerHeader"
      :buttonText="tixProBannerButtonText"
      :openTixProBanner="openTixProBanner"
      :openMobileBannerView="openMobileBannerView"
      :isPhone="isPhone"
      @back="openMobileBannerView = false"
      @closeBanner="openTixProBanner = false"
    />
  </div>
</template>

<script>
import IsPhone from '@/mixins/IsPhone';
import SubscriptionPlan from '@/mixins/SubscriptionPlan';
import DELETE_CUSTOM_FIELD from '@/graphql/DeleteCustomField.gql';
import ErrorHandler from '@/helpers/error-handler';
import ArrowDropdown from '../../Global/Icons/ArrowDropdown';
import TixProIcon from '../../Global/Icons/TixProIcon';
import CloseInput from '../../Global/Icons/CloseInput';
import TixProBanner from '../../Global/TixPro/Banner/Index';

export default {
  name: 'custom-fields',
  mixins: [IsPhone, SubscriptionPlan],
  props: {
    formData: Object,
  },
  components: {
    ArrowDropdown,
    TixProIcon,
    CloseInput,
    TixProBanner,
  },
  data() {
    return {
      show_custom_fields: false,
      customFields: [{ question_text: '', required: false }],
      openTixProBanner: false,
      openMobileBannerView: false,
      tixProBannerHeader: 'upgrade to add more questions',
      tixProBannerButtonText: 'upgrade to add more questions',
    };
  },
  computed: {
    oneCustomField() {
      return this.customFields.length === 1;
    },
    addMoreQuestions() {
      return this.customFields.find(field => field.question_text === '');
    },
  },
  created() {
    this.resetCustomFields(this.formData);
  },
  mounted() {
    this.openCustomFieldOnMount();
    this.emitCustomFieldsdata();
  },
  methods: {
    resetCustomFields(ticket) {
      const ticketCustomFields = ticket.customFields;
      this.customFields = ticketCustomFields.length ? ticketCustomFields : this.customFields;
    },
    openCustomFieldOnMount() {
      if (this.customFields[0].question_text !== '') {
        this.show_custom_fields = true;
      }
    },
    showCustomFields() {
      this.addFieldIfCustomFieldIsEmpty();
      this.show_custom_fields = !this.show_custom_fields;
    },
    addFieldIfCustomFieldIsEmpty() {
      if (this.customFields.length === 0) {
        this.customFields.push({ question_text: '', required: false });
      }
    },
    openProBanner() {
      if (!this.isPhone) {
        this.openTixProBanner = true;
      } else {
        this.openMobileBannerView = true;
      }
    },
    addField() {
      if (this.freePlan) {
        this.openProBanner();
        return;
      }
      this.customFields.push({ question_text: '', required: false });
    },
    removeField(index) {
      const { id } = this.customFields[index];
      if (id) {
        const header = 'confirm delete';
        const message = 'this action will delete all answers attendees may have provided to this question';
        this.$confirm(message, header, {
          confirmButtonText: 'yes, delete',
          cancelButtonText: 'cancel',
          showClose: false,
        }).then(() => {
          this.$apollo.mutate({
            mutation: DELETE_CUSTOM_FIELD,
            variables: { id },
          }).then(() => {
            this.customFields.splice(index, 1);
          }).catch((error) => {
            ErrorHandler.throwGraphQLError(error);
          });
        }).catch(() => {
        });
      } else {
        this.customFields.splice(index, 1);
      }
      this.closeCustomFieldsIfNoField();
    },
    closeCustomFieldsIfNoField() {
      if (this.customFields.length === 0) { this.show_custom_fields = false; }
    },
    emitCustomFieldsdata() {
      this.$emit('emit-custom-fields-data', this.customFields);
    },
  },
};
</script>

<style lang="scss">
  .custom-field .el-form-item__label {
    padding-left: 0.8rem;
  }
  .custom-field .el-form-item {
    margin-bottom: 0.5rem;
  }
  .custom-field .el-checkbox {
    line-height: 1.2;
    &__label {
      font-size: 1rem;
      @media screen and (min-width: 768px) {
        font-size: 1.4rem;
      }
    }
  }
</style>

<style lang="scss" scoped>
  .custom-fields {
    margin-top: 1.6rem;
    @media screen and (min-width: 768px) {
      margin-top: 3rem;
    }
    &__header {
      border: 1px solid #BFBFBF;
      background: rgba(239, 239, 239, 0.3);
      padding: 1.2rem 2.1rem 1.2rem 2.4rem;
      font-size: 1rem;
      display: flex;
      max-width: 37.2rem;
      width: 100%;
      font-family: inherit;
      border-radius: 4px;
      margin: 0 auto;
      cursor: pointer;
      justify-content: center;
      @media screen and (min-width: 768px) {
        font-size: 1.4rem;
        padding: 1.2rem 2.1rem 1.2rem 2.5rem;
      }
    }
    &__dropdown {
      transform: rotate(-90deg);
      line-height: 1;
      &-text {
        margin-left: 1.6rem;
        line-height: 1;
        @media screen and (min-width: 768px) {
          margin-left: 1.2rem;
        }
      }
    }
    &--triggered {
      animation: rotateChevron 0.2s linear;
      animation-fill-mode: forwards;
      animation-iteration-count: 1;
    }
    &__addQ {
      color: $color-orange;
      display: inline-flex;
      align-items: center;
      margin-top: 7px;
      @media screen and (min-width: 768px) {
        margin-top: 2.6rem;
      }
      svg {
        height: 1.2rem;
        width: 1.2rem;
      }
      &-inactive {
        opacity: 0.3;
        pointer-events: none;
        cursor: not-allowed;
      }
      @media screen and (max-width: 767px) {
        font-size: 1rem;
      }
      span {
        margin-right: 0.4rem;
      }
    }
  }
  .custom-field {
    margin-top: 1.7rem;
    @media screen and (min-width: 768px) {
      margin-top: 1.4rem;
    }
    &__close {
      position: absolute;
      top: 5px;
      right: 11px;
    }
  }
 .el-dialog {
   &__body, &__header {
     padding: 0 !important;
   }
 }
  @keyframes rotateChevron {
    50% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(90deg);
    }
  }
</style>
