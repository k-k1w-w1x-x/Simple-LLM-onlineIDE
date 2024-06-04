import { FileSystemTree } from "@webcontainer/api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type voidFun = (data?: any) => void;

// webcontainer FileSystemTree 类型
export type TFileTree = FileSystemTree | Uint8Array | ArrayBuffer;

// 索引泛型
export type TKeyMap<T extends string | number | symbol, V> = {
  [key in T]: V;
};
