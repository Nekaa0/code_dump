import Auth from '@/helpers/auth';

const Country = {
  computed: {
    currency() {
      return Auth.userCurrency();
    },
    country() {
      return Auth.userCountry();
    },
    countryFees() {
      return Auth.countryFees();
    },
  },
};

export default Country;
