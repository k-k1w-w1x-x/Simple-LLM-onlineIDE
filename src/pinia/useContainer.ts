// Web Container 共享文件，因为 fileTree Container对象需要在其他文件中共享
import { WebContainer } from "@webcontainer/api";
import { defineStore } from "pinia";

// 第一个参数是应用程序中商店的唯一 id
export const useContainerStore = defineStore("container", {
  state: () => {
    return {
      container: WebContainer || null,
      boot: false, // 定义容器是否启动
    };
  },
});
