// 文件icon 映射
import { voidFun } from "../type";
import {
  ITreeData,
  ITreeDataFile,
  ITreeDataFolder,
  TFullData,
} from "../type/fileMenu";

/**
 * 通过文件后缀动态获取文件icon
 * 如果后缀不存在/或者找不到对应文件后缀，则会主动返回 unknown
 * @param fileSuffix
 * @returns
 */
export const getFileIcon = (fileSuffix: string) => {
  // 没有后缀名统一返回unknown
  if (!fileSuffix) return require(`../assets/fileIcon/unknown.svg`);
  try {
    return require(`../assets/fileIcon/${fileSuffix}.svg`);
  } catch (error) {
    return require(`../assets/fileIcon/unknown.svg`);
  }
};

/**
 * 封装统一的trycatch
 * @param fn 需要捕获异常的函数
 */
export const tryCatch = (fn: voidFun) => {
  try {
    fn();
  } catch (error) {
    console.log(error);
  }
};

/**
 * 统一处理folder/file 的排序问题
 *  1. sort isFolder 先按是否目录排序
 *  2. sort filename 再按文件名称排序
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
    return new URL(handlePath, import.meta.url).href;
  } catch (error) {
    console.warn(error);
  }
};

// 解析路径 获取文件层级
// export function getFullPath(
//   tree: (ITreeDataFile | ITreeDataFolder)[],
//   targetId: string | number,
//   path: string[] = []
// ) {
//   if (!tree.length) return;
//   for (let i = 0; i < tree.length; i++) {
//     const item = tree[i];
//     if (!item.label) continue;
//     path.push(item.label);
//     if (item.id === targetId) return path;
//     if ((item as ITreeDataFolder).children.length)
//       // eslint-disable-next-line
//       // @ts-ignore
//       return getFullPath(item.children, targetId, path.slice());
//   }
// }
export function getFullPath(
  tree: TFullData,
  targetId: string | number,
  path = <string[]>[]
): string[] | null {
  for (let node of tree) {
    path.push(node.label);

    if (node.id === targetId) return path;
    // @ts-ignore
    if (node.children && node.children.length) {
      // @ts-ignore
      const parentPath = getFullPath(node.children, targetId, path.slice());
      if (parentPath) return parentPath;
    }
    path.pop();
  }
  return null;
}
