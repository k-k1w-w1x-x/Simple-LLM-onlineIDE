<template>
  <div class="file-menu">
    <div class="file-menu-icons">
      <img src="../../assets/logo.svg" alt="" />
      <i
        v-for="(i, d) in icons"
        :key="i"
        @click="menuClick(d)"
        class="iconfont"
        :class="i"
      />
      <i class="iconfont icon-gengduo">
        <div class="more">
          <span @click="initVueProject">init Vue</span>
          <span>Open Folder</span>
          <span>npm script</span>
        </div>
      </i>
    </div>

    <!-- 文件树 -->
    <el-tree
      ref="treeRef"
      :data="dataSource"
      highlight-current
      node-key="id"
      @node-click="nodeClick"
      @click.self="cancelChecked"
    >
      <template #default="{ node, data }">
        <!-- 这里需要实现新建文件的输入框 -->
        <template v-if="data.isNew">
          <el-input
            ref="newInputRef"
            @blur="confirm"
            @keydown.enter="newFileEnter"
            v-model="newFileName"
            :prefix-icon="data.isFolder ? FolderOpened : Document"
            size="small"
            :placeholder="
              data.isFolder ? 'Input Folder Name...' : 'Input File Name...'
            "
          />
        </template>
        <template v-else>
          <div class="tree-item">
            <img v-if="data.icon && !data.isFolder" :src="data.icon" alt="" />
            {{ node.label }}
            <div class="opts">
              <i @click="menuClick(3)" class="iconfont icon-rename"></i>
              <i @click="menuClick(4)" class="iconfont icon-shanchu1"></i>
            </div>
          </div>
        </template>
      </template>
    </el-tree>
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useFileMenu } from "../../hooks/useFileMenu";
import { Document, FolderOpened } from "@element-plus/icons-vue";

const {
  newInputRef,
  newFileName,
  icons,
  treeRef,
  dataSource,
  menuClick,
  nodeClick,
  cancelChecked,
  confirm,
  newFileEnter,
  initVueProject,
} = useFileMenu();
import { useContainerStore } from "../../pinia/useContainer";
const containerStore = useContainerStore();

// demo
watch(
  () => containerStore.boot,
  () => initVueProject(),
  { immediate: false }
);
</script>

<style lang="less" scoped>
.file-menu {
  width: 220px;
  border-right: solid #ccc 1px;
  padding: 10px;
  &-icons {
    position: relative;
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

.more {
  background-color: #fff;
  border: solid rgba(204, 204, 204, 0.4) 1px;
  z-index: 999;
  position: absolute;
  right: 0;
  top: 25px;
  box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  display: none;
  flex-direction: column;
  span {
    margin: 4px 0;
    padding: 4px 8px;
    cursor: pointer;
    &:hover {
      background-color: #ccc;
    }
  }
}

.icon-gengduo:hover .more {
  display: flex !important;
}
.tree-item {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  &:hover {
    .opts {
      display: block;
    }
  }
  .opts {
    display: none;
    margin-left: auto;
    i {
      margin-left: 6px;
    }
  }
}
</style>
