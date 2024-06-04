<template>
  <div class="web-ide-editor-box">
    <!-- 左侧文件菜单 -->
    <fileMenu />
    <!-- 右侧 编辑器+iframe+terminal -->
    <div class="web-ide-editor-box-right">
      <div class="web-ide-editor-box-right-top">
        <monacoEditor />
        <myIframe />
      </div>
      <vueTerminal />
    </div>
    <loadingVue />
  </div>
</template>

<script setup lang="ts">
import fileMenu from "./components/filemenu/index.vue";
import monacoEditor from "./components/monaco/index..vue";
import myIframe from "./components/iframe/index.vue";
import vueTerminal from "./components/terminal/index.vue";
import loadingVue from "./components/loading/index.vue";
import { useContainerStore } from "./pinia/useContainer";
const containerStore = useContainerStore();
// 1. 执行boot 操作
containerStore.bootContainer();
</script>

<style lang="less">
@import url("./style.css");
@import url("./assets/font_4568361_dguj7kf693r/iconfont.css");
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
</style>
