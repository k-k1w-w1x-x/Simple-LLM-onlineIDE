import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import Terminal from "vue-web-terminal";
//  3.2.0 及 2.1.13 以后版本需要引入此样式，之前版本无需引入主题样式
import "vue-web-terminal/lib/theme/light.css";

// @ts-ignore
createApp(App).use(Terminal).use(ElementPlus).mount("#app");
