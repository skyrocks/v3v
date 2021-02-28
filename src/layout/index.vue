<template>
  <el-container>
    <el-header style="padding: 0 40px">
      <Header />
    </el-header>
    <div class="line"></div>
    <el-main style="padding: 0">
      <router-view />
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Header from './Header.vue'
</script>

<style lang="scss" scoped>
.line {
  height: 1px;
  background-color: $--color-line-split;
}
</style>
