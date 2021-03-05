<template>
  <div>
    <Splitpanes class="default-theme" horizontal :style="`height: ${height}`">
      <Pane min-size="20" max-size="80">
        <el-row>
          <el-col :span="18">
            <el-button @click="sqlFormat">保存</el-button>
            <el-button @click="sqlFormat">刷新快照</el-button>
            <el-input
              v-model="status.sqlText"
              type="textarea"
              :rows="11"
              :style="`height: ${sqlAreaHeight}`"
              placeholder="请输入内容"
            ></el-input>
          </el-col>
          <el-col :span="6">
            <el-button @click="sqlRun">运行</el-button>
            <el-button @click="sqlFormat">格式化</el-button>
          </el-col>
        </el-row>
      </Pane>
      <Pane>
        <div>
          <p>字段</p>
          <p>字段别名</p>
          <p>数据集</p>
        </div>
      </Pane>
    </Splitpanes>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue'
import { getContextHeight } from '@/utils/index.ts'
import { format } from 'sql-formatter'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

export default defineComponent({
  components: { Splitpanes, Pane },
  setup() {
    const status = reactive<{ sqlText: string }>({ sqlText: '' })

    const height = computed(() => {
      return `${getContextHeight()}px`
    })
    const sqlAreaHeight = computed(() => {
      return `${getContextHeight() - 50}px`
    })

    const sqlFormat = () => {
      status.sqlText = format(status.sqlText)
    }

    // const sqlRun = () => {

    // }

    return { status, height, sqlAreaHeight, sqlFormat }
  }
})
</script>
