<template>
  <div>
    <navigation></navigation>
      <main>
        <div class="products--page">
            <div class="youtube--video">
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/playlist?list=PLNKUZ_QNA1_evnvxdfpPy-Oy4PPUYfI78"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
              </iframe>
              <p class="youtube--video__caption">check out these videos to see tix in action</p>
              <div class="download-icons">
                <a href="https://apps.apple.com/us/app/tix-africa/id1513743943" target="_blank">
                  <img src="../assets/app-store.svg" />
                </a>
                <a href="https://play.google.com/store/apps/details?id=africa.tix.app&hl=de&gl=US" target="_blank">
                  <img src="../assets/play-store.svg" />
                </a>
              </div>
            </div>
            <div class="products--description">
              <h1 class="products--description__header">simple solutions for events of all sizes</h1>
              <section class="ticketing">
                <h5 class="header">ticketing</h5>
                <p class="description">create a customizable event page in less than 5 minutes.</p>
              </section>
              <section class="access--control">
                <h5 class="header">access control</h5>
                <p class="description">nobody likes waiting in line so get guests in faster when you scan qr codes with tix access instead of manually checking a guestlist. go further with rfid tags that are impossible to duplicate and block duplicate entries to prevent passbacks and further secure your event.</p>
              </section>
              <section class="cashless--payments">
                <h5 class="header">cashless payments</h5>
                <p class="description">attendees can load credits unto their cashless wristband at one of the designated stations on-site, or via the mobile platform. this allows attendees to tap to pay at different vendors throughout the event. the best part? no internet connectivity required.</p>
              </section>
              <div class="cta--block">
                <button class="u-button" native-type="submit">contact sales</button>
              </div>
            </div>
        </div>
        <div class="footer-block">
          <el-footer></el-footer>
        </div>
      </main>
    </div>
</template>

<style lang="scss" scoped>
  .products--page {
    margin-left: 5.2%;
    padding-top: 9.1rem;
    margin-right: 8.6%;
    display: flex;
    justify-content: space-between;
    @media screen and (max-width: 992px) {
      position: relative;
      flex-direction: column;
      margin: 0 6%;
      padding-top: 3.5em;
    }
  }
  .youtube--video {
    width: 52%;
    &__caption {
      text-align: center;
      font-size: 1.25em;
      font-weight: 300;
      line-height: 1.2;
      padding-top: 3rem;
      margin: 0;
      @media screen and (max-width: 992px) {
        position: absolute;
        top: 100%;
        font-size: 1.2rem;
        padding-top: 1em;
        margin: 0;
      }
    }
    .download-icons {
      margin-top: 30px;
      text-align: center;

      @media screen and (max-width: 992px) {
        position: absolute;
        top: 100%;
        margin-top: 50px;
      }
    }
    @media screen and (max-width: 992px) {
      position: relative;
      width: 100%;
      padding-bottom: 56.25%;
      margin-bottom: 2.5em;
      display: flex;
      justify-content: center;
    }
  }
    iframe {
      width: 100%;
      height: 95%;
      @media screen and (max-width: 992px) {
        position: absolute;
        top:0;
        left: 0;
        width: 100%;
        height: 100%;
      }
  }
  .products--description {
    text-align: left;
    font-weight: 300;
    width: 44.5%;
    @media screen and (max-width: 992px) {
      width: 100%;
      padding-left: 0;
      margin-top: 4em;
    }
    &__header {
      line-height: 1.2;
      text-transform: lowercase;
      font-size: 1.75em;
      margin: 0;
      padding-bottom: 3.6rem;
      @media screen and (max-width: 992px) {
        position: absolute;
        top: 1.5em;
        text-align: left;
        padding-bottom: 2rem;
        font-size: 1.6rem;
      }
    }
  }
  .description, .header {
    padding: 0;
    margin: 0;
    font-size: 1.125em;
    font-weight: 300;
    line-height: 1.4;
    @media screen and (max-width: 992px) {
      font-size: 1.2rem;
    }
  }
  .header {
      color: $--color-pink;
  }
  .access--control, .cashless--payments {
    margin-top: 2em;
  }
  .cta--block {
    display: flex;
    justify-content: center;
    padding: 0;
    margin: 4.1rem auto 0;
  }
  .u-button {
    width: 16.2rem;
    height: 4.2rem;
  }
  .footer-block {
    width: 46%;
    padding: 7.6rem 0 3.5rem;
    margin-left: auto;
    @media screen and (max-width: 767px) {
      width: 70%;
      margin-left: 0;
      padding: 4rem 5% 3.5rem;
    }
    @media screen and (max-width: 480px) {
      width: 100%;
    }
  }
</style>
