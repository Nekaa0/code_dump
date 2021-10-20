<template>
  <div>
    <navigation></navigation>
    <main>
      <div class="user--profile">
          <div class="user--profile__form">
            <div class="user--profile__form--header">
              <form-header title="your account" />
            </div> 
              <div class="tab">
                <el-tabs v-model="view" @tab-click="updateRoute">
                  <el-tab-pane name="profile">
                    <span slot="label" class="tab__header" :class="{active: onProfileTab }">profile</span>
                    <div class="user--profile__form--section">
                      <div class="user--profile__form--section__header">
                        <form-header subtitle="personal information" />
                        <div class="horizontal--line">
                        </div>
                      </div>
                      <edit-user />
                    </div>
                    <div class="user--profile__form--section">
                      <div class="user--profile__form--section__header">
                        <form-header subtitle="update password" />
                        <div class="horizontal--line">
                        </div>
                      </div>  
                      <change-password />
                    </div>
                    <div class="user--profile__form--section">
                      <div class="user--profile__form--section__header">
                        <form-header subtitle="your interests" />
                        <div class="horizontal--line">
                        </div>
                      </div>
                      <user-interests />
                    </div>  
                  </el-tab-pane>
                  <el-tab-pane name="billing">
                    <span slot="label" class="tab__header" :class="{active: 'billing' == this.$route.query.view }">billing</span>
                    <div class="billings-view">
                      <billings-section />
                    </div>
                  </el-tab-pane>
                  <el-tab-pane name="settings">
                    <span slot="label" class="tab__header" :class="{active: 'settings' == this.$route.query.view }">settings</span>
                    <div class="settings-view">
                      <settings-section />
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>       
          </div>
      </div>
    </main>
  </div>
</template>

<script>
import { Tabs, TabPane } from 'element-ui';
import FormHeader from '@/components/Global/FormHeader';
import EditUser from '@/components/User/Edit';
import ChangePassword from '@/components/User/ChangePassword';
import UserInterests from '@/components/User/UserInterests';
import SettingsSection from '@/components/Profile/Settings/Index';
import BillingsSection from '@/components/Profile/Billings/Index';

export default {
  components: {
    ElTabs: Tabs,
    ElTabPane: TabPane,
    FormHeader,
    EditUser,
    ChangePassword,
    UserInterests,
    SettingsSection,
    BillingsSection,
  },
  data() {
    return {
      view: this.$route.query.view || 'profile',
    };
  },
  watch: {
    /* eslint object-shorthand: ["error", "always", { "avoidQuotes": false }] */
    '$route'(to) {
      if (!to.query.view) this.$router.go();
    },
  },
  computed: {
    onProfileTab() {
      return (this.$route.query.view === undefined || this.$route.query.view === 'profile');
    },
  },
  methods: {
    updateRoute(tab) {
      this.$router.replace({ path: this.$route.path, query: { view: tab.name } });
    },
  },
};
</script>

<style lang="scss">
  .el-form-item {
    margin-bottom: 1.25em;
    @media screen and (max-width: 992px){
      margin-bottom: 1em;
    }
  }
</style>

<style lang="scss" scoped>
  .user--profile {
    margin: 6.7rem auto;
    padding-left: 5rem;
    line-height: 120%;
    max-width: 89.3rem;
    @media screen and (max-width: 767px) {
      margin: 10% 6.7% 6rem;
      max-width: 40rem;
      padding-left: 0;
      padding-bottom: 6rem;
    }
    &__form {
      width: 100%;
      margin: 0 auto;
      &--header {
        padding-bottom: 5.5rem;
        @media screen and (max-width: 767px) {
          padding-bottom: 3.5rem;
        }
      }
      &--section {
        margin-top: 5.5rem;
        max-width: 70rem;
        margin-right: 22%;
        @media screen and (max-width: 767px) {
          margin-top: 3.5rem;
          margin-right: 6.7%;
          padding-right: 0;
        }
        &__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1.25em;
          @media screen and (max-width: 767px) {
            width: max-content; 
            padding-bottom: 0.5em;
            margin-bottom: 1.25em;
            border-bottom: 1px solid $--color-green;
          }
        }
      }
    }
  }
  .horizontal--line {
    height: 1px;
    width: 65%;
    background-color: $--color-green;
      @media screen and (max-width: 767px) {
        display: none;
      }
  }
  .settings-view, .billings-view {
    margin-right: 22%;
    padding: 3.2rem 0px;
    @media screen and (max-width: 767px) {
      margin-right: 6.7%;
    }
  }
    .tab {
    margin-bottom: 30%;
    &__header {
      font-size: 1.25em;
      font-weight: normal;
      opacity: 0.4;
      color: $--color-black;
      line-height: 1.2;
      width: max-content;
      &:hover {
        border-bottom: 2px solid rgba($color: $--color-pink, $alpha: 0.5);
      }
      padding-bottom: 0.8rem;
      margin-right: 3.5rem;
      @media screen and (max-width: 767px){
        margin-right: 0;
        font-size: 1.6rem;
      }
    }
  }
  .active {
    opacity: 1;
    border-bottom: 2px solid $--color-pink;
  }
</style>
