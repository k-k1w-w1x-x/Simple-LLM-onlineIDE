// 定义 filemenu tree data
export interface ITreeDataFile {
  id: string;
  icon?: string;
  label: string;
  isFolder: boolean;
  suffix: string;
}
// 文件夹数据结构
export interface ITreeDataFolder {
  id: string;
  label: string;
  isFolder: boolean;
  children: ITreeData[];
}
// 可能是新建文件
export interface ITreeDataIsNew {
  id: string;
  isNew: boolean;
  isFolder: boolean;
}

export type ITreeData = (ITreeDataFile | ITreeDataFolder | ITreeDataIsNew)[];

// Element Plus Tree 回调参数
export type ITree = ITreeDataFile | ITreeDataFolder | ITreeDataIsNew;

// getFullPath Params data type.
export type TFullData = (ITreeDataFile | ITreeDataFolder)[];
