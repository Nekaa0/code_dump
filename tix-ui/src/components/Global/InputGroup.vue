<template>
  <div class="wrap">
    <label v-if="showLabel" :for="name">{{labelText}}</label>
    <el-form-item :prop="name">
      <el-input :type="type" :name="name" :value="value" v-if="isInput"></el-input>
      <el-input type="textarea" :name="name" :autosize="{ minRows: rows }" :value="value" v-else></el-input>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    value: '',
    type: {
      type: String,
      default: 'text',
      validator(value) {
        const types = ['text', 'email', 'phone', 'number', 'password'];
        return types.indexOf(value) > -1;
      },
    },
    name: {
      type: String,
      required: true,
    },
    showLabel: {
      type: Boolean,
      default: true,
    },
    label: {
      type: String,
    },
    textarea: {
      type: Boolean,
      default: false,
    },
    rows: {
      type: Number,
      default: 2,
    },
    autoExpand: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      expandingTextarea: null,
      isInput: !this.textarea,
      inputVal: this.value,
    };
  },
  watch: {
    value(val) {
      this.$emit('input', val);
    },
  },
  computed: {
    labelText() {
      return this.label || this.name;
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
