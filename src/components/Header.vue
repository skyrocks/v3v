<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <el-image style="margin-top: 8px; width: 160px" :src="imgLogo" fit="cover"></el-image>
    </el-col>
    <el-col :span="9"></el-col>
    <el-col :span="3">
      <el-input v-model="searchText" placeholder="搜索报表" style="line-height: 60px"></el-input>
    </el-col>
    <el-col :span="4">
      <el-menu text-color="#1989fa" active-text-color="#1989fa" mode="horizontal" router>
        <el-menu-item index="/design" class="menu"> 设计 </el-menu-item>
        <el-menu-item index="/show" class="menu"> 浏览 </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="2">
      <div class="me-wrap">
        <el-avatar>user</el-avatar>
      </div>
      <div class="me-wrap">
        <i class="el-icon-arrow-down icon"></i>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import imgLogo from '../assets/images/logo.png'
</script>
<style lang="scss" scoped>
  .menu {
    text-decoration: none;
    color: #1989fa;
    opacity: 0.5;
    font-size: 16px;
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
