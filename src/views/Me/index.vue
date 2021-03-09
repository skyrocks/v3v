<template>
  <div style="text-align: center">
    <el-button type="danger" @click="handleLogout">注销</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { removeToken } from '@/utils/token'

export default defineComponent({
  setup() {
    const handleLogout = () => {
      removeToken()
      location.href = import.meta.env.BASE_URL
    }
    return { handleLogout }
  }
})
</script>
