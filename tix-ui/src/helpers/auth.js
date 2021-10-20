import gql from 'graphql-tag';
import ApolloClient from '@/apollo';
import Intercom from '@/helpers/intercom';
import FETCH_CURRENT_USER from '@/graphql/FetchCurrentUser.gql';

export const countriesFees = [
  {
    country: 'NG',
    countryLong: 'Nigeria',
    currency: 'NGN',
    freePercentage: '5%',
    proPercentage: '3.5%',
    flatFee: '100',
    monthlyPlan: '4,000',
    annualPlan: '44,000',
  },
  {
    country: 'GH',
    countryLong: 'Ghana',
    currency: 'GHS',
    freePercentage: '5%',
    proPercentage: '3.5%',
    flatFee: null,
    monthlyPlan: '60',
    annualPlan: '660',
  },
  {
    country: 'ZA',
    countryLong: 'South Africa',
    currency: 'ZAR',
    freePercentage: '5%',
    proPercentage: '4%',
    flatFee: '5',
    monthlyPlan: '150',
    annualPlan: '1,650',
  },
];

export default {
  currentUser: null,
  saveToken(token) {
    localStorage.token = token;
  },

  getToken() {
    return localStorage.token;
  },

  logout() {
    Intercom.logoutIntercom(this);
    delete localStorage.token;
  },

  loggedIn() {
    return !!localStorage.token;
  },

  fetchUser() {
    if (this.currentUser) {
      return Promise.resolve(this.currentUser);
    }
    return ApolloClient.query({
      query: gql`${FETCH_CURRENT_USER}`,
      fetchPolicy: 'network-only',
    }).then(({ data }) => {
      if (!data.currentUser) {
        return Promise.reject(data);
      }
      this.currentUser = data.currentUser;
      Intercom.loginIntercom(this.currentUser);
      return data.currentUser;
    });
  },

  updateUser(user) {
    if (!user) return;
    if (!user.events) {
      this.fetchUser();
      return;
    }
    Intercom.loginIntercom(this.currentUser);
    this.currentUser = user;
  },

  subscriptionState() {
    return this.currentUser ? this.currentUser.subscriptionState : null;
  },

  userCurrency() {
    return this.currentUser ? this.currentUser.currencyShortForm : 'NGN';
  },

  userCountry() {
    return this.currentUser ? this.currentUser.country : 'NG';
  },

  countryFees() {
    return countriesFees.find(val => val.country === this.userCountry());
  },
};
