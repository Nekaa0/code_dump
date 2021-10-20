<template>
  <div>
    <navigation></navigation>
    <main>
      <div class="sign-up">
        <el-row>
          <steps :currentStep="currentStep" />
          <el-col :xs="24" :sm="12" :md="12">
            <div class="account-type" v-if="currentPage === ''">
              <div class="account-type__header">
                <form-header title="choose an account type"></form-header>
              </div>
              <div class="account-type__list" @click="selectType('personal')">
                <div class="account-type__personal">
                  <div class="account-type__details">
                    <div class="account-type__icon">
                      <img src="@/assets/personal.svg" alt="Personal Account Logo" />
                    </div>
                    <div class="account-type__text">
                      <p class="account-type__text__title">personal</p>
                      <p class="account-type__text__detail">selling tickets as an individual? <br> this is the account type for you </p>
                    </div>
                  </div>
                  <div class="account-type__step" :class="{ 'current-step': selected === 'personal'}">
                  </div>
                </div>
              </div>
              <div class="account-type__list" @click="selectType('business')">
                <div class="account-type__business">
                  <div class="account-type__details">
                    <div class="account-type__icon">
                      <img src="@/assets/business.svg" alt="Business Account Logo" />
                    </div>
                    <div class="account-type__text">
                      <p class="account-type__text__title">organization</p>
                      <p class="account-type__text__detail">selling tickets as registered business? <br> this is the account type for you </p>
                    </div>
                  </div>
                  <div class="account-type__step" :class="{ 'current-step': selected === 'business'}">
                  </div>
                </div>
              </div>
              <div class="account-type__buttons">
                <button class="u-button u-button--grey" @click="$router.push('/')">back</button>
                <button class="u-button" type="primary" :class="{'u-button--disabled': selected === ''}"  :disabled="selected === ''" @click="goToNextPage">next</button>
              </div>
            </div>
            <div v-else-if="currentPage === 'personal'">
              <personal-account @hook:mounted="stepTwo()" :goToPreviousPage="goToPreviousPage" />
            </div>
            <div v-else>
              <business-account @hook:mounted="stepTwo()" :goToPreviousPage="goToPreviousPage" />
            </div>
          </el-col>
          <div class="tix-man hidden-md-and-down">
            <img src="@/assets/tix-man.svg" alt="">
          </div>
        </el-row>
      </div>
    </main>
  </div>
</template>

<script>
import IsMobile from '@/mixins/IsMobile';
import FormHeader from '@/components/Global/FormHeader';
import Step from '@/components/Global/Step';
import PersonalAccount from '@/components/Account/Personal';
import BusinessAccount from '@/components/Account/Business';
import Steps from '@/components/Global/Signup/Steps';

export default {
  mixins: [IsMobile],
  components: {
    FormHeader,
    Step,
    PersonalAccount,
    BusinessAccount,
    Steps,
  },
  name: 'choose-account-type',
  data() {
    return {
      selected: '',
      currentPage: '',
      currentStep: 0,
    };
  },
  methods: {
    selectType(type) {
      if (this.selected === type) {
        this.selected = '';
      } else {
        this.selected = type;
      }
    },
    goToNextPage() {
      this.currentPage = this.selected;
    },
    goToPreviousPage() {
      this.currentPage = '';
      this.currentStep = 0;
    },
    stepTwo() {
      this.currentStep = 1;
    },
  },
};
</script>

<style lang="scss" scoped>
  p {
    line-height: 1.7rem;
  }
  .sign-up {
    margin-left: 2.1%;
    margin-right: 10%;
    @media screen and (max-width: 767px) {
      margin: 0 5%;
    }
  }
  .account-type {
    padding-top: 4.4rem;
    padding-left: 6.8%;
    max-width: 50rem;
    @media screen and (max-width: 767px) {
      padding: 0;
    }
    &__header {
      margin-bottom: 2.2rem;
      @media screen and (max-width: 767px) {
        padding: 8% 0;
        margin: 0;
      }
    }
    &__list {
      padding: 1.7rem 1.5rem 1.6rem 2rem;
      margin-bottom: 1rem;
      background-color: $--background-color-gray; 
      border-radius: 5px;
    }
    &__personal {
      display: flex;
    }
    &__business {
      display: flex;
    }
    &__text {
      &__detail {
        opacity: 0.5;
        font-size: 1.2rem;
        padding-top: 0.7rem;
        @media screen and (max-width: 450px) {
          margin-right: 0.5rem;
        }
      }
    }
    &__details {
      display: flex;
      align-items: center;
      flex: 1;
    }
    &__buttons {
      margin-left: 0.4rem;
      margin-top: 4rem;
      display: flex;
    }
    &__icon {
      padding-right:2.2rem;
      min-width: 5rem;
      @media screen and (max-width: 450px) {
        padding-left: 0;
      }
    }
    &__step {
      width: 1.3rem;
      height: 1.3rem;
      border-radius: 50%;
      float: right;
      background: $color-light-grey;
    }
    .current-step {
      background: $--color-deep-green;
    }
  }
  .tix-man {
    text-align: right;
    margin-top: 6rem;
  }
  .u-button {
    margin-right: 2rem;
    margin-left: 0;
  }
</style>
