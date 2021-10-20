<template> 
  <el-row :gutter="10">
    <el-col :span="16" :xs="24">
      <el-input placeholder="full address" v-model="address" @input="update" />
    </el-col>
    <el-col :span="8" :xs="24">
      <el-dropdown trigger="click">
        <el-button class="google-location" plain trigger="click">
          set map coordinates 
          <i v-if="lng || lat" class="el-icon-success highlighted el-icon--right"></i>
          <i v-else><img class="location-svg" src="@/assets/location.svg" alt=""></i>
        </el-button>
        <el-dropdown-menu class="dropdown" slot="dropdown">
          <div v-if="useGoogle">
            <div class="el-input" v-if="googleIsLoaded">
              <autocomplete 
                ref="google-autocomplete"
                id="google-autocomplete"
                classname="el-input__inner"
                @placechanged="setCoordinates"
                country="ng">
              </autocomplete>
            </div>
            <el-input :disabled="true" v-else placeholder="loading google autocomplete..." />
            <div class="autocomplete-results">
              <div>longitude: {{ lng || 'not set' }}</div>
              <div>latutude: {{ lat || 'not set' }}</div>
              <div v-if="route">route: {{ route || 'not set' }}</div>
            </div>
          </div>
          <div v-else>
            <input-digits v-model="lng" placeholder="longitude" @input="update" />
            <input-digits v-model="lat" placeholder="lat" @input="update" />
          </div>
          <el-checkbox class="is-input-toggle" v-model="useGoogle">use google autocomplete</el-checkbox>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>
import { Dropdown, DropdownMenu } from 'element-ui';
import VueGoogleAutocomplete from 'vue-google-autocomplete';
import InputDigits from './InputDigits';

export default {
  components: {
    Autocomplete: VueGoogleAutocomplete,
    ElDropdown: Dropdown,
    ElDropdownMenu: DropdownMenu,
    InputDigits,
  },
  props: {
    defaults: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      useGoogle: true,
      googleIsLoaded: window.google,
      address: this.defaults.address,
      lng: this.defaults.lng,
      lat: this.defaults.lat,
      route: null,
    };
  },
  created() {
    if (!this.googleIsLoaded) {
      this.loadGoogleAPI();
    }
  },
  methods: {
    loadGoogleAPI() {
      const script = document.createElement('script');
      script.setAttribute('src', `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}&libraries=places`);
      script.onload = () => {
        script.onreadystatechange = null;
        script.onload = null;
        this.googleIsLoaded = true;
      };
      script.onreadystatechange = script.onload;
      document.head.appendChild(script);
    },
    setCoordinates(addressData) {
      this.lng = addressData.longitude;
      this.lat = addressData.latitude;
      this.route = addressData.route;
      this.update();
    },
    update() {
      this.$emit('update', {
        address: this.address,
        lng: this.lng,
        lat: this.lat,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .location-svg {
    padding-left: 1rem;
  }

  i.highlighted {
    color: $color-orange;
  }

  .dropdown {
    padding: 20px;
    .el-input {
      width: 300px;
      display: block;
      &:first-child {
        margin-bottom: 10px;
      }
    }
    .autocomplete-results {
      font-size: 1.4rem;
      opacity: 0.5;
      > div:not(:last-child) {
        margin-bottom: 5px;
      }
    }
  }
  .google-location {
    padding: 0.9rem 2rem;
    line-height: 1.2;
    font-weight: 300;
    height: 4rem;
    @media screen and (max-width: 768px) {
      margin-top: 0.4rem;
    }
  }
</style>
