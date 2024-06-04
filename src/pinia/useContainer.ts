// Web Container 共享文件，因为 fileTree Container对象需要在其他文件中共享
import { WebContainer, WebContainerProcess } from "@webcontainer/api";
import { getFileIcon, sortFile, tryCatch } from "../utils";
import { defineStore } from "pinia";
import { TFileTree, voidFun } from "../type";
import { ITreeData } from "../type/fileMenu";

// 第一个参数是应用程序中商店的唯一 id
export const useContainerStore = defineStore("container", {
  state: () => {
    return {
      boot: false, // 定义容器是否启动
      url: "", // 定义WebContainer 启动后的url
      fileTree: <TFileTree>{}, // 文件树结构
      container: <InstanceType<typeof WebContainer> | null>null, // container 容器
    };
  },

  actions: {
    /**
     * 封装统一的输出函数 - 监听容器输出
     * @param stdout
     * @param fun
     */
    output(stdout: WebContainerProcess, fun: voidFun) {
      stdout.output.pipeTo(
        new WritableStream({
          write(data) {
            fun(data);
          },
        })
      );
    },

    /**
     * 设置 filetree
     * @param fileTree
     */
    async setFileTree(fileTree: TFileTree) {
      this.fileTree = fileTree;
      await this.container?.mount(this.fileTree);
    },

    /**
     * bootContainer 启动容器 实现重连容器
     */
    async bootContainer() {
      try {
        this.container = await WebContainer.boot();
        this.boot = true;
      } catch (error) {
        console.log("reboot agan.");
        this.container?.teardown();
        this.container = null;
        this.container = await WebContainer.boot();
      }
      this.container.on("server-ready", (_port: number, url: string) => {
        console.log("server-ready.");
        this.url = url;
      });

      console.log("## Web Container Booted.");
    },

    /**
     * 执行 terminal 命令
     * @param cmd
     * @param fun
     */
    runTerminal(cmd: string, fun: voidFun) {
      tryCatch(async () => {
        if (!this.container) return;
        const command = cmd.split(" "); // 这里是按空格进行分割
        const state = await this.container.spawn(command[0], command.slice(1));
        // 如果是下载命令，则需要获取状态码
        // if (command[1] === "install" || command[1] === "i") {
        //   const code = await state.exit;
        //   // if (code === 0) this.install = true;
        // }
        // 不管成功还是失败，都输出
        this.output(state, fun);
      });
    },

    /**
     * Web Container 的文件操作
     *  1. 读取文件内容 - monaco用
     *  2. 写入文件内容 - monaco 用
     *  3. 删除文件/文件夹
     *  4. 新建文件/文件夹
     *  5. 读取目录 - 转成tree datasuorce
     */
    async readFile() {},
    async writeFile(
      path: string,
      data: string | Uint8Array,
      options?: { encoding?: null | BufferEncoding } | null
    ) {
      await this.container?.fs.writeFile(path, data, options);
    },
    async rename(oldname: string, newname: string) {
      await this.container?.fs.rename(oldname, newname);
    },
    async deleteFile(path: string) {
      await this.container?.fs.rm(path, { recursive: true });
    },
    async addFolder(path: string) {
      // Creates a new directory. If the directory already exists, it will throw an error.
      tryCatch(async () => {
        await this.container?.fs.mkdir(path);
      });
    },
    async addFile(path: string) {
      const contents = `console.log('当前文件: ${path}')`;
      await this.writeFile(path, contents, { encoding: "utf8" });
    },
    async getDirectory() {
      // 辅助函数 -  递归获取目录下的文件
      const getFileTree = async (
        root: string
      ): Promise<ITreeData | undefined> => {
        const result = [];

        if (!this.container) return;

        const files = await this.container.fs.readdir(root, {
          withFileTypes: true,
        });

        for (let i = 0; i < files.length; i++) {
          const item = files[i];

          if (item.isDirectory()) {
            result.push({
              id: item.name,
              label: item.name,
              isFolder: true,
              children: await getFileTree(`${root}/${item.name}`),
            });
          } else {
            const name = item.name.split(".");
            const suffix = name[name.length - 1];
            result.push({
              id: item.name,
              label: item.name,
              suffix,
              isFolder: false,
              icon: getFileIcon(suffix),
            });
          }
        }

        // eslint-disable-next-line
        // @ts-ignore
        return result;
      };
      const fileMenu = (await getFileTree("/")) as ITreeData;
      return sortFile(fileMenu);
    },
  },
});
