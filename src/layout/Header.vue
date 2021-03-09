<template>
  <el-row>
    <el-col :span="6">
      <a :href="baseUrl">
        <el-image class="logo" :src="imgLogo" fit="cover"></el-image>
      </a>
    </el-col>
    <el-col :span="9"></el-col>
    <el-col :span="3">
      <el-input placeholder="搜索报表, 数据源" style="line-height: 60px"></el-input>
    </el-col>
    <el-col :span="4">
      <el-menu text-color="#409eff" active-text-color="#409eff" mode="horizontal" router>
        <el-menu-item index="/main/design" class="menu"> 设计 </el-menu-item>
        <el-menu-item index="/main/ds" class="menu"> 数据源 </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="2">
      <div class="me-wrap" @click="handleMe">
        <el-avatar>{{ userName }}</el-avatar>
      </div>
      <!-- <div class="me-wrap">
        <i class="el-icon-arrow-down icon"></i>
      </div> -->
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import imgLogo from '../assets/images/logo.png'

export default defineComponent({
  setup() {

    const store = useStore()

    const userName = computed(() => {
      const name = store.getters.user.userName
      if (name && name.length > 2) {
        return name.substring(name.length - 2, name.length)
      } else {
        return name
      }
    })
    const baseUrl = import.meta.env.BASE_URL

    const router = useRouter()
    const handleMe = () => {
      router.push({ name: 'me' })
    }

    return { imgLogo, userName, baseUrl, handleMe }
  }
})
</script>

<style lang="scss" scoped>
::v-deep(.el-menu) {
  border: 0;
}
.logo {
  margin-top: 8px;
  width: 160px;
}
.menu {
  text-decoration: none;
  color: $--color-text-link;
  opacity: 0.7;
  font-size: $--size-font-larger;
  &.is-active {
    opacity: 1;
  }
  &:hover {
    opacity: 1;
  }
}
.me-wrap {
  height: 60px;
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  cursor: pointer;
  .icon {
    width: 20px;
    line-height: 60px;
    display: inline-block;
    box-sizing: border-box;
    text-align: center;
    opacity: 0.5;
    &:hover,
    &:focus {
      opacity: 1;
    }
  }
}
</style>
