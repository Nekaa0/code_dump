const Scripts = {
  methods: {
    loadScript(url) {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.setAttribute('src', url);
        document.head.appendChild(script);
        script.onload = () => {
          resolve();
        };
      });
    },
  },
};

export default Scripts;
