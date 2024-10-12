<template>
  <div class="container">
    <iframe v-if="containerStore.url" :src="containerStore.url" frameborder="0" class="iframe" />
    <div v-else class="chat-container">
      <div class="messages-container">
        <div v-for="(msg, index) in messages" :key="index" class="message-wrapper">
          <div :class="['message', msg.from === 'user' ? 'user-message' : 'bot-message']">
            {{ msg.text }}
          </div>
        </div>
      </div>
      <div class="input-group">
        <textarea v-model="userInput" @keyup.enter.prevent="sendMessage" @input="adjustTextareaHeight"
          placeholder="输入您的消息..." ref="messageInput"></textarea>
        <button @click="sendMessage">发送</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useContainerStore } from "../../pinia/useContainer";

export default {
  setup() {
    const containerStore = useContainerStore();
    return { containerStore };
  },
  data() {
    return {
      userInput: '',
      messages: [],
    };
  },
  methods: {
    async sendMessage() {
      if (!this.userInput) return;

      this.messages.push({ from: 'user', text: this.userInput });

      try {
        const response = await this.getBotResponse(this.userInput);
        this.messages.push({ from: 'bot', text: response });
      } catch (error) {
        console.error("Error fetching bot response:", error);
        this.messages.push({ from: 'bot', text: "抱歉，我无法获取回复。" });
      }

      this.userInput = '';
    },
    async getBotResponse(userMessage) {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.reply;
    },
    adjustTextareaHeight() {
      const textarea = this.$refs.messageInput;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
      }
    },
    receiveSelectedText(selectedText) {
      this.userInput = selectedText;
    }
  },
  mounted() {
    this.adjustTextareaHeight();
  },
};
</script>

<style lang="less" scoped>
.container {
  flex: 1;
  background-color: var(--t-main-background-color);
}

.iframe {
  background-color: #fff;
  height: 100%;
  width: 100%;
}

.chat-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.messages-container {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  padding-right: 10px;
}

.message-wrapper {
  margin-bottom: 15px;
}

.message {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 18px;
  line-height: 1.4;
  word-wrap: break-word;
}

.user-message {
  background-color: #007bff;
  color: white;
  margin-left: auto;
  border-bottom-right-radius: 4px;
}

.bot-message {
  background-color: #ffffff;
  color: #333333;
  margin-right: auto;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.input-group {
  display: flex;
  gap: 10px;
}

textarea {
  flex-grow: 1;
  min-height: 40px;
  max-height: 120px;
  resize: none;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 14px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
}
</style>
