<template>
  <ul class="wrap">
    <li>
      单元格类型
      <el-radio-group v-model="state.type" size="mini" @change="handleChangeType">
        <el-radio label="nav">导航格</el-radio>
        <el-radio label="general">普通格</el-radio>
      </el-radio-group>
    </li>
    <li>
      搜寻的方向
      <el-radio-group
        v-model="state.direction"
        size="mini"
        :disabled="state.type === 'general'"
        @change="handleChangeDirection"
      >
        <el-radio label="down">向下</el-radio>
        <el-radio label="right">向右</el-radio>
        <el-radio label="up">向上</el-radio>
        <el-radio label="left">向左</el-radio>
        <el-radio label="none">不搜寻</el-radio>
      </el-radio-group>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import formulaHook from './formula'

export default defineComponent({
  emits: ['changeTypeDirec'],
  setup(prop, context) {
    const state = reactive<{
      type: string
      direction: string
    }>({ type: 'nav', direction: 'down' })

    const handleChangeType = val => {
      if (val === 'general') {
        state.direction = 'none'
      }
      if (val === 'nav') {
        state.direction = 'down'
      }
      context.emit('changeTypeDirec', state)
    }

    const handleChangeDirection = () => {
      context.emit('changeTypeDirec', state)
    }

    const formula = formulaHook()
    const parseFormula = formualData => {
      const { type, dir } = formula.parseFormulaData(formualData)
      state.type = type
      state.direction = dir
    }

    return { state, handleChangeType, handleChangeDirection, parseFormula }
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
