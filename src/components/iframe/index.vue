<template>
  <div class="container">
    <iframe v-if="containerStore.url" :src="containerStore.url" frameborder="0" class="iframe" />
    <chat-component v-else class="chat-component" />
  </div>
</template>

<script>
import { useContainerStore } from "../../pinia/useContainer";
import ChatComponent from "../chatWindow/chatComponent.vue";

export default {
  components: {
    ChatComponent
  },
  setup() {
    const containerStore = useContainerStore();
    return { containerStore };
  }
};
</script>

<style lang="less" scoped>
.container {
  flex: 1;
  background-color: var(--t-main-background-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.iframe, .chat-component {
  flex: 1;
  width: 100%;
  overflow: hidden;
}

.iframe {
  background-color: #fff;
}
</style>
