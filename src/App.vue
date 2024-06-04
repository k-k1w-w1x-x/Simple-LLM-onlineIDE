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
      <div class="loader" v-if="!bootedFalse"></div>
      <span :class="{ error: bootedFalse }">
        <span v-if="bootedFalse">⛔</span>
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
import { ref } from "vue";
const containerStore = useContainerStore();
let message = ref("Wait for the web container to boot...");
const bootedFalse = ref(false);
// 1. 执行boot 操作
containerStore.bootContainer();
// 2. 10s后，如果containerStore.boot 仍为false，则提示失败
const timer = setTimeout(() => {
  if (!containerStore.boot) {
    message.value = "Faid to boot,Reload to try again.";
    bootedFalse.value = true;
  }
  clearTimeout(timer);
}, 10000);
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
.error {
  color: #f56c6c;
}
</style>
