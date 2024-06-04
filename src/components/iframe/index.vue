<template>
  <div class="iframe">
    <iframe
      :src="containerStore.url"
      frameborder="0"
      v-if="containerStore.url"
    />
  </div>
</template>

<script setup lang="ts">
import { useContainerStore } from "../../pinia/useContainer";
const containerStore = useContainerStore();
</script>

<style lang="less" scoped>
.iframe {
  flex: 1;
}
iframe {
  height: 100%;
  width: 100%;
}
</style>
