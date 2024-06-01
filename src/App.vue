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
  </div>
</template>

<script setup lang="ts">
import fileMenu from "./components/fileMenu.vue";
import monacoEditor from "./components/monacoEditor.vue";
import myIframe from "./components/iframe.vue";
import vueTerminal from "./components/terminal/index.vue";
</script>

<style lang="less" scoped>
.editor-box {
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
