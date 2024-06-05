<template>
  <div class="monaco-box">
    <!-- 实现多tab切换 -->
    <div class="monaco-box-bar">
      <span
        data-key="closeFileButton"
        :data-fileID="file.id"
        @click="monacoStore.switchFile(file.id)"
        v-for="(file, index) in monacoStore.fileList"
        :key="index"
        :class="{ active: monacoStore.currentFileID === file.id }"
      >
        {{ file?.label }}
      </span>
    </div>
    <div class="monaco-box-container" v-if="monacoStore.fileList.length"></div>
    <div class="monaco-box-empty" v-else>
      <i class="iconfont icon-CodeSandbox"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMonacoStore } from "../../pinia/useMonaco";
const monacoStore = useMonacoStore();

window.addEventListener("mouseup", async (e: MouseEvent) => {
  const span = e.target as HTMLElement;
  if (e.button === 1 && span.getAttribute("data-key") === "closeFileButton") {
    // 1. 先保存
    await monacoStore.eventSave();
    // 2. 关闭文件
    const fileID = span.getAttribute("data-fileID") as string;
    monacoStore.deleteFile(fileID);
  }
});
</script>

<style lang="less" scoped>
.monaco-box {
  flex: 1;
  border-right: solid #ccc 1px;
  &-bar {
    border-bottom: solid #ccc 1px;
    box-sizing: content-box;
    height: 20px;
    padding: 5px 10px 0 10px;
    display: flex;
    align-items: center;
    span {
      padding: 0 5px 4px 5px;
      cursor: pointer;
      font-size: 12px;
      margin: 0 8px;
    }
    .active {
      color: #4680ff;
      border-bottom: solid #4680ff 4px;
    }
  }
  &-container {
    overflow: hidden;
    height: calc(100% - 30px);
  }
  &-empty {
    overflow: hidden;
    height: calc(100% - 30px);
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      font-size: 120px;
      color: rgba(70, 128, 255, 0.3);
    }
  }
}
.el-button {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
