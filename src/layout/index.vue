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
<script lang="ts">
import { defineComponent } from 'vue'
import Header from './Header.vue'

export default defineComponent({
  components: { Header }
})
</script>

<style lang="scss" scoped>
.line {
  height: 1px;
  background-color: $--color-line-split;
}
</style>
