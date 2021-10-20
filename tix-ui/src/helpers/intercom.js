import moment from 'moment';

const forge = require('node-forge');

function encryptHmac(key, value) {
  const hmac = forge.hmac.create();

  hmac.start('sha256', key);
  hmac.update(value);

  return hmac.digest().toHex();
}

export const isStaging = () =>
  window.location.href.indexOf('http://localhost:8080') > -1 ||
  window.location.href.indexOf('https://tix-staging.netlify.app') > -1;

const getIntercomSettings = (user) => {
  const hmac = isStaging() ? process.env.INTERCOM_HMAC_KEY : process.env.INTERCOM_HMAC_KEY;

  if (user && user.email) {
    return {
      user_id: user.id,
      userid: user.id,
      email: user.email,
      name: user.firstName,
      no_of_events_created: user.events.edges.length,
      no_of_free_events: user.noOfFreeEvents,
      no_of_paid_events: user.noOfPaidEvents,
      account_type: user.accountType,
      bank_account_details: !!user.bank_account,
      signup_date: moment.unix(user.createdAt).format('MMM DD, YYYY'),
      user_hash: user.email ? encryptHmac(hmac || '', user.email) : null,
      app_id: process.env.INTERCOM_ID,
    };
  }

  return { app_id: process.env.INTERCOM_ID };
};

export default {
  loginIntercom(user) {
    window.Intercom('boot', getIntercomSettings(user));
    window.Intercom('update');
  },

  logoutIntercom() {
    window.Intercom('shutdown');
    window.Intercom('boot', getIntercomSettings());
  },

  bootIntercom() {
    window.Intercom('shutdown');
    window.Intercom('boot', getIntercomSettings());
  },
};
