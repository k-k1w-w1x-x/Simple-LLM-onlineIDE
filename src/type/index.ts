import { FileSystemTree } from "@webcontainer/api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type voidFun = (data?: any) => void;

export type TFileTree = FileSystemTree | Uint8Array | ArrayBuffer;
