// 导出 文件结构的 mock 结构

import { TFileTree } from "../type";

/**
 * Vue 项目
 *  public
 *  src/main.js
 *  src/App.vue
 *  index.html
 *  package.json
 * vite.config.js
 */
const vueProject: TFileTree = {
  public: {
    directory: {},
  },
  src: {
    directory: {
      "main.js": {
        file: {
          contents: `
import { createApp } from "vue";

import App from "./App.vue";

createApp(App).mount("#app");`,
        },
      },
      "App.vue": {
        file: {
          contents: `<template>App</template>`,
        },
      },
    },
  },
  "index.html": {
    file: {
      contents: `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Web IDE</title>
</head>

<body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
</body>

</html>
`,
    },
  },
  "package.json": {
    file: {
      contents: `
{
    "name": "demo",
    "scripts": {
        "dev": "vite"
    },
    "dependencies": {
        "vue": "^3.4.21"
    },
    "devDependencies": {
        "vite": "^5.2.0",
        "@vitejs/plugin-vue": "^5.0.4"
    }
}
      `,
    },
  },
  "vite.config.js": {
    file: {
      contents: `
import { defineConfig } from "vite";

import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [vue()]
})`,
    },
  },
};

// Node 项目
const nodeProject: TFileTree = {};

// React 项目
const reactProject: TFileTree = {};

export const mock = {
  vueProject,
  nodeProject,
  reactProject,
};
