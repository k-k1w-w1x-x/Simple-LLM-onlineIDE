// monaco 数据共享
import { defineStore } from "pinia";
import { ITreeDataFile } from "../type/fileMenu";
import { editor, languages } from "monaco-editor";
import { fixEnvError } from "../utils/monaco.ts";
import { toRaw } from "vue";
import { TKeyMap, voidFun } from "../type/index.ts";
export const useMonacoStore = defineStore("monaco", {
  state: () => {
    return {
      languages: <languages.ILanguageExtensionPoint[]>[],
      editor: <editor.IStandaloneCodeEditor | null>null,
      currentFile: <ITreeDataFile | null>null,
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
      editor.setModelLanguage(
        this.getEditor()?.getModel()!,
        languageModel?.id || ""
      );
    },

    /** 获取编辑器的值 */
    getValue() {
      return this.getEditor()?.getValue();
    },

    /** 设置当前文件信息 */
    setCurrentFile(file: ITreeDataFile) {
      this.currentFile = file;
    },

    // eslint-disable-next-line
    // @ts-ignore keyDown 事件回调
    onKeyDownHandle(e: any) {
      e.browserEvent.preventDefault();

      // 通过keycode/ctrlKey/shiftKey/altKey 的状态唯一确定一个事件- 有值为true，无值为false
      const eventMap: TKeyMap<string, voidFun> = {
        "49/true/false/false": this.eventCtrlS,
      };
      const key = `${e.keyCode}/${e.ctrlKey}/${e.shiftKey}/${e.altKey}`;
      eventMap[key] && eventMap[key]();
    },

    // eventCtrlS
    eventCtrlS() {
      console.log("Ctrl S");
    },
  },
});
