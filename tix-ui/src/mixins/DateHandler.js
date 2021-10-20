import moment from 'moment';

const DateHandler = {
  methods: {
    formateDate(date) {
      return moment.unix(date).format('ddd. MMM D, YYYY').toLowerCase();
    },
    formateDateMobile(date) {
      return moment.unix(date).format('MMM D YYYY').toLowerCase();
    },
  },
};

export default DateHandler;
