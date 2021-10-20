 /* eslint-disable */
 export default function setupGoogleAnalytics() {
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-151889421-2');
}
