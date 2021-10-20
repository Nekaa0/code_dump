<template>
  <div>
    <el-col :xs="24" :sm="6" :md="6"  class="sign-up__steps">
      <el-row  class="step" :class="{'hidden-xs-only': currentStep !== index}" v-for="(step, index) in steps" :key="index">
        <el-col class="sign-up__steps__icon" :span="2">
          <img v-if="currentStep === index" src="@/assets/step.svg" alt="">
        </el-col>
        <el-col class="sign-up__steps__type" :span="23">
          <div class="sign-up__steps__type">
            <p :class="{'selected-step-para':  isCurrentStep(index)}" class="sign-up__steps__type__para">{{step}}<br><small>step {{++index}}/{{steps.length}}</small></p>
          </div>
        </el-col>
      </el-row>
  </el-col>
  </div>
</template>
 
<script>
export default {
  name: 'steps',
  props: {
    currentStep: {
      type: Number,
    },
  },
  data() {
    return {
      steps: [
        'account type', 'about you', 'confirm your email',
      ],
    };
  },
  methods: {
    isCurrentStep(index) {
      return this.currentStep === index;
    },
  },
};
</script>

<style lang="scss" scoped>
  .sign-up {
    &__steps {
      height: 100vh;
      margin-top: 3rem;
      border-right: 1px solid rgba(0, 0, 0, 0.05);
      @media screen and (min-width: 767px) {
        width: 20rem;
      }
      @media screen and (max-width: 767px) {
        height: 100%;
        border-right: none;
        margin-top: none;
      }
      .arrow {
        @media screen and (max-width: 767px) {
          width: 80%;
          margin-left: 1.9em; 
        }
      }
      &__type {
        padding-left: 0.5rem;
        @media screen and (max-width: 767px) {
          padding-left: 0;
        }
        &__para {
          line-height: 1.2em;
          margin-bottom: 0.5rem;
          opacity: 0.3;
          font-weight: 300;
          @media screen and (min-width: 1250px) {
            padding-right: 2rem;
          }
        }
      }
    }
    .selected-step-para {
      opacity: 1;
    }
  }
  .step {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    margin-right: 1.6rem;
    display: flex;
    padding-bottom: 1.8rem;
    padding-top: 2rem;
  }
</style>
