<template>
  <div>
    <list-card
      :title="name"
      :description="description"
      :hideStatus="true"
      :bottomRightLabel="verificationStatus"
      :showEdit="!verified"
      :showVerify="!verified"
      :showDelete="false"
      @edit="editDialogVisible = true"
      @verify="verificationDialogVisible = true"
    />
    <el-dialog :title="`Edit ${name}`" width="500px" :visible.sync="editDialogVisible" :append-to-body="true">
      <organization-form v-bind="$props" :processing="processing" @save="edit" />
    </el-dialog>
    <el-dialog :title="`Verify ${name}`" width="500px" :visible.sync="verificationDialogVisible" :append-to-body="true">
      <verification-form :id="id" :slug="slug" @complete="onVerify" />
    </el-dialog>
  </div>
</template>

<script>
import { Dialog } from 'element-ui';
import EDIT_ORGANIZATION from '@/graphql/EditOrganization.gql';
import ListCard from '@/components/Global/ListCard';
import ErrorHandler from '@/helpers/error-handler';
import OrganizationForm from './Form';
import VerificationForm from './VerificationForm';

export default {
  components: {
    ElDialog: Dialog,
    ListCard,
    OrganizationForm,
    VerificationForm,
  },
  props: {
    id: String,
    slug: String,
    name: String,
    description: String,
    phone: String,
    facebook: String,
    twitter: String,
    website: String,
    logo: String,
    verified: Boolean,
  },
  data() {
    return {
      processing: false,
      editDialogVisible: false,
      verificationDialogVisible: false,
    };
  },
  computed: {
    verificationStatus() {
      return this.verified ? 'Verified' : 'Awaiting Verification';
    },
  },
  methods: {
    onVerify() {
      this.verificationDialogVisible = false;
      this.$emit('update');
    },
    edit(newValues) {
      this.processing = true;
      this.$apollo.mutate({
        mutation: EDIT_ORGANIZATION,
        variables: Object.assign({ id: this.id }, newValues),
      }).then(() => {
        this.$message.success('Updated');
        this.editDialogVisible = false;
        this.$emit('updated');
      }).catch((error) => {
        this.processing = false;
        ErrorHandler.throwGraphQLError(error);
      });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
