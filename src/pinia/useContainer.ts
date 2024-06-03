// Web Container 共享文件，因为 fileTree Container对象需要在其他文件中共享
import { WebContainer, WebContainerProcess } from "@webcontainer/api";
import { tryCatch } from "../utils";
import { defineStore } from "pinia";
import { TFileTree, voidFun } from "../type";

// 第一个参数是应用程序中商店的唯一 id
export const useContainerStore = defineStore("container", {
  state: () => {
    return {
      fileTree: <TFileTree>{},
      container: <InstanceType<typeof WebContainer> | null>null,
      boot: false, // 定义容器是否启动
      install: false, // 定义项目依赖是否安装
      url: "", // 定义WebContainer 启动后的url
    };
  },

  actions: {
    // 封装统一的输出函数 - 监听容器输出
    async output(stdout: WebContainerProcess, fun: voidFun) {
      stdout.output.pipeTo(
        new WritableStream({
          write(data) {
            fun(data);
          },
        })
      );
    },

    // 设置 filetree
    setFileTree(fileTree: TFileTree) {
      this.fileTree = fileTree;
      this.mountFile();
    },

    // 1. bootContainer 启动容器
    bootContainer() {
      tryCatch(async () => {
        this.container = await WebContainer.boot();
        this.boot = true;
        this.listenServer();
      });
    },

    // 2. 挂载文件
    mountFile() {
      tryCatch(async () => {
        if (!this.container) return;
        await this.container.mount(this.fileTree);
      });
    },

    // 3. 执行 terminal 命令
    runTerminal(cmd: string, fun: voidFun) {
      tryCatch(async () => {
        if (!this.container) return;
        const command = cmd.split(" "); // 这里是按空格进行分割
        const state = await this.container.spawn(command[0], command.slice(1));
        // 如果是下载命令，则需要获取状态码
        if (command[1] === "install" || command[1] === "i") {
          const code = await state.exit;
          if (code === 0) this.install = true;
        }
        // 不管成功还是失败，都输出
        this.output(state, fun);
      });
    },

    // 监听 server ready 事件
    listenServer() {
      if (!this.container) return;
      this.container.on("server-ready", (_port: number, url: string) => {
        this.url = url;
      });
    },
  },
});
