import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { v4 as uuidv4 } from 'uuid'
import { dsApi } from '@/api/modules/ds'
import { reportApi } from '@/api/modules/report'
import { DataSourceGroup, ReportGroup } from '@/store/type'
import { ElMessage } from 'element-plus'

export type GroupType = 'dataSourceGroup' | 'reportGroup'

const keysMap = {
  dataSourceGroup: {
    children: 'dataSources',
    id: 'dataSourceId',
    name: 'name',
    searchPlaceHolder: '搜索数据源...',

    addChildMenu: '添加新数据源',
    removeGroupMenu: '删除数据源',

    routeBase: '/main/ds',

    apiInstance: dsApi,

    createEntity: (name = '', id: string, seq: number): any => {
      const data: DataSourceGroup = {
        groupId: id,
        groupName: name,
        seq,
        dataSources: []
      }
      return data
    }
  },
  reportGroup: {
    children: 'reports',
    id: 'reportId',
    name: 'reportName',
    searchPlaceHolder: '搜索报表...',

    addChildMenu: '添加新报表',
    removeGroupMenu: '删除报表',

    routeBase: '/main/report',

    apiInstance: reportApi,

    createEntity: (name = '', id: string, seq: number): any => {
      const data: ReportGroup = {
        groupId: id,
        groupName: name,
        seq,
        reports: []
      }
      return data
    }
  }
}

export default function controller(type: GroupType) {
  const store = useStore()
  const router = useRouter()

  const keys = keysMap[type]

  const list = computed(() => {
    return store.state[type].list
  })
  const size = computed(() => {
    return store.state[type].size
  })

  const create = (name: string) => {
    const data = keys.createEntity(name, uuidv4(), size.value === 0 ? 0 : list.value[size.value - 1].seq + 1)
    keysMap[type].apiInstance.createGroup(data).then(resp => {
      if (resp.success) {
        store.dispatch(`${type}/create`, data)
      } else {
        ElMessage.error(resp.message)
      }
    })
  }
  const update = (db: any, index: number) => {
    keysMap[type].apiInstance.updateGroup(db).then(resp => {
      if (resp.success) {
        store.dispatch(`${type}/update`, { db, index })
      } else {
        ElMessage.error(resp.message)
      }
    })
  }
  const remove = (groupId: string, index: number) => {
    keysMap[type].apiInstance.removeGroup(groupId).then(resp => {
      if (resp.success) {
        store.dispatch(`${type}/remove`, index)
      } else {
        ElMessage.error(resp.message)
      }
    })
  }
  const sort = (originIndex: number, targetIndex: number) => {
    // api
    store.dispatch(`${type}/sort`, {
      originIndex,
      targetIndex,
      callback: () => {
        const sortData: { [key: string]: boolean } = {}

        list.value.forEach((element: any) => {
          sortData[element.groupId] = element.seq
        })
        keysMap[type].apiInstance.sortGroup(sortData)
      }
    })
  }

  const removeChild = (child: any, index: number) => {
    keysMap[type].apiInstance.removeChild(child).then(resp => {
      if (resp.success) {
        store.dispatch(`${type}/removeChild`, { index, child })
        router.push({ path: keysMap[type].routeBase })
      } else {
        ElMessage.error(resp.message)
      }
    })
  }

  return { keys, list, create, update, remove, sort, removeChild }
}
