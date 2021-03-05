<template>
  <div>
    <Group
      :status="status"
      :names="names"
      @open="handleOpenClose"
      @close="handleOpenClose"
      @select="handleSelect"
    ></Group>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import Group from '@/components/Group/index.vue'
import groupHooks from '@/components/Group/hooks'
import { dsApi } from '@/api/modules/ds'

export default defineComponent({
  components: { Group },
  setup() {
    const status = reactive<{
      groups: []
      subMenuOpen: { [key: string]: boolean }
      searchText: string
    }>({
      groups: [],
      subMenuOpen: {},
      searchText: ''
    })

    const names = {
      item: 'dataSources',
      id: 'dataSourceId',
      name: 'name',
      searchPlaceHolder: '分组, 数据源'
    }

    const { handleOpenClose, handleSelect } = groupHooks('/ds', dsApi.getGroups(), status)

    return { status, names, handleOpenClose, handleSelect }
  }
})
</script>
