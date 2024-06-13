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
      <el-popover placement="top-end" :show-arrow="false" trigger="hover">
        <div class="opts">menu item</div>
        <template #reference>
          <i class="iconfont icon-gengduo"> </i>
        </template>
      </el-popover>
    </div>

    <!-- 文件树 -->
    <el-tree
      ref="treeRef"
      :data="dataSource"
      highlight-current
      node-key="id"
      draggable
      :allow-drop="allowDrop"
      @node-drop="nodeDrop"
      @node-click="treeNodeClick"
      @node-contextmenu="treeNodeContextmenu"
      @click.self="cancelChecked"
    >
      <template #default="{ node, data }">
        <!-- 这里需要实现新建文件的输入框 -->
        <template v-if="data.isNew">
          <el-input
            ref="newInputRef"
            @blur="confirm"
            @keydown.enter="newInputRef?.blur()"
            v-model="newFileName"
            :prefix-icon="data.isFolder ? FolderOpened : Document"
            size="small"
            :placeholder="
              data.isFolder ? 'Input Folder Name...' : 'Input File Name...'
            "
          />
        </template>
        <!--  重命名实现 需要加单独的输入框 -->
        <template v-else-if="data.isRename">
          <el-input
            ref="renameInputRef"
            @blur="renameHandle"
            @keydown.enter="renameInputRef?.blur()"
            :prefix-icon="Document"
            v-model="renameValue"
            size="small"
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
import { icons } from "../../config/index.ts";
import { onBeforeMount, onMounted } from "vue";

const {
  renameInputRef,
  renameValue,
  contextmenu,
  newInputRef,
  newFileName,
  treeRef,
  dataSource,
  menuClick,
  treeNodeClick,
  cancelChecked,
  confirm,
  addWindowEvent,
  setPopoverRef,
  removeWindowEvent,
  treeNodeContextmenu,
  renameHandle,
  nodeDrop,
  allowDrop,
} = useFileMenu();

onMounted(addWindowEvent);
onBeforeMount(removeWindowEvent);
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
    height: 25px;
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
