<template>
  <div :style="`height:${height}px`" @contextmenu.prevent="handleContextMenuEmpty" @contextmenu.stop>
    <el-input
      v-model="state.searchText"
      class="input-search"
      :placeholder="keys.searchPlaceHolder"
      prefix-icon="el-icon-search"
      @contextmenu.stop
    ></el-input>
    <el-menu
      ref="refMenu"
      class="menu-wrap"
      @open="index => handleGroupOpenClose(index)"
      @close="index => handleGroupOpenClose(index)"
      @select="(index, path) => handleSelect(path)"
    >
      <el-submenu v-for="(g, index) in list" :key="g.groupId" :index="g.groupId">
        <template #title>
          <div
            draggable="true"
            @contextmenu.prevent="handleContextMenuGroup(g, index)"
            @contextmenu.stop
            @dragstart="dragStart($event, index)"
            @dragover="$event.preventDefault()"
            @dragenter="dragEnter($event, index)"
            @dragleave="dragLeave($event, index)"
            @drop="drop($event, index)"
          >
            <i v-if="!state.groupOpen[g.groupId]" class="el-icon-folder"></i>
            <i v-else class="el-icon-folder-opened group-opened"></i>
            <span>{{ g.groupName }}</span>
          </div>
        </template>
        <el-menu-item
          v-for="(child, cIndex) in g[keys.children]"
          :key="`${child[keys.id]}`"
          :index="`${child[keys.id]}`"
          @contextmenu.prevent="handleContextMenuItem(child, cIndex)"
          @contextmenu.stop
        >
          <i class="el-icon-document"></i>
          {{ child[keys.name] }}
        </el-menu-item>
      </el-submenu>
    </el-menu>
    <el-input
      v-show="inputState.newShow"
      ref="inputRef"
      v-model="inputState.newName"
      class="input-new"
      placeholder="请输入名称,回车编辑"
      @blur="handleBlur"
      @change="handleChange"
    >
    </el-input>
  </div>
  <Teleport to="#app">
    <el-card
      v-show="stateMenu.visible"
      class="context-menu"
      :style="{ left: stateMenu.left + 'px', top: stateMenu.top + 'px' }"
    >
      <ul v-show="!stateMenu.elementType" class="content-menu-list">
        <li @click="handleAddGroup"><i class="el-icon-circle-plus-outline"></i> 添加新分组</li>
      </ul>
      <ul v-show="stateMenu.elementType === 'group'" class="content-menu-list">
        <li @click="handleAddChild"><i class="el-icon-circle-plus-outline"></i> 添加新数据源</li>
        <li @click="handleAddGroup"><i class="el-icon-circle-plus-outline"></i> 添加新分组</li>
        <li @click="handleEditGroup"><i class="el-icon-edit-outline"></i> 修改分组名称</li>
        <li @click="handleRemoveGroup"><i class="el-icon-remove-outline"></i> 删除当前分组</li>
      </ul>
      <ul v-show="stateMenu.elementType === 'child'" class="content-menu-list">
        <li @click="handleRemoveChild"><i class="el-icon-remove-outline"></i> 删除数据源</li>
      </ul>
    </el-card>
  </Teleport>
  <ChildDialog ref="refChildDialog"></ChildDialog>
</template>

<script lang="ts">
import { defineComponent, computed, watch, reactive, ref } from 'vue'
import { getContextHeight } from '@/utils/index.ts'
import { useRouter } from 'vue-router'
import { DataSource, DataSourceGroup } from '@/store/type'
import controller from './hooks'
import { ElMessageBox } from 'element-plus'
import ChildDialog from './Child.vue'

