// terminal hooks
import { voidFun } from "../type";
import { useContainerStore } from "../pinia/useContainer";
import { TerminalFlash } from "vue-web-terminal";
import ansiToHtml from 'ansi-to-html';

export const useTerminal = () => {
  const containerStore = useContainerStore();
  const installCmdList = ["npm i", "npm install", "pnpm install", "pnpm i"];
  const flash = new TerminalFlash();
  // 自定义颜色方案
  const convert = new ansiToHtml({
    colors: {
      0: '#000000', // 黑色
      1: '#aa0000', // 红色
      2: '#00aa00', // 绿色
      3: '#aa5500', // 黄色
      4: '#0000aa', // 蓝色
      5: '#aa00aa', // 洋红色
      6: '#00aaaa', // 青色
      7: '#aaaaaa', // 白色
      8: '#555555', // 亮黑
      9: '#ff5555', // 亮红
      10: '#55ff55', // 亮绿
      11: '#ffff55', // 亮黄
      12: '#5555ff', // 亮蓝
      13: '#ff55ff', // 亮洋红
      14: '#55ffff', // 亮青
      15: '#ffffff'  // 亮白
    },
    fg: '#7a7a7a', // 默认前景色
    bg: '#f5f5f5'  // 默认背景色
  });
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

          // 在转换 ANSI 到 HTML 时，使用新的颜色方案
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
