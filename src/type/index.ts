import { FileSystemTree } from "@webcontainer/api";
import { editor } from "monaco-editor";
import { ITree } from "./fileMenu";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type voidFun = (data?: any) => void;

// webcontainer FileSystemTree 类型
export type TFileTree = FileSystemTree | Uint8Array | ArrayBuffer;

// 索引泛型
export type TKeyMap<T extends string | number | symbol, V> = {
  [key in T]: V;
};

// fileStateMap monaco 语言模型状态和model 映射
export type TFileStateMap = Map<
  string,
  {
    state: editor.ICodeEditorViewState | null;
    model: editor.ITextModel | null;
  }
>;

// 定义文件/文件夹右键菜单结构
export type TFileMenu = {
  isFolder: boolean;
  label: string;
  shortcut?: string;
  callback: (d: ITree) => void;
};
