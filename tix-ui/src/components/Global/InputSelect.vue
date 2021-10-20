<template>
  <el-select class="select" v-model="formData.eventCategory" >
    <el-option label="zone one" value="shanghai"></el-option>
    <el-option label="zone two" value="beijing"></el-option>
  </el-select>
</template>

<script>
  export default {
    name: 'input-select',
  };
</script>
