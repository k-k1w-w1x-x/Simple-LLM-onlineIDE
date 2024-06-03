<template>
  <div class="terminal">
    <div class="terminal-tabs">
      <span class="active">Term 1</span>
    </div>
    <div class="terminal-list">
      <terminal name="terminal1" />
    </div>
  </div>
</template>

<script setup lang="ts">
import terminal from "./components/vue-web-terminal.vue";
</script>

<style lang="less" scoped>
.terminal {
  height: 180px;
  border-top: solid #ccc 1px;
  &-tabs {
    height: 28px;
    display: flex;
    align-items: center;
    span {
      padding-bottom: 4px;
      cursor: pointer;
      font-size: 12px;
      margin: 0 8px;
    }
  }
  &-list{
    padding-bottom: 10px;
  }
}
.active {
  color: #4680ff;
  border-bottom: solid #4680ff 1px;
}
</style>
