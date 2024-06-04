<template>
  <div class="web-ide-editor-box">
    <!-- 左侧文件菜单 -->
    <fileMenu />
    <div class="web-ide-editor-box-right">
      <div class="web-ide-editor-box-right-top">
        <!-- 编辑器+iframe -->
        <monacoEditor />
        <myIframe />
      </div>
      <!-- 底部Terminal -->
      <vueTerminal />
    </div>

    <!-- loading -->
    <div class="loading" v-if="!containerStore.boot">
      <div class="loader" v-if="!bootedFlag" />
      <span :class="{ error: bootedFlag }">
        <span v-if="bootedFlag">⛔</span>
        {{ message }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import fileMenu from "./components/filemenu/index.vue";
import monacoEditor from "./components/monaco/index..vue";
import myIframe from "./components/iframe/index.vue";
import vueTerminal from "./components/terminal/index.vue";
import { useContainerStore } from "./pinia/useContainer";
import { useLoading } from "./hooks/useLoading";
const { message, bootedFlag, checkBooted } = useLoading();
const containerStore = useContainerStore();
// 1. 执行boot 操作
containerStore.bootContainer();
// 2. 定时检测容器挂载状态
checkBooted();
</script>

<style lang="less" scoped>
.web-ide-editor-box {
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  &-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    &-top {
      flex: auto;
      display: flex;
    }
  }
}

.loading {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  z-index: 88;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    margin-left: 10px;
  }
}

.error {
  color: #f56c6c;
}
</style>
