import { createApp } from "vue";
import App from "./App.vue";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import Terminal from "vue-web-terminal";
// import "vue-web-terminal/lib/theme/light.css"; 通过主题切换实现

import { createPinia } from "pinia";
const pinia = createPinia();

// 引入必要css
import "./style/index.css";
/* 加载 loader */
import "./style/loader.css";
/* vue-web-terminal theme */
import "./style/theme/light.css";
import "./style/theme/dark.css";
// iconfont
import "./assets/font_4568361_dguj7kf693r/iconfont.css";

// 主题切换
import { setTheme } from "./utils/theme";
setTheme("light");

// eslint-disable-next-line
// @ts-ignore
createApp(App).use(pinia).use(Terminal).use(ElementPlus).mount("#app");
