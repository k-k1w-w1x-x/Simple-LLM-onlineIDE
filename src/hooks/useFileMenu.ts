import { reactive, ref } from "vue";
import { ITreeData, ITree } from "../type/fileMenu";
import js from "../assets/fileIcon/js.svg";
import html from "../assets/fileIcon/html.svg";
import css from "../assets/fileIcon/css.svg";
import type { ElTree } from "element-plus";
import { voidFun } from "../type";

// useFileMenu
export const useFileMenu = () => {
  // 定义树节点 Ref -  InstanceType 处理 ElTree 页面dom 问题
  const treeRef = ref<InstanceType<typeof ElTree> | null>(null);

  //   当前选中的节点
  const currentNodeKey = ref<string | number>("");

  // 定义顶部icon - 静态
  const icons = [
    "icon-xinjianwenjian",
    "icon-xinjianwenjianjia",
    "icon-zidongliuchengxiafaliebiao",
    "icon-gengduo",
  ];

  // data tree 数据源
  const dataSource = reactive<ITreeData>([
    {
      id: "1",
      label: "src",
      isFolder: true,
      children: [
        {
          id: "2",
          icon: html,
          suffix: "html",
          label: "index.html",
        },
        {
          id: "3",
          icon: js,
          suffix: "html",
          label: "index.js",
        },
        {
          id: "4",
          icon: css,
          suffix: "html",
          label: "index.css",
        },
      ],
    },
  ]);

  // filemenu icon click
  function iconClick(d: number) {
    const event: { [k: number]: voidFun } = [newFile, newFolder, collapseAll];
    event[d] && event[d]();
  }
  // 新建文件
  function newFile() {}
  // 新建文件夹
  function newFolder() {}
  // 折叠所有文件
  function collapseAll() {}

  /**
   * 节点点击回调 - 通过该参数实现识别当前的目录层级
   * @param data
   */
  function nodeClick(data: ITree) {
    currentNodeKey.value = data.id;
  }

  /**
   * cancelChecked
   */
  function cancelChecked() {
    //  .is-current 通过该类实现的当前文件激活样式
    currentNodeKey.value = "";
    treeRef.value?.setCurrentKey();
  }

  return {
    treeRef,
    icons,
    dataSource,
    currentNodeKey,
    iconClick,
    nodeClick,
    cancelChecked,
  };
};
