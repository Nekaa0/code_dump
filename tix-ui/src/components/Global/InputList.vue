<template>
  <div>
    <div class="input-wrap" v-for="(text, index) in inputs" :key="index">
      <el-input class="input" :ref="index" v-model="text.value" :placeholder="placeholder" @input="emit">
        <a slot="suffix" @click="remove(index)"><i class="el-icon-remove el-input__icon"></i></a>
      </el-input>
    </div>
    <a @click="add" :class="{'disabled': !allInputsFilled}"><i class="el-icon-plus"></i> add</a>
  </div>
</template>

<script>
export default {
  props: {
    value: String,
    placeholder: String,
  },
  data() {
    return {
      inputs: [],
    };
  },
  created() {
    const newValueAsArray = this.value ? this.value.split('/n').map(text => ({ value: text })) : [];
    this.inputs = newValueAsArray;
  },
  watch: {
    value(newVal) {
      const expectedValue = newVal;
      const actualValue = this.convertToString(this.inputs);
      if (expectedValue !== actualValue) {
        const newValueAsArray = newVal ? newVal.split('/n').map(text => ({ value: text })) : [];
        this.inputs = newValueAsArray;
      }
    },
  },
  computed: {
    allInputsFilled() {
      return this.inputs.every(text => text.value);
    },
  },
  methods: {
    add() {
      this.inputs.push({ value: '' });
    },
    remove(index) {
      this.inputs.splice(index, 1);
      this.emit();
    },
    emit() {
      if (!this.inputs.length) return null;
      this.$emit('input', this.convertToString(this.inputs));
      return this.convertToString(this.inputs);
    },
    convertToString(inputs) {
      const inputValues = inputs.filter(text => text.value).map(text => text.value);
      return inputValues.join('/n');
    },
  },
};
</script>

<style lang="scss" scoped>
a {
  color: $color-orange;
  &.disabled {
    color: #CCC;
    pointer-events: none;
  }
}
.input-wrap {
  margin-bottom: 5px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
