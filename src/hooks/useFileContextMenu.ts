import { reactive } from "vue";
import { TFileMenu } from "../type";

// 文件右键菜单 hooks
export const useFileContextMenu = () => {
  // 定义 ref List
  const popoverRefList = reactive<HTMLElement[]>([]);

  // 定义文件显示列表
  const contextmenu: TFileMenu[] = [
    {
      isFolder: false,
      label: "在侧边打开",
      shortcut: "Ctrl + O",
      callback: (data) => {
        closePopover();
        console.log("在侧边打开", data);
      },
    },
    {
      isFolder: false,
      label: "打开时间线",
      callback: () => {
        console.log("打开时间线");
      },
    },
    {
      isFolder: false,
      label: "重命名",
      shortcut: "F2",
      callback: () => {
        console.log("重命名");
      },
    },
    {
      isFolder: false,
      label: "删除",
      shortcut: "Delete",
      callback: () => {
        console.log("删除");
      },
    },
  ];

  //   设置 Ref
  const setPopoverRef = (el: HTMLElement) => popoverRefList.push(el);

  // @ts-ignore  关闭 poppover
  const closePopover = () => popoverRefList.forEach((el) => el?.hide());

  return {
    contextmenu,
    setPopoverRef,
    closePopover,
  };
};
