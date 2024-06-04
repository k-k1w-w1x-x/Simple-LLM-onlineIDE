// monaco 数据共享
import { defineStore } from "pinia";
import { ITreeDataFile } from "../type/fileMenu";
import { editor, languages } from "monaco-editor";
import { fixEnvError } from "../utils/monaco.ts";
import { toRaw } from "vue";
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
      fixEnvError();
      const dom = document.querySelector(selector) as HTMLElement;
      this.editor = editor.create(dom);
      this.languages = languages.getLanguages();
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
  },
});
