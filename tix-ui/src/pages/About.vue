<template>
  <div>
    <navigation></navigation>
    <main>
        <div class="company--profile">
          <h1 class="company--profile__header">company</h1>
          <section class="company--profile--about">
            <p class="company--profile--about__header">about us</p>
            <p class="company--profile--about__paragraph">
                tix.africa is a self-service ticketing platform for event creators. users can create events to sell tickets, 
                manage admissions at the event, and collect payments from guests. event management has been hard for 
                us in the past and we want to fix that. our goal is to build the simplest self-service ticketing platform to give 
                event creators all the tools they need - ticketing, admitting guests, and collecting payments - as simply and 
                as quickly as possible.
            </p>
          </section>
          <section class="company--profile--values">
            <p class="company--profile--values__header">what makes us special</p>
            <p class="company--profile--values__paragraph">
              simplicity, support, security and speed are important to us. we ensure this in the following ways:<br>
              <span>simplicity</span> - we prioritize simplicity and ease of use in our design<br>
              <span>support</span> - we will give you fast, friendly advice however you reach us email, phone, or social<br>
              <span>security</span> - our <a :href="`https://paystack.com/`">payment processor</a> has the highest level of certification in the global payments industry<br>
              <span>speed</span> - we made onboarding quick you can create an account and go live in under 5 minutes
            </p>
          </section>
          <div class="investor--profile">
            <p class="investor--profile__header">backed by</p>
            <div class="investor--profile__images">
              <a target="_blank" href="https://www.microtraction.com/"><img src="@/assets/microtraction.svg" alt="microtraction"/></a>
              <a target="_blank" href="https://africa.googleblog.com/2020/06/google-for-startups-accelerator-africa.html"><img src="@/assets/google-for-startups.svg" alt="google-for-startups"/></a>
            </div>
         </div>
        </div>
        <div class="footer-block">
        <el-footer></el-footer>
        </div>
   </main>
  </div>
</template>

<style lang="scss" scoped>
  .company--profile {
    font-weight: 300;
    margin-left: 8%;
    width: 70%;
    @media screen and (max-width: 960px) {
      width: 100%;
      margin: 0 auto;
      padding: 0 1.5em;
    }
    &__header {
      font-size: 2.8rem;
      line-height: 120%;
      color: $--color-pink;
      margin: 2.3em 0 0;
      @media screen and (max-width: 767px) {
        font-size: 1.6rem;
      }
    }
    &--about {
      &__header {
        color: $--color-pink;
        font-size: 2rem;
        line-height: 1.2;
        margin: 2.1em 0 0.4em 0;
        @media screen and (max-width: 767px) {
          font-size: 1.4rem;
        }
      }
      &__paragraph {
        text-align: justify;
        margin: 0 0 2em 0;
        font-size: 2rem;
        line-height: 1.6;
        @media screen and (max-width: 767px) {
          font-size: 1.2rem;
        }        
      }
    }
    &--values {
      &__header {
        color: $--color-pink;
        margin: 0 0 0.4em 0;
        line-height: 1.2;
        font-size: 2rem;
        @media screen and (max-width: 767px) {
          font-size: 1.4rem;
        }  
      }
      &__paragraph {
        margin: 0 0 2em 0;
        font-size: 2rem;
        line-height: 1.6;
        @media screen and (max-width: 767px) {
          font-size: 1.2rem;
        }  
      }
      a {
        color: $--color-pink;
      }
      span {
        font-weight: 500;
      }
    }
  }
  .investor--profile {
    &__header {
      font-size: 2rem;
      color: $--color-pink;
      margin: 0 0 0.4em 0;
      line-height: 1.2;
      @media screen and (max-width: 767px) {
        font-size: 1.4rem;
      }
    }
    &__images {
      display: flex;
      img {
        margin-right: 1rem;
      }
    }
  }
  .footer-block {
    width: 50%;
    padding: 2.7rem 5% 3.5rem;
    margin-left: auto;
    @media screen and (max-width: 767px) {
      width: 70%;
      margin-left: 0;
    }
  }
</style>
