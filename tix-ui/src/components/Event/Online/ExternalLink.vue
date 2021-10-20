<template>
  <div>
      <asterisk title="add the meeting link for an external service" />
      <div class="link--textarea" v-if="finalPage === ''">
      <el-form :model="formData" :rules="rules" ref="externalLinkForm">
        <el-input type="textarea" :autosize="{ minRows: 6}" 
          placeholder="ensure the details are correct and that meeting passwords are included,this information will be sent to all attendees after successful registration and/or payment" 
          v-model="formData.link"></el-input>
        <div class="buttons">
          <button class="u-button u-button--grey" @click="goToPreviousPage"  >
            back
          </button>
          <button class="u-button" @click.prevent="save">
          <i v-if="processing" class="el-icon-loading"></i>
            save
          </button>
          <router-link class="skip" :to="{name: 'ListEvents'}">skip and do this later</router-link>
      </div>
      </el-form>
      </div>
      <div v-else>
      <complete-zoom-event />
    </div>
  </div>  
</template>

<script>
import Asterisk from '@/components/Global/Asterisk';
import CREATE_EXTERNAL_MEETING from '@/graphql/CreateExternalMeeting.gql';
import ErrorHandler from '@/helpers/error-handler';

export default {
  name: 'external-link',
  props: {
    goToPreviousPage: Function,
    eventId: String,
    slug: String,
  },
  components: {
    Asterisk,
  },
  data() {
    return {
      finalPage: '',
      processing: false,
      formData: {
        event: this.eventId,
        link: '',
      },
      rules: {
        link: [
          { required: true, trigger: 'blur, change', message: 'please add a valid link to your online event' },
        ],
      },
    };
  },
  methods: {
    save() {
      this.$refs.externalLinkForm.validate((valid) => {
        this.processing = true;
        if (valid) {
          this.$apollo.mutate({
            mutation: CREATE_EXTERNAL_MEETING,
            variables: this.formData,
          }).then(() => {
            this.$notify({
              type: 'success',
              title: 'link created',
              message: 'meeting link was created successfuly.',
            });
            this.$router.push(`/events/manage/${this.slug}`);
          }).catch((error) => {
            this.processing = false;
            ErrorHandler.throwGraphQLError(error);
          });
        } else {
          this.$message.error('please review the errors and try again');
        }
      });
    },
  },
};
</script>

<style lang="scss">
  .el-textarea__inner {
    border-radius: 4px;
  }
</style>
<style lang="scss" scoped>
  .buttons {
    margin-top: 5rem;
    display: flex;
    align-items: center;
    @media screen and (max-width: 450px) {
      display: block;
    }
  }
  .u-button {
    margin-right: 1.6rem;
    margin-left: 0;
  }
  .skip {
    color: $--color-pink;
    font-size: 1.4rem;
    @media screen and (max-width: 420px) {
      padding-top: 2rem;
      display: block;
    }
  }
  .link--textarea {
    margin-top: 1.7rem;
  }
</style>
