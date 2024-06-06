// 文件icon 映射
import { voidFun } from "../type";
import { ITreeData, TFullData } from "../type/fileMenu";

/**
 * 通过文件后缀动态获取文件icon 如果后缀不存在/或者找不到对应文件后缀，则会主动返回 unknown
 * @param fileSuffix
 * @returns string
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
    // eslint-disable-next-line
    // @ts-ignore
    return Number(a.label > b.label);
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

/**
 * 解析文件完整父级路径 ，例如 ['src','index.js']
 * @param tree
 * @param targetId
 * @param path
 * @returns
 */
export function getFullPath(
  tree: TFullData,
  targetId: string | number,
  path = <string[]>[]
): string[] | null {
  for (const node of tree) {
    path.push(node.label);

    if (node.id === targetId) return path;
    // eslint-disable-next-line
    // @ts-ignore
    if (node.children && node.children.length) {
      // eslint-disable-next-line
      // @ts-ignore
      const parentPath = getFullPath(node.children, targetId, path.slice());
      if (parentPath) return parentPath;
    }
    path.pop();
  }
  return null;
}

/**
 * 获取新建文件/文件夹的 isNew data
 */
export function getNewFileMockData(isFolder: boolean) {
  return {
    id: Date.now().toString(),
    isFolder,
    isNew: true,
  };
}

/**
 * 确定了有输入后，需要根据输入的内容创建对应的 data
 * @param isFolder 是否为文件夹
 * @param label 文件/文件夹名称
 * @param suffix 文件后缀
 * @returns
 */
export function getNewFileData(
  isFolder: boolean,
  label: string,
  suffix: string
) {
  // data.icon && !data.isFolder
  return {
    id: Date.now().toString(),
    label,
    isFolder,
    icon: isFolder ? "" : getFileIcon(suffix),
    suffix: suffix,
  };
}
