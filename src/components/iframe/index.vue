<template>
  <iframe :src="containerStore.url" frameborder="0" v-if="containerStore.url" />
</template>

<script setup lang="ts">
import { useContainerStore } from "../../pinia/useContainer";
const containerStore = useContainerStore();
</script>
