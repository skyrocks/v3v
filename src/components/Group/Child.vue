<template>
  <el-dialog v-model="state.dialogVisible" width="35%" title="添加数据源">
    <el-form ref="refForm" :model="state.form" :rules="rules" style="padding: 0 60px 0 0">
      <el-form-item label="数据源名称" prop="name" label-width="120px">
        <el-input v-model="state.form.name"></el-input>
      </el-form-item>
      <el-form-item label="数据服务器" prop="db" label-width="120px">
        <el-select v-model="state.form.db" placeholder="请选择数据服务器">
          <el-option v-for="(db, index) in dbList" :key="index" :label="db.name" :value="db.databaseId"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { dsApi } from '@/api/modules/ds'
import { DataSource, DataSourceGroup } from '@/store/type'
import { v4 as uuidv4 } from 'uuid'
import { ElMessage } from 'element-plus'

export default defineComponent({
  setup() {
    const store = useStore()

    const state = reactive<{
      dialogVisible: boolean
      form: {
        name: string
        db: string
      }
      group: DataSourceGroup | undefined
      groupIndex: number
    }>({ dialogVisible: false, form: { name: '', db: '' }, group: undefined, groupIndex: -1 })

    // 正常情况下需要获取一下数据, 但是这给页面是和database页面一起展现的, 在那个页面已经执行过一次了
    // onMounted(() => store.dispatch('database/findList'))
    const refForm = ref()

    const rules = {
      name: [
        { required: true, message: '请输入数据源名称', trigger: 'blur' },
        { max: 50, message: '不能超出50个字符', trigger: 'blur' }
      ],
      db: [{ required: true, message: '请选择服务器', trigger: 'blur' }]
    }

    const dbList = computed(() => store.getters['database/list'])

    const open = (group: DataSourceGroup, groupIndex: number) => {
      state.group = group
      state.groupIndex = groupIndex
      state.dialogVisible = true
    }

    const _createEntity = (name = '', dataSourceId: string, databaseId: string, groupId: string): DataSource => {
      const size = state.group?.dataSources.length
      const data: DataSource = {
        dataSourceId,
        name,
        groupId,
        databaseId,
        seq: size === 0 ? 0 : state.group?.dataSources[size - 1].seq + 1
      }
      return data
    }

    const handleAdd = () => {
      refForm.value.validate(valid => {
        if (valid) {
          const data = _createEntity(state.form.name, uuidv4(), state.form.db, state.group?.groupId)
          dsApi.createDs(data).then(resp => {
            if (resp.success) {
              store.dispatch('dataSourceGroup/createDataSource', { data, groupIndex: state.groupIndex })
              state.dialogVisible = false
            } else {
              ElMessage.error(resp.message)
            }
          })
        }
      })
    }
    return { refForm, state, rules, dbList, open, handleAdd }
  }
})
</script>
