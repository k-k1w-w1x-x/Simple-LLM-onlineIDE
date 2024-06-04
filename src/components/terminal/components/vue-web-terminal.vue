<template>
  <terminal
    :name="name"
    context="Root"
    @exec-cmd="command"
    :show-header="false"
    :auto-help="false"
    :init-log="null"
  />
</template>

<script setup lang="ts">
const { name } = defineProps<{ name: string }>();
import { useTerminal } from "../../../hooks/useTerminal";
const { command } = useTerminal();
</script>

<style lang="less" scoped>
.t-container {
  box-shadow: none !important;
}
</style>
