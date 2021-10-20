<template>
  <div v-if="organizations.length">
    <el-select v-model="selected" :placeholder="placeholder" @change="update">
      <el-option
        v-for="organization in organizations"
        :key="organization.id"
        :label="organization.name"
        :value="organization.id ">
      </el-option>
    </el-select>
  </div>
   <p v-else>
    Want to quit using your personal account for payment? </br> 
    Create a <router-link :to="{name: 'ListOrganizations'}"> 
      <b> verified organization </b> 
    </router-link> for collections.
  </p>
</template>

<script>
import { Select, Option } from 'element-ui';
import LIST_VERIFIED_ORGANIZATIONS from '@/graphql/ListVerifiedOrganizations.gql';

export default {
  name: 'organization-select',
  props: {
    value: {
      type: [Object, String],
    },
  },
  data() {
    return {
      selected: this.value,
      organizations: [],
    };
  },
  components: {
    ElSelect: Select,
    ElOption: Option,
  },
  apollo: {
    organizations: {
      query: LIST_VERIFIED_ORGANIZATIONS,
      update: data => data.currentUser.verified_organizations.edges.map(value => value.node),
      fetchPolicy: 'network-only',
    },
  },
  computed: {
    placeholder() {
      return this.$apollo.queries.organizations.loading ? 'Fetching organizations' : 'Choose your organization';
    },
  },
  methods: {
    update() {
      this.$emit('input', this.selected);
      this.$emit('update', {
        owner: this.selected,
        owner_type: 'Organization',
        defaultOrganization: this.selected,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
</style>