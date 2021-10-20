<template>  
  <el-form class="u-panel" :model="formData" :rules="rules" ref="aboutOrganizerForm">
    <el-form-item label="What type of event is this?" prop="owner_type" :show-message="false">
      <el-radio-group v-model="formData.owner_type">
        <el-radio-button label="user">Personal Event</el-radio-button>
        <el-radio-button label="organization">Organization Event</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <div v-if="formData.owner_type === 'user'">
      <el-form-item label="Twitter Handle">
        <el-input v-model="formData.twitter">
          <template slot="prepend">@</template>
        </el-input>
      </el-form-item>
      <el-form-item label="Facebook Page URL">
        <el-input v-model="formData.facebook"></el-input>
      </el-form-item>
      <el-form-item label="Website URL">
        <el-input v-model="formData.website"></el-input>
      </el-form-item>
    </div>
    <div class="u-panel-footer">
      <el-button native-type="submit" type="primary"   @click.prevent="save">Save</el-button>
    </div>
  </el-form>
</template>

<script>
import { RadioButton, RadioGroup, Button } from 'element-ui';

export default {
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  components: {
    ElRadioButton: RadioButton,
    ElRadioGroup: RadioGroup,
    ElButton: Button,
  },
  data() {
    const { owner_type, twitter, facebook, website } = this.value;
    return {
      formData: {
        owner_type,
        twitter,
        facebook,
        website,
      },
      rules: {
        facebook: [
          { type: 'url', trigger: 'blur, change', message: 'Please enter a valid URL' },
        ],
        website: [
          { type: 'url', trigger: 'blur, change', message: 'Please enter a valid URL' },
        ],
      },
    };
  },
  methods: {
    save() {
      this.$refs.aboutOrganizerForm.validate(async (valid) => {
        if (valid) {
          this.$emit('input', this.formData);
          this.$emit('close');
        } else {
          this.$message.error('Please review the errors and try again');
        }
      });
    },
  },
};
</script>