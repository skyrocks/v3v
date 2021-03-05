<template>
  <div>
    <div class="tbar">
      <el-button type="primary" plain icon="el-icon-folder-checked" @click="handleSave">保存</el-button>
      <el-button type="danger" :disabled="isNew" plain icon="el-icon-delete" @click="handleDelete"> 删除 </el-button>
    </div>
    <div class="form-wrap" :style="`height: ${heightForm}`">
      <el-row>
        <el-col :span="12">
          <el-form ref="formRef" :model="state.current" :rules="rules" label-width="170px">
            <el-form-item label="数据服务名称" prop="name">
              <el-input ref="firstItemRef" v-model="state.current.name"></el-input>
            </el-form-item>
            <el-form-item label="数据库类型" prop="provider">
              <el-select v-model="state.current.provider">
                <el-option label="Mariadb" value="mariadb"></el-option>
                <el-option label="Mysql" value="mysql"></el-option>
                <el-option label="Oracle" value="oracle"></el-option>
                <el-option label="Sqlserver" value="sqlserver"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="地址(host)" prop="host">
              <el-input v-model="state.current.host"></el-input>
            </el-form-item>
            <el-form-item label="端口(port)" prop="port">
              <el-input v-model="state.current.port" type="number"></el-input>
            </el-form-item>
            <el-form-item label="数据库名(database)" prop="dbName">
              <el-input v-model="state.current.dbName" :disabled="state.current.provider === 'oracle'"></el-input>
            </el-form-item>
            <el-form-item label="instance" prop="instance">
              <el-input v-model="state.current.instance" :disabled="state.current.provider !== 'sqlserver'"></el-input>
            </el-form-item>
            <el-form-item label="sid" prop="sid">
              <el-input v-model="state.current.sid" :disabled="state.current.provider !== 'oracle'"> </el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="username">
              <el-input v-model="state.current.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="state.current.password" type="password"></el-input>
            </el-form-item>
            <el-form-item style="margin-top: 25px">
              <el-button type="success" plain icon="el-icon-magic-stick" @click="handleTest">测试链接</el-button>
              <span v-if="state.testState === 1" class="conn-state success">
                <i class="el-icon-check"></i> 测试通过
              </span>
              <span v-if="state.testState === -1" class="conn-state fail">
                <i class="el-icon-close"></i> 测试未通过
              </span>
              <div v-if="state.testState === -1" class="test-error">
                {{ state.testError }}
              </div>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, watch, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { v4 as uuidv4 } from 'uuid'
import { getContextHeight } from '@/utils'
import { _ } from 'lodash'
import { Database, newId } from '@/store/type'
import { create } from '@/store/modules/database'
import { databaseApi } from '@/api/modules/database'

export default defineComponent({
  setup() {
    const store = useStore()

    const formRef = ref()
    const firstItemRef = ref()

    const state = reactive<{
      current: Database | undefined
      testState: number
      testError: string // 0未测试, 1通过, -1未通过
    }>({ current: create(), testSuccess: 0, testError: '' })

    const heightForm = computed(() => `${getContextHeight() - 46}px`)

    //当前是否是新
    const isNew = computed(() => state.current.isNew)

    const cloneModal = (db: Database) => {
      if (db) {
        state.current = JSON.parse(JSON.stringify(db))
        if (state.current?.databaseId === newId) {
          firstItemRef.value.focus()
        }
      }
    }

    const rules = {
      name: [
        { required: true, message: '请输入数据服务名称', trigger: 'blur' },
        { max: 20, message: '不能超出20个字符', trigger: 'blur' }
      ],
      provider: [{ required: true, trigger: 'blur' }],
      host: [
        { required: true, message: '请输入数据服务地址', trigger: 'blur' },
        { max: 20, message: '不能超出20个字符', trigger: 'blur' }
      ],
      port: [{ required: true, message: '请输入数据服务端口', trigger: 'blur' }],
      instance: [{ max: 20, message: '不能超出20个字符', trigger: 'blur' }],
      dbName: [
        {
          validator: (rule, value, callback) => {
            if (value === '' && state.current.provider !== 'oracle') {
              callback(new Error('请输入数据库名'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        },
        { max: 20, message: '不能超出20个字符', trigger: 'blur' }
      ],
      sid: [
        {
          validator: (rule, value, callback) => {
            if (value === '' && state.current.provider === 'oracle') {
              callback(new Error('请输入数据库名'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        },
        { max: 20, message: '不能超出20个字符', trigger: 'blur' }
      ],
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { max: 10, message: '不能超出10个字符', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { max: 16, message: '不能超出16个字符', trigger: 'blur' }
      ]
    }

    watch(
      () => store.state.database.current,
      newVal => {
        if (newVal) {
          cloneModal(newVal)
        }
      }
    )

    onMounted(() => {
      cloneModal(store.state.database.current)
    })

    const handleSave = () => {
      if (state.current.databaseId === newId) {
        const n = _.clone(state.current)
        n.databaseId = uuidv4()
        databaseApi.add(n).then(resp => handleSaveCallback(true, resp))
      } else {
        databaseApi.update(state.current).then(resp => handleSaveCallback(false, resp))
      }
    }

    const handleSaveCallback = (isNew, resp) => {
      if (resp.success) {
        store.dispatch('database/saveCurrent', { db: state.current, isNew })
        ElMessage.success('数据服务保存成功')
      } else {
        ElMessage.error(resp.message)
      }
    }

    const handleDelete = () => {
      databaseApi.remove(state.current.databaseId).then(resp => {
        if (resp.success) {
          store.dispatch('database/removeCurrent')
        } else {
          alert(resp.message)
        }
      })
    }

    const handleTest = () => {
      formRef.value.validate(valid => {
        if (valid) {
          databaseApi.test(state.current).then(resp => {
            if (resp.success) {
              state.testState = resp.data.connected ? 1 : -1
              state.testError = resp.data.error
            } else {
              state.testState = -1
              state.testError = resp.message
            }
          })
        }
      })
    }

    return { heightForm, state, isNew, formRef, firstItemRef, rules, handleSave, handleDelete, handleTest }
  }
})
</script>

<style lang="scss" scoped>
.tbar {
  padding: 6px;
  background-color: $--color-bg-empty;
  border: 1px solid $--color-line-split;
  border-left: 0;
}
.form-wrap {
  padding: 25px 0;
  overflow-y: auto;
}
.conn-state {
  margin-left: 15px;
  &.success {
    color: $--color-success;
  }
  &.darger {
    color: $--color-danger;
  }
}
.test-error,
.fail {
  color: $--color-danger;
}
</style>
