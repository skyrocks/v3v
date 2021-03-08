import { computed } from 'vue'
import { useStore } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import { dsApi } from '@/api/modules/ds'
import { DataSourceGroup } from '@/store/type'
import { ElMessage } from 'element-plus'

export type GroupType = 'dataSourceGroup' | 'reportGroup'

const keysMap = {
  dataSourceGroup: {
    item: 'dataSources',
    id: 'dataSourceId',
    name: 'name',
    searchPlaceHolder: '分组, 数据源',

    routeBase: 'ds',

    apiInstance: dsApi
  },
  reportGroup: {
    item: 'reports',
    id: 'reportId',
    name: 'name',
    searchPlaceHolder: '分组, 报表',

    routeBase: 'report',

    apiInstance: dsApi
  }
}

export default function controller(type: GroupType) {
  const store = useStore()

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
      seq: size.value
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

  return { keys, list, create, update, remove, sort }
}
