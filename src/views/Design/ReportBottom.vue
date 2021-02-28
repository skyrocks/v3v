<template>
  <ul class="wrap">
    <li>
      单元格类型
      <el-radio-group v-model="status.type" size="mini" @change="handleChangeType">
        <el-radio label="1">普通格</el-radio>
        <el-radio label="2">导航格</el-radio>
      </el-radio-group>
    </li>
    <li>
      搜寻的方向
      <el-radio-group v-model="status.direction" size="mini" :disabled="status.type === '1'">
        <el-radio label="none">不搜寻</el-radio>
        <el-radio label="down">向下</el-radio>
        <el-radio label="right">向右</el-radio>
        <el-radio label="up">向上</el-radio>
        <el-radio label="left">向左</el-radio>
      </el-radio-group>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  setup() {
    const status = reactive<{
      type: string
      direction: string
    }>({ type: '1', direction: 'none' })

    const handleChangeType = val => {
      if (val === '1') {
        status.direction = 'none'
      }
    }
    return { status, handleChangeType }
  }
})
</script>

<style lang="scss" scoped>
.wrap {
  padding: 10px;
  margin: 0;
  list-style-type: none;
  li {
    padding: 6px;
  }
}
</style>
