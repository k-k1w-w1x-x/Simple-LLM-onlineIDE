// file menu pinia
import { defineStore } from "pinia";
import { ITreeData } from "../type/fileMenu";

export const useFileMenuStore = defineStore("fileMenu", {
  state: () => {
    return {
      dataSource: <ITreeData>[],
    };
  },
  actions: {
    // 设置dataSource
    setDataSource(data: ITreeData) {
      this.dataSource = data;
    },
  },
});
