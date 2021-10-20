const IsPhone = {
  data() {
    return {
      isPhone: null,
    };
  },
  created() {
    this.checkDeviceSize();
    window.addEventListener('resize', this.checkDeviceSize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkDeviceSize);
  },
  methods: {
    checkDeviceSize() {
      this.isPhone = document.documentElement.clientWidth < 600;
    },
  },
};

export default IsPhone;
