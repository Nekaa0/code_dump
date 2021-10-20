<template>
  <el-upload
    class="uploader"
    action="/"
    :file-list="fileList"
    :show-file-list="config.showFileList"
    :auto-upload="false"
    :accept="config.format"
    :limit="limit"
    :on-change="upload"
    :on-exceed="replace"
    :on-remove="reset">
    <div class="uploader__thumbnail"
      :class="[eventType === 'live'? 'live-event-background' : 'online-event-background']" v-if="mode === 'picture'">
      <img v-if="value" :src="value" class="uploader__preview" :class="{'uploader__preview--muted': uploading}" >
      <div class="uploader__placeholder" :class="{'uploader__empty-upload-error': uploadIsEmpty}" v-else>
      </div>
      <div class="uploader__thumbnail-button">
        <img class="pencil" src="@/assets/pencil.svg" alt="">
      </div>
    </div>
    <div class="uploader__file" v-if="mode === 'file'">
      <img class="pencil" src="@/assets/pencil.svg" alt="">
    </div>
  </el-upload>
</template>

<script>
import { Upload, Progress } from 'element-ui';
import CloudUpload from '@/helpers/cloudinary';

export default {
  name: 'upload',
  props: {
    value: String,
    mode: {
      type: String,
      default: 'file',
    },
    format: {
      type: String,
      default: 'image/*',
    },
    limit: {
      type: Number,
      default: 1,
    },
    uploadIsEmpty: {
      type: Boolean,
      default: false,
    },
    backgroundColor: {
      type: String,
    },
    eventType: {
      type: String,
    },
  },
  components: {
    ElUpload: Upload,
    ElProgress: Progress,
  },
  data() {
    const fileList = [];
    if (this.value) {
      fileList.push({
        name: this.value,
        url: this.value,
      });
    }

    return {
      fileList,
      preview: null,
      uploading: false,
      uploadTask: new CloudUpload({
        cloudName: 'helloworld-ng',
      }),
    };
  },
  computed: {
    config() {
      const configs = {
        file: {
          showFileList: true,
          preset: 'filePreset',
          format: 'image/*,.pdf',
        },
        picture: {
          showFileList: false,
          preset: 'imagePreset',
          format: 'image/*',
        },
      };
      return configs[this.mode] || configs.file;
    },
    uploadButtonText() {
      if (this.uploading) return `Uploading - ${this.uploadTask.progress}%`;
      return this.value ? 'Change File' : 'Choose File';
    },
  },
  methods: {
    async upload(file) {
      this.uploading = true;
      const fileBinary = file.raw || file;
      this.preview = URL.createObjectURL(fileBinary);
      const uploadResponse = await this.uploadTask.send(fileBinary, this.config.preset);
      let url = uploadResponse.secure_url;
      if (uploadResponse.eager) url = uploadResponse.eager[0].secure_url;
      this.$emit('input', url);
      this.uploading = false;
    },
    reset() {
      if (this.uploading) {
        this.uploadTask.cancel();
        this.uploading = false;
      }
      this.$emit('input', null);
    },
    replace(files) {
      this.fileList = [files[0]];
      this.upload(files[0]);
    },
  },
};
</script>

<style lang="scss" scoped>
$--color-danger: #f56c6c;
.live-event-background {
  background-color: $--color-pink;
}
.online-event-background {
  background-color: $--color-green;
}
.uploader {
  width: 100%;
  &__placeholder {
    padding: 20px 0;
  }
  &__empty-upload-error {
    border: 1px solid $--color-danger;
    border-radius: 6px;
  }
  &__thumbnail {
    width: 10rem;
    height: 10rem; // 100%
    overflow: hidden;
    line-height: 0;
    position: relative;
    border-radius: 5px;
    border: dotted 1px rgba(0,0,0,0.1);
    text-align: center;
    background-image: url('~@/assets/upload-background.svg');
  }
  &__thumbnail-button {
    position: absolute;
    top: 80%;
    left: 76%;
    transform: translateX(-40%) translateY(-40%);
  }
  &__preview  {
    width: 100%;
    height: 100%;
    object-fit: cover;
    &--muted {
      opacity: 0.1;
    }
  }
  &__dragger {
    width: 100%;
  }
}
</style>
