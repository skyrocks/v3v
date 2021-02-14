<template>
  <el-container>
    <el-header class="container">
      <Header></Header>
    </el-header>
    <div class="line"></div>
    <el-main class="container">
      <router-view />
    </el-main>
  </el-container>
</template>
<script setup>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import Header from '../components/Header.vue'
</script>

<style lang="scss" scoped>
  .container {
    padding: 0 45px;
  }
  .line {
    height: 1px;
    background-color: #e0e6ed;
  }
</style>
