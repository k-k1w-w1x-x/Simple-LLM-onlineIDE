<template>
  <terminal :name="name" context="Root" :show-header="false" :init-log="null" />
</template>

<script setup lang="ts">
const { name } = defineProps<{
  name: string;
}>();
</script>

<style lang="less" scoped>
.t-container {
  box-shadow: none !important;
}
</style>
