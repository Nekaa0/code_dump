<template>
  <div class="wrap">
    <el-upload
      class="avatar-uploader"
      action="https://jsonplaceholder.typicode.com/posts/"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload">
      <img v-if="imageUrl" :src="imageUrl" class="avatar" :style="styleObject">
      <i v-else class="el-icon-plus avatar-uploader-icon" :style="styleObject"></i>
    </el-upload>
    <div class="instructions">
      <div>
        <span class="instructions--title">Organizer Logo</span>
        <span class="instructions--helper">Click to upload</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Upload } from 'element-ui';

export default {
  props: {
    size: {
      type: Number,
      default: 100,
    },
  },
  components: {
    ElUpload: Upload,
  },
  data() {
    return {
      imageUrl: '',
      styleObject: {
        width: `${this.size}px`,
        height: `${this.size}px`,
        lineHeight: `${this.size}px`,
      },
    };
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      return file;
    },
  },
};
</script>

<style lang="scss" scoped>
  .wrap {
    display: flex;
    margin-bottom: 20px;
  }

  .avatar-uploader {
    flex: 0 0 1;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;

    .el-upload {
      cursor: pointer;
      position: relative;
      overflow: hidden;
      :hover {
        border-color: #409EFF;
      }
    }
    &-icon {
      font-size: 2.8rem;
      color: #8c939d;
      text-align: center;
    }
  }

  .avatar {
    display: block;
  }

  .instructions {
    display: flex;
    align-items: center;
    margin-left: 20px;
    span {
      display: block;
      clear: both;
    }
    &--helper {
      font-size: 1.3rem;
      margin-top: 5px;
      color: #CCC;
    }
  }
</style>