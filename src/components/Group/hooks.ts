import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { v4 as uuidv4 } from 'uuid'
import { dsApi } from '@/api/modules/ds'
import { DataSource, DataSourceGroup } from '@/store/type'
import { ElMessage } from 'element-plus'

export type GroupType = 'dataSourceGroup' | 'reportGroup'

const keysMap = {
  dataSourceGroup: {
    children: 'dataSources',
    id: 'dataSourceId',
    name: 'name',
    searchPlaceHolder: '搜索数据源...',

    routeBase: '/main/ds',

    apiInstance: dsApi
  },
  reportGroup: {
    children: 'reports',
    id: 'reportId',
    name: 'name',
    searchPlaceHolder: '搜索报表...',

    routeBase: '/main/report',

    apiInstance: dsApi
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

  const createEntity = (name = '', id: string): DataSourceGroup => {
    const data: DataSourceGroup = {
      groupId: id,
      groupName: name,
      seq: size.value === 0 ? 0 : list.value[size.value - 1].seq + 1,
      dataSources: []
    }
    return data
  }

  const create = (name: string) => {
    const data = createEntity(name, uuidv4())
    keysMap[type].apiInstance.createGroup(data).then(resp => {
      if (resp.success) {
        store.dispatch(`${type}/create`, data)
      } else {
        ElMessage.error(resp.message)
      }
    })
  }
  const update = (db: DataSourceGroup, index: number) => {
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

  const removeChild = (child: DataSource, index: number) => {
    keysMap[type].apiInstance.removeChild(child.dataSourceId).then(resp => {
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
