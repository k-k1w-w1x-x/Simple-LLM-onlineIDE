// terminal hooks
import { voidFun } from "../type";
import { useContainerStore } from "../pinia/useContainer";
import { TerminalFlash } from "vue-web-terminal";
import ansiToHtml from 'ansi-to-html';

export const useTerminal = () => {
  const containerStore = useContainerStore();
  const installCmdList = ["npm i", "npm install", "pnpm install", "pnpm i"];
  const flash = new TerminalFlash();
  const convert = new ansiToHtml();
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
        try {
          if (content instanceof Uint8Array) {
            // 如果是二进制数据，先解码
            const decoder = new TextDecoder();
            content = decoder.decode(content);
          }

          // 将 ANSI 转换为 HTML
          const htmlContent = convert.toHtml(content);

          success({ content: htmlContent });
        } catch (error) {
          failed({ content: String(error) });
        }
      });
    } else {
      containerStore.runTerminal(command, (content) => {
        try {
          if (content instanceof Uint8Array) {
            // 如果是二进制数据，先解码
            const decoder = new TextDecoder();
            content = decoder.decode(content);
          }
          // 将 ANSI 转换为 HTML
          const htmlContent = convert.toHtml(content);
          success({ content: htmlContent });
        } catch (error) {
          failed({ content: error });
        }
      });
    }
  }

  return { command };
};
