// terminal hooks
import { voidFun } from "../type";
import { useContainerStore } from "../pinia/useContainer";
export const useTerminal = () => {
  const containerStore = useContainerStore();

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
    containerStore.runTerminal(command, (content) => {
      try {
        success({ content });
      } catch (error) {
        failed({ content: error });
      }
    });
  }

  return { command };
};
