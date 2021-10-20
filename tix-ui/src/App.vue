<template>
  <div id="app" class="app">
    <background />
    <router-view class="app__frame" />
  </div>
</template>

<script>
import Vue from 'vue';
import VueApollo from 'vue-apollo';
import Vue2Filters from 'vue2-filters';
import { Button, Select, Option, Checkbox, Radio, Input, Form, FormItem, Message, Notification, MessageBox, Loading, Row, Col, Tooltip } from 'element-ui';
import Navigation from '@/components/Global/Navigation/Nav';
import Footer from '@/components/Global/Footer/Footer';
import Background from '@/components/Global/Background';
import Intercom from '@/helpers/intercom';

Vue.component('navigation', Navigation);
Vue.component('el-footer', Footer);
Vue.component(Button.name, Button);
Vue.component(Checkbox.name, Checkbox);
Vue.component(Radio.name, Radio);
Vue.component(Select.name, Select);
Vue.component(Option.name, Option);
Vue.component(Input.name, Input);
Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);
Vue.component(Row.name, Row);
Vue.component(Col.name, Col);
Vue.component(Tooltip.name, Tooltip);

Loading.directive.install(Vue);

Vue.use(VueApollo);
Vue.use(Vue2Filters);

Vue.prototype.$notify = Notification;
const { alert, confirm, prompt } = MessageBox;
Vue.prototype.$alert = alert;
Vue.prototype.$confirm = confirm;
Vue.prototype.$prompt = prompt;
Vue.prototype.$message = Message;

export default {
  name: 'app',
  components: {
    Background,
  },
  mounted() {
    Intercom.bootIntercom();
  },
  metaInfo() {
    return {
      title: 'Buy and sell event tickets on the internet',
      titleTemplate: 'Tix - %s',
      htmlAttrs: {
        lang: 'en',
      },
    };
  },
};
</script>

<style lang="scss" src="./scss/reset.scss"></style>
<style lang="scss" src="./scss/utility.scss"></style>
<style lang="scss" src="./theme/src/display.scss"></style>
<style lang="scss" src="./scss/helpers/element-variables.scss"></style>
<style lang="scss">
.app {
  position: relative;
  height: 100vh;
  overflow: auto;
  max-width: 1440px;
  margin: 0 auto;
  &__frame {
    display: flex;
    flex-direction: column;
    height: 100%;
    > main {
      overflow: auto;
      flex: 1;
    }
  }
}

// Google autocomplete results
.pac-container {
  z-index: 12000;
}

trix-toolbar .trix-button-row {
  flex-wrap: wrap;
}

trix-toolbar .trix-button-group:not(:first-child) {
  margin-left: 0;
}
</style>
