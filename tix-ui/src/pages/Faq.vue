<template>
  <div>
    <navigation></navigation>
    <main>
      <div class="faqs">
        <el-col :xs="24" :sm="24" :md="16">
        <h1 class="faqs__header">frequently asked questions</h1>
        <div class="faqs__list">
        <ul>
          <li>
              <p>+ who can use tix.africa?</p>
              <p>tix.africa is available to anyone, anywhere to create free events. all you need is an email address.</p>
          </li>
          <li>
              <p>+ what if I want to organise a paid event?</p>
              <p>listing paid events is currently only available in nigeria, we will be expanding to more african countries in 2021.</p>
          </li>
          <li>
              <p>+ how much does it cost to use tix.africa ?</p>
              <p>technically, tix is free to use. we charge you nothing to create a free event and sell tickets. however, if you’re charging your guests a fee, we take a percentage of the value of the ticket as a transaction processing fee. if you upgrade to tix pro, we charge lower transaction processing fees on paid tickets. compare our pricing packages <router-link to="/pricing">here</router-link>.</p>
          </li>
          <li>
              <p>+ why does tix.africa cost more than a payment gateway like Paystack ?</p>
              <p>we charge a little higher than payment gateways because we offer more value to event organizers. asides selling tickets, we offer tools to manage admissions, zoom integration, email marketing, data collection and other specialized products all without leaving the app. we also remit part of the fees to our payment processor - Paystack so their fee is included in our transaction processing fees.</p>
          </li>
          <li>
              <p>+ can i make my guests pay the fee instead ?</p>
              <p>yes. for your guests to pay the transaction processing fee, all you need to do is select “transfer fees to guests” when setting up your event.</p>
          </li>
          <li>
              <p>+ what is tix pro ?</p>
              <p>as a pro user, you get everything on the free plan plus lower transaction processing fees, recurring event types, waitlists, 1:1 events, unlimited custom fields, discount codes and premium zoom integration for 4,000 ngn a month.</p>
          </li>
          <li>
              <p>+ how do I get my money from ticket sales ?</p>
              <p>you need to link a nigerian bank account to your profile to sell paid tickets. we’ll deposit into that bank account weekly.</p>
          </li>
          <li>
              <p>+ have more questions ?</p>
              <p>get answers to questions on using tix <a target="_blank" href="https://intercom.help/tixafrica/en/">here</a> or <a :href="`mailto:support@tix.africa`">email us.</a></p>
          </li>
        </ul>
        </div>
        </el-col>
      </div>
      <div class="footer-block">
        <el-footer></el-footer>
      </div>
    </main>
    </div>
</template>

<style lang="scss" scoped>
  .faqs {
    margin-left: 8%;
    font-weight: 300;
    display: flex;
    flex-direction: column;
    @media screen and (max-width: 960px) {
    width: 90%;
    margin: 0 auto;
    }
    &__header {
      color: $color-orange;
      padding-top: 2.8em;
    }
    &__list {
      margin: 4em 0 0;
      @media screen and (max-width: 767px) {
        margin: 2em 0 0;
      }      
      li {
        font-size: 1.8rem;
        margin: 0 0 1.3125em 0;
        @media screen and (max-width: 767px) {
          font-size: 1.2rem;
        }
        p:first-of-type {
          color: $--color-pink;
        }
      }
      a {
        color: $--color-pink;
      }
      p {
        margin: 0;
      }
    }
  }
  .footer-block {
    width: 50%;
    padding: 3.5rem 5%;
    margin-left: auto;
    @media screen and (max-width: 767px) {
      width: 70%;
      margin-left: 0;
    }
  }
</style>
