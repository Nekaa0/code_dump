var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  GOOGLE_API_KEY: '"AIzaSyAxc8nUYwdPKwcidFEW3gFng2wmwx3rskc"',
  API_URL: '"http://0.0.0.0:3000/graphql"',
  ACTION_CABLE_URL: '"ws://selltix-staging.herokuapp.com"',
  // ACTION_CABLE_URL: '"ws://c742f7db.ngrok.io"',
  ADMIN_API_URL: '"http://localhost:5000/tix_admin/graphql"',
  PAYSTACK_NG_PUBLIC_KEY: '"pk_test_efd1e4a768822569cf29fa44fa16ff19ae309b58"',
  PAYSTACK_GH_PUBLIC_KEY: '"pk_test_5a44a623609a14d8fcc6ce25aad48c09cce8a467"',
  PAYSTACK_SA_PUBLIC_KEY: '"pk_test_0aae37b6644f82cf00326a16a03801bff8ef4c70"',
  FLUTTERWAVE_PUBLIC_KEY: '"FLWPUBK_TEST-23b929df11e177bcd84c6213dd283e77-X"',
  GOOGLE_ANALYTICS_ID: '"UA-61268242-2"',
  INTERCOM_ID: '"qmq7ijrz"',
  INTERCOM_HMAC_KEY: '""',
  ZOOM_CLIENT_ID: '"_l0NIpXsTfOqetQzf4QDHw"',
  ZOOM_REDIRECT_URL: '"https://tix-staging.netlify.app/oauth/code"',
  CUSTOM_EMAIL: '"o.umukoro@mixtafrica.com,events@tix.africa,kazeem@tix.africa"'
})
