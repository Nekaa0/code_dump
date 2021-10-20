<template>
  <el-dropdown @command="handleCommand">
    <div class="nav-user-actions">
      <div class="nav-user-actions__avatar"></div>
      <div class="nav-user-actions__name">
        {{ user.firstName }}
      </div>
    </div>
    <el-dropdown-menu slot="dropdown">
      <router-link :to="{name: 'ViewProfile'}">
        <el-dropdown-item>account</el-dropdown-item>
      </router-link>
      <router-link :to="{name: 'ListEvents'}">
        <el-dropdown-item>events</el-dropdown-item>
      </router-link>
      <a target="_blank" href="https://intercom.help/tixafrica/en/">
        <el-dropdown-item>help</el-dropdown-item>
      </a>
      <el-dropdown-item command="logout">log out</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import Auth from '@/helpers/auth';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
} from 'element-ui';

export default {
  name: 'nav-user-actions',
  components: {
    ElDropdown: Dropdown,
    ElDropdownItem: DropdownItem,
    ElDropdownMenu: DropdownMenu,
  },
  props: {
    user: Object,
  },
  methods: {
    handleCommand(command) {
      if (this[command]) this[command]();
    },
    logout() {
      Auth.logout(this);
      this.$router.push({
        name: 'Home',
      });
      location.reload();
    },
  },
};
</script>

<style lang="scss" scoped>
.nav-user-actions {
	position: relative;
	display: flex;
	height: 35px;
	border: solid 1px #F6F6F6;
  border-radius: 25px;
  outline: none;
	box-shadow: 0 1px 1px rgba($color: black, $alpha: 0.2);
	align-items: center;
	padding: 0 5px;
  background: white;
  @media screen and (min-width: 960px) {
    padding: 0 10px 0 5px;
  }
	&__avatar {
		height: 25px;
		width: 25px;
		background: whitesmoke;
    border-radius: 50%;
    margin: 0;
    @media screen and (min-width: 960px) {
		  margin-right: 5px;
    }
	}
	&__name {
		height: 20px;
		line-height: 20px;
		cursor: pointer;
		font-size: 1.4rem;
    text-transform: lowercase;
    display: none;
		svg {
			margin-left: 1px;
			vertical-align: middle;
    }
    @media screen and (min-width: 960px) {
      display: inline-block;
    }
	}
}
</style>
