<template>
  <div>
    <Splitpanes class="default-theme">
      <Pane size="80">
        <div class="page-tbar">
          <el-button icon="el-icon-goods" @click="handleSave">保存</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button icon="el-icon-tickets" @click="handleFormat">格式化</el-button>
          <el-button icon="el-icon-video-play" @click="handleRun">运行</el-button>
          <div style="float: right">
            <el-form :inline="true">
              <el-form-item label="名称: " style="margin-bottom: 0">
                <el-input v-model="state.ds.name" placeholder="名称"></el-input>
              </el-form-item>
              <el-form-item label="数据服务: " style="margin-bottom: 0">
                <el-select v-model="state.ds.databaseId">
                  <el-option
                    v-for="(db, index) in dbList"
                    :key="index"
                    :label="db.name"
                    :value="db.databaseId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <el-input
          v-model="state.ds.sqlText"
          class="sql-input"
          type="textarea"
          :rows="25"
          placeholder="请输入内容"
        ></el-input>
        <div class="memo">
          <p>说明</p>
        </div>
      </Pane>
      <Pane size="20" min-size="5">
        <el-tabs type="card" class="tab">
          <el-tab-pane label="参数" class="pane">
            <el-form v-for="(p, index) in state.ds.params" :key="index" label-width="70px" size="mini">
              <label style="margin-bottom: 6px; display: block; font-weight: bold">{ {{ p.paramsKey }} }</label>
              <el-form-item label="名称: " style="margin-bottom: 0">
                <el-input v-model="p.paramsName" placeholder="名称"></el-input>
              </el-form-item>
              <el-form-item label="默认值: ">
                <el-input v-model="p.defaultValue" placeholder="默认值"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="字段" class="pane">
            <ul class="field-list">
              <li v-for="(f, idx) in state.ds.fields" :key="idx">
                <SvgIcon icon-class="alziduan" /> {{ f.fieldKey }}
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
      </Pane>
    </Splitpanes>
  </div>
  <DataList ref="refDataList"></DataList>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { format } from 'sql-formatter'
import { ElMessage } from 'element-plus'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { dsApi } from '@/api/modules/ds'
import { DataSource } from '@/store/type'
import DataList from './DataList.vue'

export default defineComponent({
  components: { Splitpanes, Pane, DataList },
  setup() {
    const store = useStore()
    const route = useRoute()

    const refDataList = ref()

    const dbList = computed(() => store.getters['database/list'])

    const state = reactive<{ ds: DataSource; sqlData: any[] }>({
      ds: {},
      sqlData: []
    })

    onMounted(() => {
      getDs(route.params.id)
    })

    onBeforeRouteUpdate(to => {
      getDs(to.params.id)
    })

    const getDs = (id: string) => {
      dsApi.getDs(id).then(resp => {
        if (resp.success) {
          state.ds = resp.data
        }
      })
    }

    const parseParams = () => {
      let newParams = []
      const params = state.ds.sqlText.match(/\{[^\}]+\}/g)
      params?.forEach(ele => {
        const p = ele.substring(1, ele.length - 1).trim()
        newParams.push(p)
        const idx = state.ds.params.findIndex(value => value.paramsKey === p)
        if (idx === -1) {
          state.ds.params.push({
            dataSourceId: state.ds.dataSourceId,
            paramsKey: p,
            paramsName: p,
            defaultValue: ''
          })
        }
      })
      state.ds.params = state.ds.params.filter(value => newParams.indexOf(value.paramsKey) >= 0)
    }
    const handleFormat = () => {
      state.ds.sqlText = format(state.ds.sqlText)
      parseParams()
    }

    const runSql = async () => {
      let result = {}
      await dsApi.sqlRun(state.ds.sqlText, state.ds.params, state.ds.databaseId).then(resp => {
        if (resp.success) {
          state.ds.fields.length = 0
          if (resp.data.length > 0) {
            for (let key in resp.data[0]) {
              state.ds.fields.push({
                dataSourceId: state.ds.dataSourceId,
                fieldKey: key
              })
            }
            state.sqlData = resp.data
          }
        }
        result = resp
      })
      return result
    }

    const handleRun = async () => {
      parseParams()
      const resp = await runSql()
      if (resp.success) {
        const fields = []
        state.ds.fields.forEach(value => fields.push(value.fieldKey))
        refDataList.value.setData({ fields, data: resp.data })
      }
    }

    const handleSave = async () => {
      const resp = await runSql()
      if (resp.success) {
        dsApi.updateDs(state.ds).then(resp => {
          if (resp.success) {
            ElMessage.success('数据源已更新')
          } else {
            ElMessage.error(resp.message)
          }
        })
      }
    }

    return { refDataList, dbList, state, handleSave, handleFormat, handleRun }
  }
})
</script>
<style lang="scss" scoped>
::v-deep(.sql-input) {
  textarea {
    border: 0;
    border-radius: 0;
    resize: none;
  }
}
::v-deep(.tab) {
  .el-tabs__nav {
    border-top: 0;
  }
  .el-tabs__header {
    margin: 0;
  }
  .el-tabs__item {
    color: $--color-text-base;
    font-size: $--size-font-base;
    height: 47px;
    line-height: 47px;
    &.is-active {
      color: $--color-text-link;
      background-color: $--color-bg-enabled;
    }
  }
}
.pane {
  background-color: $--color-bg-enabled;
  padding: 15px;
  margin-left: 1px;
  height: 100vh;
}
.memo {
  border-top: 1px solid $--color-line-split;
}
.field-list {
  @extend .list-unstyled;
  li {
    padding: 5px;
  }
}
</style>
