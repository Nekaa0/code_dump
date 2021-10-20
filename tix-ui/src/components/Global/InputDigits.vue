<template>
  <el-input type="tel" v-model="formattedValue" :placeholder="placeholder" :disabled="disabled">
    <template v-if="prepend" slot="prepend">{{ prepend }}</template>
  </el-input>
</template>

<script>
export default {
  props: {
    value: {
      type: [Number, String],
      default: '',
    },
    placeholder: {
      type: String,
    },
    prepend: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    formattedValue: {
      get() {
        return this.value;
      },
      set(newValue) {
        const oldValue = this.value;
        if (newValue === oldValue) return;
        if (isNaN(newValue)) {
          setTimeout(() => {
            this.$emit('input', oldValue);
          }, 20);
        }
        this.$emit('input', newValue);
      },
    },
  },
};
</script>
