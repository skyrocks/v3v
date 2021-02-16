<template>
  <div>Design Menu</div>
  <el-menu router>
    <el-menu-item index="/design/2">
      <i class="el-icon-menu"></i>
      <template #title>导航二</template>
    </el-menu-item>
    <el-menu-item index="/design/3">
      <i class="el-icon-document"></i>
      <template #title>导航三</template>
    </el-menu-item>
    <el-menu-item index="/design/4">
      <i class="el-icon-setting"></i>
      <template #title>导航四</template>
    </el-menu-item>
  </el-menu>
  <p></p>
  <p v-for="(item, index) in list1" :key="index" draggable="true" @dragstart="dragStart($event, item)">
    {{ item.name }}
  </p>
</template>
<script setup lang="ts">
  import { reactive } from 'vue'

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const list1 = reactive([
    { name: '姓名', id: 'name' },
    { name: '学号', id: 'code' },
    { name: '年纪', id: 'grade' },
    { name: '专业', id: 'profession' },
    { name: '班级', id: 'classInfo' },
    { name: '年龄', id: 'age' }
  ])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dragStart = (e, item) => {
    e.dataTransfer.setData('field', JSON.stringify(item))
  }
</script>
