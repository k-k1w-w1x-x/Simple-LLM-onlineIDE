<template>
  <!-- loading -->
  <div class="loading" v-if="!containerStore.boot">
    <div class="loader" v-if="!bootedFalse"></div>
    <span :class="{ error: bootedFalse }">
      <span v-if="bootedFalse">⛔</span>
      {{ message }}
    </span>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useContainerStore } from "../../pinia/useContainer";
const containerStore = useContainerStore();
let message = ref("Wait for the web container to boot...");
const bootedFalse = ref(false);

// 2. 10s后，如果containerStore.boot 仍为false，则提示失败
const timer = setTimeout(() => {
  if (!containerStore.boot) {
    message.value = "Faid to boot,Reload to try again.";
    bootedFalse.value = true;
  }
  clearTimeout(timer);
}, 10000);
</script>

<style lang="less" scoped>
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
