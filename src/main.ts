import { createApp } from "vue";
import App from "./App.vue";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import Terminal from "vue-web-terminal";
import "vue-web-terminal/lib/theme/light.css";

import { createPinia } from "pinia";
const pinia = createPinia();

// eslint-disable-next-line
// @ts-ignore
createApp(App).use(pinia).use(Terminal).use(ElementPlus).mount("#app");
