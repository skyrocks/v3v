<template>
  <el-dialog v-model="state.dialogVisible" title="数据集" width="70%">
    <el-table :data="state.data" :height="getAppHeight() * 0.6">
      <el-table-column v-for="(col, idx) in state.fields" :key="idx" :property="col" :label="col"></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { getAppHeight } from '@/utils/index'

export default defineComponent({
  setup() {
    const state = reactive<{ dialogVisible: boolean; data: any[]; fields: string[] }>({
      data: [],
      fields: [],
      dialogVisible: false
    })

    const setData = data => {
      state.dialogVisible = true
      state.fields = data.fields
      state.data = data.data
    }

    return { state, setData, getAppHeight }
  }
})
</script>
