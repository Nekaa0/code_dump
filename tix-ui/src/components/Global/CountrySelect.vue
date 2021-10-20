<template>
  <el-select filterable v-model="selected"  value-key="selected" @change="update">
    <el-option
      v-for="country in countries"
      :key="country.code"
      :label="country.name"
      :value="country.code">
    </el-option>
  </el-select>
</template>

<script>
import { Select, Option } from 'element-ui';


export default {
  name: 'provider-select',
  props: {
    value: String,
  },
  data() {
    return {
      countries: [
       { name: 'Nigeria', code: 'NG' },
       { name: 'Ghana', code: 'GH' },
       { name: 'South Africa', code: 'ZA' },
      ],
      selected: this.value,
    };
  },
  components: {
    ElSelect: Select,
    ElOption: Option,
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
