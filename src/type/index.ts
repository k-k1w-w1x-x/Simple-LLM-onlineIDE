import { FileSystemTree } from "@webcontainer/api";
import { editor } from "monaco-editor";

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
