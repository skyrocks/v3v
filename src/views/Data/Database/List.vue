<template>
  <div>
    <div class="tbar">
      <el-button type="primary" :disabled="existsNew" plain icon="el-icon-plus" @click="handleAdd">
        添加新服务器
      </el-button>
    </div>
    <ul class="db-list">
      <li
        v-for="(db, index) in dbArray"
        :key="db.databaseId"
        :class="`${current && current.databaseId === db.databaseId ? 'active' : ''}`"
        @click="handleEdit(db, index)"
      >
        <template v-if="current && current.databaseId === db.databaseId">
          <SvgIcon icon-class="alfuwuqi-active" />
        </template>
        <template v-else>
          <SvgIcon icon-class="alfuwuqi" />
        </template>
        {{ db.name }}
        <span v-if="db.databaseId === newId"> * </span>
      </li>
    </ul>
    <el-input
      v-show="state.newShow"
      ref="inputRef"
      v-model="state.newName"
      class="input-new"
      placeholder="请输入名称,回车编辑"
      @blur="handleBlur"
      @change="handleChange"
    >
    </el-input>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Database, newId } from '@/store/type'

export default defineComponent({
  setup() {
    const router = useRouter()
    const store = useStore()

    const inputRef = ref(null)

    const state = reactive<{
      newName: string
      newShow: boolean
    }>({
      newName: '',
      newShow: false
    })

    const dbArray = computed(() => store.state.database.dbArray)
    const current = computed(() => store.state.database.current)
    const existsNew = computed(() => store.state.database.existsNew)

    onMounted(() => {
      store.dispatch('database/findAll')
    })

    watch(
      () => store.state.database.size,
      newVal => {
        if (newVal === 0) {
          router.push({ path: '/db' })
        }
      }
    )

    const handleAdd = () => {
      state.newShow = true
      inputRef.value.focus()
    }

    const handleBlur = () => {
      state.newShow = false
    }

    const handleChange = () => {
      if (state.newName !== '') {
        state.newShow = false
        store.dispatch('database/pushNew', state.newName)
        state.newName = ''
        router.push({ path: '/db/new' })
      }
    }

    const handleEdit = (db: Database, index: number) => {
      store.dispatch('database/setCurrent', { db, index })
      router.push({ path: `/db/${db.databaseId}` })
    }

    return { state, newId, existsNew, dbArray, current, inputRef, handleAdd, handleEdit, handleBlur, handleChange }
  }
})
</script>

<style lang="scss" scoped>
.tbar {
  padding: 6px;
  text-align: center;
  background-color: $--color-bg-empty;
  border: 1px solid $--color-line-split;
}
.db-list {
  padding: 0px 15px 0px 35px;
  li {
    padding: 10px;
    list-style-type: none;

    &:hover {
      background-color: $--color-bg-hover;
      cursor: pointer;
    }

    &.active {
      color: $--color-text-link;
      background-color: $--color-bg-hover;
    }
  }
}
.input-new {
  padding: 0px 15px 13px 35px;
}
</style>
