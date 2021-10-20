const Capitalize = {
  filters: {
    capitalize(value) {
      if (!value) return '';
      const stringValue = value.toString();
      return `${stringValue.charAt(0).toUpperCase()}${stringValue.slice(1)}`;
    },
  },
};

export default Capitalize;
