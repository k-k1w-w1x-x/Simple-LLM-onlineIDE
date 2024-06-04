<template>
  <div class="monaco-box">
    <!-- 实现多tab切换 -->
    <div class="monaco-box-bar">
      <span class="active">{{ monacoStore.currentFile?.label }}</span>
    </div>
    <div class="monaco-box-container"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useMonacoStore } from "../../pinia/useMonaco";
const monacoStore = useMonacoStore();

onMounted(() => {
  monacoStore.initMonaco(".monaco-box-container");
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
}
</style>
