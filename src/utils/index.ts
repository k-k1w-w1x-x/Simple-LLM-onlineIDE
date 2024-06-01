// 文件icon 映射
import js from "../assets/fileIcon/js.svg";
import html from "../assets/fileIcon/html.svg";
import css from "../assets/fileIcon/css.svg";
import unknown from "../assets/fileIcon/unknown.svg";

// 一定是通过后缀去获取文件icon，这样在新建的时候，才可以直接 split
export const getFileIcon = (fileSuffix: string) => {
  const map: { [key: string]: string } = {
    js,
    html,
    css,
  };
  return map[fileSuffix] || unknown;
};
