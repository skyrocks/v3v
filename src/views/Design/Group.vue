<template>
  <el-input v-model="status.searchText" placeholder="分组、报表" prefix-icon="el-icon-search"></el-input>
  <el-menu class="menu-wrap" @open="handleOpenClose" @close="handleOpenClose" @select="handleSelect">
    <el-submenu v-for="(g, index) in status.groups" :key="g.groupId" :index="g.groupId">
      <template #title>
        <i v-if="!status.subMenuOpen[index + 1]" class="el-icon-folder"></i>
        <i v-else class="el-icon-folder-opened opened-submenu"></i>
        <span>{{ g.groupName }}</span>
      </template>
      <el-menu-item v-for="r in g.reports" :key="`${g.groupId}-${r.reportId}`" :index="`${g.groupId}-${r.reportId}`">
        <i class="el-icon-document"></i>
        {{ r.reportName }}
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { ReportGroupType } from './Group.tsx'
  import { reportApi } from '@/api/modules/report'

  export default defineComponent({
    setup() {
      const router = useRouter()
      const status = reactive<{
        groups: ReportGroupType[]
        subMenuOpen: { [key: number]: boolean }
        searchText: string
      }>({
        groups: [],
        subMenuOpen: {},
        searchText: ''
      })

      const getGroups = () => {
        reportApi.getGroups().then((response) => {
          status.groups = response.data
        })
      }
      onMounted(getGroups)

      const handleOpenClose = (index) => {
        status.subMenuOpen[index] = !status.subMenuOpen[index]
      }

      const handleSelect = (index, path) => {
        const reportId = path[1].split('-')[1]
        router.push(`/design/${reportId}`)
      }

      return { status, handleOpenClose, handleSelect }
    }
  })
</script>
<style lang="scss" scoped>
  .opened-submenu {
    color: #409eff;
  }
  .menu-wrap {
    margin-top: 6px;
    margin-left: -15px;
    margin-right: -15px;
  }
  ::v-deep(.el-input__inner) {
    border-top: 0;
    border-left: 0;
    border-right: 0;
    border-radius: 0;
  }
  ::v-deep(.el-menu) {
    border-right: 0 !important;
  }
  ::v-deep(.el-menu-item) {
    height: 22px !important;
    line-height: 22px !important;
  }
  ::v-deep(.el-submenu__title) {
    height: 26px !important;
    line-height: 26px !important;
  }
</style>
