import Vue from 'vue';
import Router from 'vue-router';
import { Notification } from 'element-ui';
import Auth from '@/helpers/auth';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import About from '@/pages/About';
import Faq from '@/pages/Faq';
import Product from '@/pages/Product';
import ForgotPassword from '@/pages/ForgotPassword';
import PasswordReset from '@/pages/PasswordReset';
import ConfirmEmail from '@/pages/ConfirmEmail';
import ViewProfile from '@/pages/ViewProfile';
import ListEvents from '@/pages/ListEvents';
import CreateEvent from '@/pages/CreateEvent';
import ViewEvent from '@/pages/ViewEvent';
import BuyTickets from '@/pages/BuyTickets';
import NotFound from '@/pages/NotFound';
import ChooseAccountType from '@/pages/ChooseAccountType';
import OrganizationReset from '@/pages/OrganizationReset';
import Pricing from '@/pages/Pricing';
import OnlineEvent from '@/pages/OnlineEvent';
import WhyTix from '@/pages/WhyTix';
import NewEvent from '@/pages/NewEvent';
import JoinEvent from '@/pages/JoinEvent';
import Oauth from '@/pages/ZoomOauth';
import CompleteZoom from '@/pages/CompleteZoom';
import Iswis from '@/pages/CustomPages/iswis';

Vue.use(Router);

async function requireAuth(to, from, next) {
  if (!Auth.loggedIn()) {
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    });
  } else {
    try {
      await Auth.fetchUser();
      next();
    } catch (e) {
      Auth.logout();
      Notification({
        type: 'error',
        title: 'Please Log In',
        message: 'There was an issue refreshing your session. Please log in again',
      });
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    }
  }
}

function redirectIfLoggedIn(to, from, next) {
  if (Auth.loggedIn()) {
    next({
      path: '/events',
    });
  } else {
    next();
  }
}

function redirectReferralLink(to, from, next) {
  if (Auth.loggedIn()) {
    next({
      path: '/events',
    });
  } else {
    next({
      path: `/signup?referral_token=${to.params.token}`,
    });
  }
}

function logout(to, from, next) {
  Auth.logout();
  next('/');
}

const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'Home', component: Home, beforeEnter: redirectIfLoggedIn },
    { path: '/signup', name: 'Signup', component: ChooseAccountType, beforeEnter: redirectIfLoggedIn },
    { path: '/iswis', name: 'Iswis', component: Iswis, beforeEnter: redirectIfLoggedIn },
    { path: '/about', name: 'About', component: About, beforeEnter: redirectIfLoggedIn },
    { path: '/faq', name: 'Faq', component: Faq, beforeEnter: redirectIfLoggedIn },
    { path: '/product', name: 'Product', component: Product, beforeEnter: redirectIfLoggedIn },
    { path: '/login', name: 'Login', component: Login, beforeEnter: redirectIfLoggedIn },
    { path: '/password_reset', name: 'PasswordReset', component: PasswordReset, beforeEnter: redirectIfLoggedIn },
    { path: '/forgot_password', name: 'ForgotPassword', component: ForgotPassword, beforeEnter: redirectIfLoggedIn },
    { path: '/pricing', name: 'Pricing', component: Pricing },
    { path: '/why_tix', name: 'WhyTix', component: WhyTix, beforeEnter: redirectIfLoggedIn },
    { path: '/logout', beforeEnter: logout },
    { path: '/confirm_email', name: 'ConfirmEmail', component: ConfirmEmail },
    { path: '/profile', name: 'ViewProfile', component: ViewProfile, beforeEnter: requireAuth },
    { path: '/events', name: 'ListEvents', component: ListEvents, beforeEnter: requireAuth },
    { path: '/events/create', name: 'NewEvent', component: NewEvent, beforeEnter: requireAuth },
    { path: '/events/online/create', name: 'OnlineEvent', component: OnlineEvent, beforeEnter: requireAuth },
    { path: '/events/online/create/join', name: 'JoinEvent', component: JoinEvent, beforeEnter: requireAuth },
    { path: '/events/live/create', name: 'CreateEvent', component: CreateEvent, beforeEnter: requireAuth },
    { path: '/events/manage/:slug', name: 'ViewEvent', component: ViewEvent, beforeEnter: requireAuth, props: true },
    { path: '/oauth/code', name: 'Oauth', component: Oauth },
    { path: '/zoom/complete', name: 'CompleteZoom', component: CompleteZoom, beforeEnter: requireAuth },
    { path: '/buy/:slug/:ticketId/:inviteeId', name: 'BuyTickets', component: BuyTickets, props: true },
    { path: '/buy/:slug', name: 'BuyTickets', component: BuyTickets, props: true },
    { path: '/invite/u/:token', beforeEnter: redirectReferralLink },
    { path: '/404', name: '404', component: NotFound },
    { path: '/:token([a-zA-Z0-9]{1,6})', name: 'BuyTickets', component: BuyTickets, props: true },
    { path: '/:token([passfolio]{1,9})/', name: 'BuyTickets', component: BuyTickets, props: true },
    { path: '//organization_reset', name: 'OrganizationReset', component: OrganizationReset },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.path === '/verifyzoom.html') next();
  else if (!to.matched.length) {
    next('/404');
  } else {
    next();
  }
});

export default router;
