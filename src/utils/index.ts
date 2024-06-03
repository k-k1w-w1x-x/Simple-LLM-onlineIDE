// 文件icon 映射
import { voidFun } from "../type";
import { ITreeData } from "../type/fileMenu";

// 一定是通过后缀去获取文件icon，这样在新建的时候，才可以直接 split
export const getFileIcon = (fileSuffix: string) => {
  try {
    return require(`../assets/fileIcon/${fileSuffix}.svg`);
  } catch (error) {
    return require(`../assets/fileIcon/unknown.svg`);
  }
};

// 封装统一的trycatch
export const tryCatch = (fn: voidFun) => {
  try {
    fn();
  } catch (error) {
    console.log(error);
  }
};

/**
 * 统一处理folder/file 的排序问题
 *  1. sort isFolder
 *  2. sort filename
 */
export function sortFile(data: ITreeData) {
  const temp = data.sort(function (a, b) {
    if (a.isFolder && !b.isFolder) {
      return -1;
    } else if (!a.isFolder && b.isFolder) {
      return 1;
    } else {
      return 0;
    }
  });
  return temp.sort(function (a, b) {
    return Number(a.id > b.id);
  });
}

/** vite的特殊性, 需要处理图片 */
export const require = (imgPath: string) => {
  try {
    const handlePath = imgPath.replace("@", "..");
    console.log("handlePath::", imgPath);
    return new URL(handlePath, import.meta.url).href;
  } catch (error) {
    console.warn(error);
  }
};
