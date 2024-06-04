// monaco 数据共享
import { defineStore } from "pinia";
import { editor, languages } from "monaco-editor";
import { fixEnvError } from "../utils/monaco.ts";
import { toRaw } from "vue";
import { TKeyMap, voidFun } from "../type/index.ts";
import { useContainerStore } from "./useContainer.ts";
import { useFileMenuStore } from "./useFileMenu.ts";

export const useMonacoStore = defineStore("monaco", {
  state: () => {
    return {
      languages: <languages.ILanguageExtensionPoint[]>[],
      editor: <editor.IStandaloneCodeEditor | null>null,
    };
  },

  actions: {
    /**
     * 初始化 monaco
     */
    initMonaco(selector: string) {
      // 1. 修复worker 异常问题
      fixEnvError();

      // 2. 创建 editor 实例
      const dom = document.querySelector(selector) as HTMLElement;
      this.editor = editor.create(dom);

      // 3. 获取所有语言模型
      this.languages = languages.getLanguages();

      // 4. 监听事件
      this.editor.onKeyDown(this.onKeyDownHandle);
    },
    /** 为了避免Vue响应式对编辑器的影响，使用toRaw转成普通对象 */
    getEditor() {
      return toRaw(this.editor);
    },

    /** 设置编辑器的值 + 设置语言模型 */
    setValue(value: string, language: string) {
      this.getEditor()?.setValue(value);
      // 1. 文件后缀与语言模型匹配
      const languageModel = this.languages.find((item) => {
        return item.extensions?.includes(`.${language}`);
      });
      // 2. 设置语言模型
      const ITextModel = this.getEditor()?.getModel() as editor.ITextModel;
      const languageModelId = languageModel?.id || "";
      editor.setModelLanguage(ITextModel, languageModelId);
    },

    /** 获取编辑器的值 */
    getValue() {
      return this.getEditor()?.getValue();
    },

    // keyDown 事件回调
    onKeyDownHandle(e: {
      keyCode: number;
      ctrlKey: boolean;
      shiftKey: boolean;
      altKey: boolean;
      browserEvent: { preventDefault: () => void };
    }) {
      // 通过keycode/ctrlKey/shiftKey/altKey 的状态唯一确定一个事件- 有值为true，无值为false
      const eventMap: TKeyMap<string, voidFun> = {
        "49/true/false/false": this.eventSave,
      };
      const key = `${e.keyCode}/${e.ctrlKey}/${e.shiftKey}/${e.altKey}`;

      if (eventMap[key]) {
        eventMap[key]();
        e.browserEvent.preventDefault();
      }
    },

    // eventCtrlS
    eventSave() {
      const containerStore = useContainerStore();
      const fileMenuStore = useFileMenuStore();
      // 1. 获取当前编辑器的内容
      const contents = this.getEditor()?.getValue() as string;
      // 2. 调用 container 的 saveFile 方法
      containerStore.writeFile(fileMenuStore.filePath, contents);
    },
  },
});
