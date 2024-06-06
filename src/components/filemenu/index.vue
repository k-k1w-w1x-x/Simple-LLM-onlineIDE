<template>
  <div class="file-menu">
    <!-- 顶部 添加按钮 -->
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
      @node-contextmenu="nodeContextmenu"
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
        <!-- 正常的文件展示 -->
        <template v-else>
          <el-popover
            :ref="setPopoverRef"
            width="220"
            placement="bottom-start"
            trigger="contextmenu"
            :show-arrow="false"
            :hide-after="0"
          >
            <!-- 右键文件位置 -->
            <div class="filemenu-contextmenu">
              <div
                v-for="menu in contextmenu"
                :key="menu.label"
                @click="menu.callback(data)"
              >
                <span>{{ menu.label }}</span>
                <span>{{ menu.shortcut }}</span>
              </div>
            </div>
            <template #reference>
              <div class="tree-item">
                <img v-if="data.icon && !data.isFolder" :src="data.icon" />
                {{ node.label }}
              </div>
            </template>
          </el-popover>
        </template>
      </template>
    </el-tree>
  </div>
</template>

<script setup lang="ts">
import { useFileMenu } from "../../hooks/useFileMenu";
import { Document, FolderOpened } from "@element-plus/icons-vue";
import { useFileContextMenu } from "../../hooks/useFileContextMenu";

const { contextmenu, setPopoverRef, closePopover } = useFileContextMenu();

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

function nodeContextmenu() {
  // 1. 先关闭其他 popover
  closePopover();
}
</script>

<style lang="less" scoped>
.file-menu {
  position: relative;
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
}

.filemenu-contextmenu {
  width: 100%;
  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 2px;
    padding: 4px;
    margin: 4px 0;
    cursor: pointer;
    &:hover {
      background-color: #f2f3f5;
    }
    span:nth-child(1) {
      font-weight: 600;
    }
    span:nth-child(2) {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.5);
    }
  }
}
</style>
