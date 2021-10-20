<template>
  <div>
    <el-form :model="formData" :rules="rules" ref="organizationForm">
      <el-form-item label="organization name" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item :label="descriptionLabel" prop="description">
        <el-input type="textarea" :autosize="{ minRows: 2}" v-model="formData.description" />
      </el-form-item>
      <el-form-item label="organization phone number" prop="phone">
        <el-input type="tel" v-model="formData.phone" />
      </el-form-item>
      <el-form-item label="twitter url" prop="twitter">
        <el-input v-model="formData.twitter" placeholder="https://twitter.com/handle">
          <template slot="prepend">https://</template>
        </el-input>
      </el-form-item>
      <el-form-item label="facebook page uRL" prop="facebook">
        <el-input v-model="formData.facebook" placeholder="https://facebook.com/@page" >
          <template slot="prepend">https://</template>
        </el-input>
      </el-form-item>
      <el-form-item label="website url" prop="website">
        <el-input v-model="formData.website" placeholder="https://website.com" />
      </el-form-item>
      <div class="u-panel-footer">
        <button native-type="submit" class="u-button" @click.prevent="save">
          <i v-if="processing" class="el-icon-loading"></i>
          save
        </button>
      </div>
    </el-form>
  </div>
</template>

<script>
import InputGroup from '@/components/Global/InputGroup';
import InputLocation from '@/components/Global/InputLocation';
import InputDatetime from '@/components/Global/InputDatetime';

export default {
  props: {
    name: String,
    description: String,
    phone: [Number, String],
    facebook: String,
    twitter: String,
    website: String,
    logo: String,
    processing: Boolean,
  },
  components: {
    InputGroup,
    InputLocation,
    InputDatetime,
  },
  computed: {
    descriptionLabel() {
      return `What does ${this.formData.name || 'your organization'} do?`;
    },
  },
  data() {
    return {
      formData: Object.assign({}, this.$props),
      rules: {
        name: [
          { required: true, trigger: 'blur, change' },
        ],
        description: [
          { required: true, trigger: 'blur, change' },
        ],
        phone: [
          { required: true, trigger: 'blur' },
        ],
        twitter: [
          { type: 'url', trigger: 'blur, change', message: 'Invalid URL' },
        ],
        facebook: [
          { type: 'url', trigger: 'blur, change', message: 'Invalid URL' },
        ],
        website: [
          { required: false, trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    save() {
      this.$refs.organizationForm.validate((valid) => {
        if (valid) {
          this.$emit('save', this.formData);
        } else {
          this.$message.error('Please review the errors and try again');
        }
      });
    },
  },
};
</script>