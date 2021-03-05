<template>
  <el-input v-model="status.searchText" :placeholder="names.searchPlaceHolder" prefix-icon="el-icon-search"></el-input>
  <el-menu
    class="menu-wrap"
    @open="index => emit('open', index)"
    @close="index => emit('close', index)"
    @select="(index, path) => emit('select', path)"
  >
    <el-submenu v-for="g in status.groups" :key="g.groupId" :index="g.groupId">
      <template #title>
        <i v-if="!status.subMenuOpen[g.groupId]" class="el-icon-folder"></i>
        <i v-else class="el-icon-folder-opened opened-submenu"></i>
        <span>{{ g.groupName }}</span>
      </template>
      <el-menu-item
        v-for="child in g[names.item]"
        :key="`${g.groupId}-${child[names.id]}`"
        :index="`${g.groupId}-${child[names.id]}`"
      >
        <i class="el-icon-document"></i>
        {{ child[names.name] }}
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script setup lang="ts">
import { defineProps, defineEmit } from 'vue'
defineProps({
  status: Object,
  names: Object // {item:'reports', id:'reportId', name: 'reportName', searchPlaceHolder:'分组, 报表'}
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmit(['open', 'close', 'select'])
</script>

<style lang="scss" scoped>
.opened-submenu {
  color: $--color-text-link;
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
  height: 28px !important;
  line-height: 28px !important;
  color: $--color-text-base;
  &.is-active {
    color: $--color-text-link;
  }
}
::v-deep(.el-submenu__title) {
  height: 30px !important;
  line-height: 30px !important;
  color: $--color-text-base;
}
</style>
