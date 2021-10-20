import moment from 'moment';

export function removeEmptyValues(obj) {
  const o = JSON.parse(JSON.stringify(obj));

  Object.keys(o).forEach((key) => {
    if (o[key] && typeof o[key] === 'object') {
      o[key] = this.removeEmptyValues(o[key]);
    } else if (o[key] === undefined || o[key] === null) {
      delete o[key];
    } else {
      o[key] = o[key];
    }
  });

  return o;
}

export function formatDatesAsDuration(start, end) {
  const startDate = moment.unix(start).utc();
  const endDate = moment.unix(end).utc();
  if (startDate.isSame(endDate, 'day')) {
    const day = startDate.format('dddd MMMM D YYYY');
    const startTime = startDate.format('h:mm a');
    const endTime = endDate.format('h:mm a');
    return `${day}, ${startTime} to ${endTime}`;
  }
  const startTime = startDate.format('ddd MMM D YYYY, h:mm a');
  const endTime = endDate.format('ddd MMM D YYYY, h:mm a');
  return `${startTime} - ${endTime}`;
}

export function formatDate(string, format) {
  const date = moment.unix(string).utc();
  return date.format(format || 'dddd MMMM D YYYY');
}

export const validation = {
  isDigits(rule, value, callback) {
    if (isNaN(value)) {
      callback(new Error('Please enter only numbers'));
    } else {
      callback();
    }
  },
  isValidEmailCsv(rule, value, callback) {
    if (!value) {
      callback(new Error('Please enter a comma separated list of emails'));
      return;
    }
    const emails = value.replace(/\n/g, ',').split(',');

    const invalidEmails = [];
    emails.forEach((email) => {
      const re = /\S+@\S+\.\S+/;
      if (email !== '' && email !== ' ' && !re.test(email)) {
        invalidEmails.push(email);
      }
    });

    if (invalidEmails.length > 0) {
      callback(new Error('Please enter a valid comma separated list of emails'));
    } else {
      callback();
    }
  },
  isAlphabetic(rule, value, callback) {
    if (/^[a-zA-Z]+$/.test(value)) {
      callback();
    } else {
      callback(new Error('input must be alphabetic'));
    }
  },
  isNumeric(rule, value, callback) {
    if (/^\d+$/.test(value)) {
      callback();
    } else {
      callback(new Error('input must be numeric'));
    }
  },
  RCNumber(rule, value, callback) {
    if (/^(RC)?[0-9]{5,8}$/.test(value) || /^(BN)?[0-9]{5,8}$/.test(value)) {
      callback();
    } else {
      callback(new Error('Please enter your registration number in the correct format including the RC/BN'));
    }
  },
};

export function formatToMoney(number, currency, fractionDigits) {
  const getNumber = parseFloat(number, 0);
  const formattedNumber = getNumber.toLocaleString('en-US', { minimumFractionDigits: fractionDigits });

  return `${currency} ${formattedNumber}`;
}

export function isValidURL(mediaType, url) {
  const socialMedia = {
    fb: 'facebook.com',
    in: 'instagram.com',
    tw: 'twitter.com',
  };
  const urlRegex = new RegExp(`^https?:/.+${socialMedia[mediaType]}`, 'g');
  return (url.match(urlRegex) ? url : `https://${socialMedia[mediaType]}/${url}`);
}

export function isValidHttpURL(url) {
  return (url.match('^http?://') || url.match('^https?://') ? url : `http://${url}`);
}

export function isValidDomain(url) {
  if (url === '' || url === null) return true;
  const validDomain = /^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$/.test(url);
  const validProtocol = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url);
  if (validDomain || validProtocol) {
    return true;
  }

  return false;
}

export function formatNumberToDecimal(number, decimals) {
  const getNumber = parseFloat(number, 0);
  const formattedNumber = getNumber.toLocaleString('en-US', { minimumFractionDigits: decimals });

  return formattedNumber;
}

export function formatAccountNumber(number) {
  if (number.length !== 10) { return new Error('Please pass in a 10 digit account number'); }
  const last4digits = number.slice(6, 10);

  return `******${last4digits}`;
}

export function formatKoboToActualValue(value) {
  return parseFloat(value / 100).toFixed(2);
}
