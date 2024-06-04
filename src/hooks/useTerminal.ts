// terminal hooks
import { voidFun } from "../type";
import { useContainerStore } from "../pinia/useContainer";
import { TerminalFlash } from "vue-web-terminal";
export const useTerminal = () => {
  const containerStore = useContainerStore();
  const installCmdList = ["npm i", "npm install", "pnpm install", "pnpm i"];
  const flash = new TerminalFlash();
  /**
   * 即使是多终端，也是由该组件统一派发的事件，并且只是name属性不同，因此，直接在该组件内执行 command 是最合适的
   *  1. 终端输入的命令，需要直接传递到 pinia web container 中执行
   */
  function command(
    _cmdKey: string,
    command: string,
    success: voidFun,
    failed: voidFun,
    name: string
  ) {
    console.log("终端", name, "，执行command:", command);
    // 特殊的命令需要单独处理
    if (installCmdList.includes(command)) {
      // 执行下载依赖，应该用回显模式
      success(flash);
      containerStore.runTerminal(command, (content) => {
        console.log(content, content.includes("Done"));
        if (content.includes("Done")) {
          flash.finish();
          // 把最后的信息输出
          success({ content: "✅ " + content });
        } else flash.flush(content);
      });
    } else {
      containerStore.runTerminal(command, (content) => {
        try {
          success({ content });
        } catch (error) {
          failed({ content: error });
        }
      });
    }
  }

  return { command };
};
