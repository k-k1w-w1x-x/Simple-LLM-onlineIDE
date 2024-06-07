// monaco 数据共享
import { defineStore } from "pinia";
import { editor, languages } from "monaco-editor";
import { fixEnvError } from "../utils/monaco.ts";
import { nextTick, toRaw } from "vue";
import {
  TEditorEvent,
  TEditorStateMap,
  TKeyMap,
  voidFun,
} from "../type/index.ts";
import { useContainerStore } from "./useContainer.ts";
import { ITreeDataFile, TFullData } from "../type/fileMenu.ts";
import { useFileMenuStore } from "./useFileMenu.ts";
import { getFullPath } from "../utils/index.ts";

export const useMonacoStore = defineStore("monaco", {
  state: () => {
    return {
      selector: ".monaco-box-container", // 暂时是这样的
      languages: <languages.ILanguageExtensionPoint[]>[], // 支持的语言
      editor: <editor.IStandaloneCodeEditor | null>null,
      editorStateMap: <TEditorStateMap>new Map(), // 1. 关键参数 map
      fileList: <ITreeDataFile[]>[], // 定义当前文件列表 - 实现 tab 切换
      currentFileID: "", // 当前文件ID
      containerStore: useContainerStore(),
      fileMenuStore: useFileMenuStore(),
    };
  },

  actions: {
    /**
     * 初始化 monaco
     */
    initEditor() {
      if (this.editor) return;
      this.editorStateMap.clear();
      // 1. 修复worker 异常问题
      fixEnvError();
      // 2. 创建 editor 实例
      const dom = document.querySelector(this.selector) as HTMLElement;
      // 3. 获取所有语言模型
      this.languages = languages.getLanguages();
      this.editor = editor.create(dom);
      // 4. 监听事件
      this.editor.onKeyDown(this.onKeyDownHandle);
    },

    /** 销毁editor */
    destroyEditor() {
      this.getEditor()?.dispose();
      this.editor = null;
      // this.containerStore.destroyContainer();
    },

    /** 通过传入的 后缀 获取Monaco language */
    getLanguageModel(suffix: string) {
      return this.languages.find((item) =>
        item.extensions?.includes(`.${suffix}`)
      );
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
    async openFile(file: ITreeDataFile) {
      // 判断文件列表是否已经存在，存在则直接跳转到该文件即可
      if (!this.fileList.find((i) => i.id === file.id)) {
        // 添加文件到列表
        this.fileList.push(file);
        await nextTick();
        this.initEditor();
      }

      //  更新index
      this.switchFile(file.id);
    },

    // 获取文件 path
    getFilePath(id: string) {
      const data = this.fileMenuStore.dataSource as TFullData;
      const fullpath = <string[]>getFullPath(data, id);
      return "/" + fullpath.join("/");
    },

    //  删除文件
    async deleteFile(id: string) {
      // 删除文件 tab 标签
      this.fileList.splice(
        this.fileList.findIndex((i) => i.id === id),
        1
      );
      /**
       * 需要将被删除的文件，内容更新为被删除的monaco 的value
       *  1. 被删除文件的path路径
       *  2. 被删除文件的mnaco editor value
       */

      // 1. 找path
      const path = this.getFilePath(id);
      //  2. 先跳过去 获取 model value
      this.switchFile(id);
      const value = this.getValue();
      // 3. 保存
      await this.containerStore.writeFile(path, value as string);
      // 删除 stateMap
      this.editorStateMap.delete(id);
      // 关闭 editor
      if (!this.fileList.length) return this.destroyEditor();
      //  更新index - 取第一个
      this.switchFile(this.fileList[0].id);
    },

    //   切换文件 - 需要保存 state
    async switchFile(id: string) {
      if (!this.fileList.length) return;
      const fileSuffix = this.fileList.find((i) => i.id === id)
        ?.suffix as string;

      // 2. 跳转到指定文件
      this.currentFileID = id;

      // 3. 看看跳转后文件时候有 model 有的话直接使用，没有就创建新的
      const file = this.editorStateMap.get(id);

      if (file && file.model) {
        this.setModel(toRaw(file.model));
        this.restoreViewState(toRaw(file.state)); // 恢复文件的编辑状态
      } else {
        // 2. 读取文件内容赋给monaco
        const path = this.getFilePath(id);
        const contents = await this.containerStore.readFile(path);
        // 创建语言模型
        const model = this.createModel(
          contents || "",
          this.getLanguageModel(fileSuffix)?.id as string
        );
        // 设置语言模型
        this.setModel(model);
        // 保存当前文件的状态，以便后续再次打开时，直接加载状态即可
        const newmodel = this.getModel() as editor.ITextModel;
        const state = this.saveViewState() as editor.ICodeEditorViewState;
        this.editorStateMap.set(id, { model: newmodel, state });
      }
    },

    // keyDown 事件回调
    onKeyDownHandle(e: TEditorEvent) {
      // 通过keycode/ctrlKey/shiftKey/altKey 的状态唯一确定一个事件- 有值为true，无值为false
      const eventMap: TKeyMap<string, voidFun> = {
        "49/true/false/false": this.saveHandle, // Ctrl + S
        // Ctrl + W 关闭当前文件
      };

      const key = `${e.keyCode}/${e.ctrlKey}/${e.shiftKey}/${e.altKey}`;

      if (eventMap[key]) {
        eventMap[key]();
        e.browserEvent.preventDefault();
      }
    },

    // Ctrl S
    async saveHandle() {
      // 1. 获取当前编辑器的内容-因为支持多tab 不能直接取当前，应该取当前的id对应的内容
      const contents = this.getEditor()?.getValue() as string;
      const path = this.getFilePath(this.currentFileID);
      // 2. 调用 container 的 saveFile 方法
      await this.containerStore.writeFile(path, contents);
    },
  },
});
