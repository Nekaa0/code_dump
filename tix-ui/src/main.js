// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an tag.
import Vue from 'vue';
import VueAnalytics from 'vue-analytics';
import Meta from 'vue-meta';
import axios from 'axios';
import VueApollo from 'vue-apollo';
import 'vue-trix';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTwitter, faInstagram, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import App from './App';
import router from './router';
import setupGoogleAnalytics from './helpers/google-analytics';
import setupFacebookPixel from './helpers/facebook-pixel';
import VueIntercom from './helpers/setupIntercom';
import apolloClient from './apollo';


library.add(faTwitter);
library.add(faInstagram);
library.add(faFacebookF);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;
Vue.use(Meta);

const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
  setupGoogleAnalytics();
  setupFacebookPixel(process.env.FACEBOOK_PIXEL_ID);
  Vue.use(VueAnalytics, {
    id: process.env.GOOGLE_ANALYTICS_ID,
    router,
  });
}

Vue.use(
  VueIntercom, { appId: process.env.INTERCOM_ID },
);

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

axios.defaults.baseURL = process.env.SERVER_ROOT_URL;
const token = localStorage.token;
if (token) {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
}


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  provide: apolloProvider.provide(),
});
