<template>
  <div class="file-menu">
    <div class="file-menu-icons">
      <img src="../assets/logo.svg" alt="" />
      <i
        v-for="(i, d) in icons"
        :key="i"
        @click="iconClick(d)"
        class="iconfont"
        :class="i"
      />
    </div>

    <!-- 文件树 -->
    <el-tree
      ref="treeRef"
      :data="dataSource"
      highlight-current
      :indent="4"
      node-key="id"
      @node-click="nodeClick"
      @click.self="cancelChecked"
    >
      <template #default="{ node, data }">
        <!-- 这里需要实现新建文件的输入框 -->
        <template v-if="data.isNew"> </template>
        <template v-else>
          <img v-if="data.icon" :src="data.icon" alt="" />
          {{ node.label }}
        </template>
      </template>
    </el-tree>
  </div>
</template>

<script setup lang="ts">
import { useFileMenu } from "../hooks/useFileMenu";
const {
  icons,
  treeRef,
  dataSource,
  iconClick,
  nodeClick,
  cancelChecked,
} = useFileMenu();
</script>

<style lang="less" scoped>
.file-menu {
  width: 220px;
  border-right: solid #ccc 1px;
  padding: 10px 0;
  &-icons {
    box-sizing: content-box;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    border-bottom: solid #ccc 1px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    img {
      height: 100%;
      margin-right: auto;
      margin-left: 10px;
    }
    i {
      border-radius: 4px;
      padding: 4px;
      margin-right: 4px;
      cursor: pointer;
      &:hover {
        background-color: #f2f3f5;
      }
    }
  }
}
.el-tree {
  user-select: none;
  height: calc(100% - 20px - 35px);
}
</style>
