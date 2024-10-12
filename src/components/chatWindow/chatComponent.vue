<template>
  <div class="chat-container">
    <div class="messages-container">
      <div v-for="(msg, index) in messages" :key="index" class="message-wrapper">
        <div :class="['message', msg.from === 'user' ? 'user-message' : 'bot-message']">
          <div v-if="msg.from === 'bot'" v-html="renderMarkdown(msg.text)" />
          <div v-else>{{ msg.text }}</div>
        </div>
      </div>
    </div>
    <div class="input-group">
      <textarea v-model="userInput" @keyup.enter.prevent="sendMessage" @input="adjustTextareaHeight"
        placeholder="输入您的消息..." ref="messageInput"></textarea>
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>


<script>
import MarkdownIt from 'markdown-it'

export default {
  data() {
    return {
      userInput: '',
      messages: [],
      md: new MarkdownIt()
    };
  },
  methods: {
    renderMarkdown(text) {
      return this.md.render(text)
    },
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
      const response = await fetch('http://localhost:3005/api/chat', {
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
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    },
    receiveSelectedText(selectedText) {
      // 将选中的文本添加到输入框
      this.userInput = selectedText;
      // 可选：自动发送消息
      // this.sendMessage();
    }
  },
  mounted() {
    this.adjustTextareaHeight();
  },
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
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
  overflow-wrap: break-word;
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
  padding: 10px;
  background-color: #f5f5f5;
  border-top: 1px solid #e0e0e0;
}

textarea {
  flex: 1;
  min-height: 40px;
  max-height: 120px;
  resize: none;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 14px;
}

button {
  margin-left: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}
</style>
