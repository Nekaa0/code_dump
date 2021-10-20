<template>
  <el-select filterable v-model="selected" placeholder="" @change="update">
    <el-option
      v-for="bank in banks"
      :key="bank.code"
      :label="bank.name"
      :value="bank.code">
    </el-option>
  </el-select>
</template>

<script>
import { Select, Option } from 'element-ui';
import LIST_BANKS from '@/graphql/ListBanks.gql';

export default {
  name: 'bank-select',
  props: {
    value: String,
  },
  data() {
    return {
      selected: this.value,
      banks: [],
    };
  },
  components: {
    ElSelect: Select,
    ElOption: Option,
  },
  apollo: {
    banks: {
      query: LIST_BANKS,
      update: data => data.banks,
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