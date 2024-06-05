// monaco 数据共享
import { defineStore } from "pinia";
import { editor, languages } from "monaco-editor";
import { fixEnvError } from "../utils/monaco.ts";
import { nextTick, toRaw } from "vue";
import { TKeyMap, voidFun } from "../type/index.ts";
import { useContainerStore } from "./useContainer.ts";
import { useFileMenuStore } from "./useFileMenu.ts";
import { ITreeDataFile } from "../type/fileMenu.ts";

export const useMonacoStore = defineStore("monaco", {
  state: () => {
    return {
      languages: <languages.ILanguageExtensionPoint[]>[],
      editor: <editor.IStandaloneCodeEditor | null>null,
      fileStateMap: new Map<string, any>(), // 1. 关键参数 map
      fileList: <ITreeDataFile[]>[], // 定义当前文件列表 - 实现 tab 切换
      currentFile: 0, // 当前文件 - 使用下标索引
      containerStore: useContainerStore(),
      fileMenuStore: useFileMenuStore(),
    };
  },

  actions: {
    /**
     * 初始化 monaco
     */
    initMonaco(selector: string) {
      if (this.editor) return;
      this.fileStateMap.clear();
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

    /** 通过传入的 后缀 获取Monaco language */
    getLanguageModel(suffix: string) {
      return this.languages.find((item) =>
        item.extensions?.includes(`.${suffix}`)
      );
    },

    //   获取当前文件ID
    getCurrentFileID() {
      return this.fileList[this.currentFile].id;
    },

    /** 为了避免Vue响应式对编辑器的影响，使用toRaw转成普通对象 */
    getEditor() {
      return toRaw(this.editor);
    },

    /** 设置编辑器的值 + 设置语言模型 */
    setValue(value: string, suffix: string) {
      this.getEditor()?.setValue(value);
      const ITextModel = this.getEditor()?.getModel() as editor.ITextModel;
      const languageModelId = this.getLanguageModel(suffix)?.id || "javascript";
      editor.setModelLanguage(ITextModel, languageModelId);
    },

    /** 获取编辑器的值 */
    getValue() {
      return this.getEditor()?.getValue();
    },

    /** 创建新的文本模型 */
    createModel(value: string, language: string) {
      return editor.createModel(value, language);
    },

    /** 设置新模型 */
    setModel(model: editor.ITextModel) {
      this.getEditor()?.setModel(model);
    },

    /** 获取当前编辑器语言模型 */
    getModel() {
      return this.getEditor()?.getModel();
    },

    /** 保存当前视图状态 */
    saveViewState() {
      return this.getEditor()?.saveViewState();
    },
    /** 恢复视图状态 */
    restoreViewState(state: editor.ICodeEditorViewState | null) {
      this.getEditor()?.restoreViewState(state);
    },

    /**
     *  Monaco Editor 多tab页切换实现思路:
     *   1. editor.saveViewState() 获取当前编辑器的状态
     *   2. editor.restoreViewState 恢复编辑器状态
     *   3. editor.focus() 获取焦点
     *   4. createModel、getModel、setModel
     */
    //  添加文件到monaco编辑区
    async addFile(file: ITreeDataFile) {
      // 判断文件列表是否已经存在，存在则直接跳转到该文件即可
      if (!this.fileList.find((i) => i.id === file.id)) {
        // 添加文件到列表
        this.fileList.push(file);
        await nextTick();
        if (!this.editor) this.initMonaco(".monaco-box-container");
      }

      //  更新index
      this.switchFile(this.fileList.findIndex((i) => i.id === file.id));
    },

    //  删除文件
    deleteFile() {},

    //   切换文件 - 需要保存 state
    async switchFile(index: number) {
      const fileSuffix = this.fileList[index].suffix;
      // 2. 跳转到指定文件
      this.currentFile = index;

      // 3. 看看跳转后文件时候有 model 有的话直接使用，没有就创建新的
      const file = this.fileStateMap.get(this.getCurrentFileID());

      if (file && file.model) {
        this.setModel(toRaw(file.model));
        this.restoreViewState(toRaw(file.state)); // 恢复文件的编辑状态
      } else {
        // 2. 读取文件内容赋给monaco
        const contents = await this.containerStore.readFile(
          this.fileMenuStore.filePath
        );

        const model = this.createModel(
          contents || "",
          this.getLanguageModel(fileSuffix)?.id as string
        );

        this.setModel(model);

        this.fileStateMap.set(this.getCurrentFileID(), {
          model: this.getModel(),
          state: this.saveViewState(),
        });
      }
      this.getEditor()?.focus();
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
      // 1. 获取当前编辑器的内容
      const contents = this.getEditor()?.getValue() as string;
      // 2. 调用 container 的 saveFile 方法
      this.containerStore.writeFile(this.fileMenuStore.filePath, contents);
    },
  },
});
