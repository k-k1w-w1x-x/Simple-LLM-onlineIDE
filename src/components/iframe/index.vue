<template>
  <div class="container">
    <div class="toggle-button" @click="toggleView">
      {{ showIframe ? '切换到聊天' : '切换到 iframe' }}
    </div>
    <iframe v-show="showIframe" :src="containerStore.url" frameborder="0" class="iframe" />
    <chat-component v-show="!showIframe" class="chat-component" />
  </div>
</template>

<script>
import { ref } from 'vue';
import { useContainerStore } from "../../pinia/useContainer";
import ChatComponent from "../chatWindow/chatComponent.vue";

export default {
  components: {
    ChatComponent
  },
  setup() {
    const containerStore = useContainerStore();
    const showIframe = ref(true);

    const toggleView = () => {
      showIframe.value = !showIframe.value;
    };

    return { 
      containerStore, 
      showIframe,
      toggleView
    };
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
  position: relative;
}

.toggle-button {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  padding: 8px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);

  &:hover {
    background-color: #45a049;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }
}

.iframe, .chat-component {
  flex: 1;
  width: 100%;
  height: calc(100% - 40px); // 为切换按钮留出空间
  overflow: hidden;
}

.iframe {
  background-color: #fff;
}
</style>
