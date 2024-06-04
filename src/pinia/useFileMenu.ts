// file menu pinia
import { defineStore } from "pinia";
import { ITreeDataFile } from "../type/fileMenu";

export const useFileMenuStore = defineStore("fileMenu", {
  state: () => {
    return {
      currentFile: <ITreeDataFile | null>null,
      filePath: "",
    };
  },
  actions: {
    /** 设置当前文件信息 */
    setCurrentFile(file: ITreeDataFile) {
      this.currentFile = file;
    },
    /** 设置当前路径 */
    setFilePath(path: string) {
      this.filePath = path;
    },
  },
});
