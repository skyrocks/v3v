<template>
  <Group></Group>
  <el-container>
    <el-aside>
      <p>Design</p>
      <Menu />
    </el-aside>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import Menu from './Menu.vue'
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import Group from './Group.tsx'
</script>
