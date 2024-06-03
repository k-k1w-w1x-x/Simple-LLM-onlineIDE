<template>
  <div class="iframe">
    <iframe :src="containerStore.url" v-if="containerStore.url" />

    <div class="loader-box" v-else>
      <div class="loader"></div>
      <span v-if="!containerStore.boot">{{ "web container boot..." }}</span>
      <span v-else-if="!containerStore.install">{{ "npm install..." }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useContainerStore } from "../pinia/useContainer";
const containerStore = useContainerStore();

// 1. 执行boot 操作
containerStore.bootContainer();
</script>

<style lang="less" scoped>
.iframe {
  flex: 1;
  border-left: solid #ccc 1px;
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
}
.loader-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
