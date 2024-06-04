<template>
  <div class="editor-box">
    <!-- 左侧文件菜单 -->
    <fileMenu />
    <!-- 右侧 编辑器+iframe+terminal -->
    <div class="editor-box-right">
      <div class="editor-box-right-top">
        <monacoEditor />
        <myIframe />
      </div>
      <vueTerminal />
    </div>

    <!-- loading -->
    <div class="loading" v-if="!containerStore.boot">
      <div class="loader"></div>
      <span>Wait for the web container to boot...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import fileMenu from "./components/fileMenu.vue";
import monacoEditor from "./components/monacoEditor.vue";
import myIframe from "./components/iframe.vue";
import vueTerminal from "./components/terminal/index.vue";
import { useContainerStore } from "./pinia/useContainer";
const containerStore = useContainerStore();
// 1. 执行boot 操作
containerStore.bootContainer();
</script>

<style>
@import url("./style.css");
@import url("./assets/font_4568361_dguj7kf693r/iconfont.css");
</style>

<style lang="less" scoped>
.editor-box {
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
</style>