export default defineComponent({
  components: { ChildDialog },
  props: {
    groupType: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const height = computed(() => {
      return `${getContextHeight() - 35 - 26}`
    })

    const refChildDialog = ref()
    const refMenu = ref()

    const state = reactive<{
      currentGroup: DataSourceGroup | undefined
      currentGroupIndex: number
      currentChild: DataSource | undefined
      currentChildIndex: number
      searchText: string
      groupOpen: { [key: string]: boolean }
    }>({
      currentGroup: undefined,
      currentGroupIndex: -1,
      currentChild: undefined,
      currentChildIndex: -1,
      searchText: '',
      groupOpen: {}
    })

    // 右键菜单相关
    const stateMenu = reactive<{
      visible: boolean
      top: number
      left: number
      elementType: string | undefined
    }>({ visible: false, top: 100, left: 100, elementType: undefined })

    watch(
      () => stateMenu.visible,
      newVal => {
        if (newVal) {
          document.body.addEventListener('click', () => (stateMenu.visible = false))
        } else {
          document.body.removeEventListener('click', () => (stateMenu.visible = false))
        }
      }
    )

    const handleContextMenuEmpty = () => {
      stateMenu.left = event.pageX
      stateMenu.top = event.pageY
      stateMenu.visible = true
      stateMenu.elementType = undefined
    }
    const handleContextMenuGroup = (group, index) => {
      stateMenu.left = event.pageX
      stateMenu.top = event.pageY
      stateMenu.visible = true
      stateMenu.elementType = 'group'

      state.currentGroup = group
      state.currentGroupIndex = index
      state.groupOpen[group.groupId] = true
      refMenu.value.open(group.groupId)
    }

    const handleContextMenuItem = (child, index) => {
      stateMenu.left = event.pageX
      stateMenu.top = event.pageY
      stateMenu.visible = true
      stateMenu.elementType = 'child'

      state.currentChild = child
      state.currentChildIndex = index
    }

    const { keys, list, create, update, remove, sort, removeChild } = controller(props.groupType)

    //添加分组名称
    const inputRef = ref()
    const inputState = reactive<{
      newShow: boolean
      newName: string
    }>({ newShow: false, newName: '' })

    const handleAddGroup = () => {
      inputState.newShow = true
      inputRef.value.focus()
    }
    const handleBlur = () => {
      inputState.newShow = false
    }
    const handleChange = () => {
      if (inputState.newName !== '') {
        inputState.newShow = false
        create(inputState.newName)
        inputState.newName = ''
      }
    }
    const handleEditGroup = () => {
      ElMessageBox.prompt('请修改分组名称', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        inputValue: state.currentGroup?.groupName,
        inputPattern: /^.+$/,
        inputErrorMessage: '分组名称不能为空'
      }).then(({ value }) => {
        let cloneObj: DataSourceGroup = {}
        Object.assign(cloneObj, state.currentGroup)
        cloneObj.groupName = value
        update(cloneObj, state.currentGroupIndex)
      })
    }
    const handleRemoveGroup = () => {
      ElMessageBox.confirm(`确定要删除分组[ ${state.currentGroup?.groupName} ]吗?`, '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        remove(state.currentGroup?.groupId, state.currentGroupIndex)
      })
    }

    const handleRemoveChild = () => {
      ElMessageBox.confirm(`确定要删除数据源[ ${state.currentChild?.name} ]吗?`, '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        console.log(state.currentGroupIndex)
        removeChild(state.currentChild, state.currentChildIndex)
      })
    }

    //调整分组顺序
    const dragStart = (e, index) => {
      e.dataTransfer.setData('index', index)
    }
    const drop = (e, targetIndex) => {
      const orginIndex = parseInt(e.dataTransfer.getData('index'))
      if (orginIndex !== targetIndex) {
        sort(orginIndex, targetIndex)
      }
      e.target.parentNode.style.border = '0'
    }

    const dragEnter = e => {
      e.target.parentNode.style.border = '0'
      e.target.parentNode.style.border = '1px solid #409eff'
    }
    const dragLeave = e => {
      e.target.parentNode.style.border = '0'
    }

    const handleGroupOpenClose = (groupId: string) => {
      state.groupOpen[groupId] = !state.groupOpen[groupId]
    }

    // children相关
    const handleAddChild = () => {
      refChildDialog.value.open(state.currentGroup, state.currentGroupIndex)
    }

    const router = useRouter()
    const handleSelect = (path: string) => {
      console.log(path[1])
      const id = path[1]
      router.push(`${keys.routeBase}/${id}`)
    }

    return {
      height,
      state,
      keys,
      list,

      refMenu,
      stateMenu,
      handleContextMenuEmpty,
      handleContextMenuGroup,
      handleContextMenuItem,

      inputRef,
      inputState,
      handleAddGroup,
      handleBlur,
      handleChange,
      handleEditGroup,
      handleRemoveGroup,
      handleGroupOpenClose,
      handleRemoveChild,

      dragStart,
      drop,
      dragEnter,
      dragLeave,

      refChildDialog,
      handleAddChild,
      handleSelect
    }
  }
})
</script>

<style lang="scss" scoped>
.group-opened {
  color: $--color-text-link;
}
.menu-wrap {
  margin-top: 6px;
  margin-left: -15px;
  margin-right: -15px;
}
::v-deep(.input-search .el-input__inner) {
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

.context-menu {
  z-index: 9000;
  position: absolute;
}
::v-deep(.el-card__body) {
  padding: 0;
}
ul.content-menu-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
::v-global(ul.content-menu-list > li) {
  cursor: pointer;
  min-width: 150px;
  padding: 5px 15px;
}
::v-global(ul.content-menu-list > li:hover) {
  background-color: $--color-bg-hover;
}

.input-new {
  padding: 10px 0;
}
</style>
