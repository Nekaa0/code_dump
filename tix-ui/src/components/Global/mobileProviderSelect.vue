<template>
  <el-select filterable v-model="selected" placeholder="" @change="update">
    <el-option
      v-for="provider in mobile_providers"
      :key="provider.id"
      :label="provider.provider_name"
      :value="provider.provider_name">
    </el-option>
  </el-select>
</template>

<script>
import { Select, Option } from 'element-ui';
import LIST_PROVIDERS from '@/graphql/ListMobileProviders.gql';

export default {
  name: 'provider-select',
  props: {
    value: String,
  },
  data() {
    return {
      selected: this.value,
      mobile_providers: [],
    };
  },
  components: {
    ElSelect: Select,
    ElOption: Option,
  },
  apollo: {
    mobile_providers: {
      query: LIST_PROVIDERS,
      update: data => data.FetchMobileProviders,
    },
  },
  methods: {
    update() {
      this.$emit('input', this.selected);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
</style>