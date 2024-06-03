import { nextTick, reactive, ref } from "vue";
import {
  ITreeData,
  ITree,
  ITreeDataIsNew,
  ITreeDataFolder,
  ITreeDataFile,
} from "../type/fileMenu";
import { getFileIcon } from "../utils";
import type { ElTree } from "element-plus";
import { voidFun } from "../type";
// useFileMenu
import { mock } from "../mock";
import { useContainerStore } from "../pinia/useContainer";
export const useFileMenu = () => {
  const containerStore = useContainerStore();

  // 定义树节点 Ref -  InstanceType 处理 ElTree 页面dom 问题
  const treeRef = ref<InstanceType<typeof ElTree> | null>(null);

  //   当前选中的节点
  const currentNodeKey = ref<string | number>("");

  // 新建文件的 input v-model
  const newFileName = ref("");
  // input ref
  const newFileRef = ref<HTMLInputElement | null>(null);
  const newFileFlag = ref(false);

  // 定义顶部icon - 静态
  const icons = [
    "icon-xinjianwenjian",
    "icon-xinjianwenjianjia",
    "icon-zidongliuchengxiafaliebiao",
  ];

  // data tree 数据源
  const dataSource = reactive<ITreeData>([]);

  // filemenu icon click
  function iconClick(d: number) {
    // 先清空所有添加的
    removeNewItem();
    newFileName.value = "";
    // 通过下标识别事件
    const event: { [k: number]: voidFun } = [newFile, newFolder, collapseAll];
    event[d] && event[d]();
  }

  /**
   * 新建文件/文件夹，需要对数据进行操作
   * @param isFolder
   */
  async function addNewItem(isFolder: boolean) {
    newFileFlag.value = !isFolder;
    const data: ITreeDataIsNew = {
      id: `${new Date().getTime()}`,
      isNew: true,
      isFolder,
    };
    // 1. 定位当前的 key 在key下添加 ITreeDataIsNew 数据
    if (currentNodeKey.value) {
      // 如果有节点被选中，则看是文件，还是文件夹，是文件-在父级添加，是文件夹-直接在当前添加
      const currentNode = treeRef.value?.getNode(currentNodeKey.value);
      if (currentNode?.data.isFolder) {
        // 如果是文件夹，则在当前节点下添加
        treeRef.value?.append(data, currentNodeKey.value);
      } else {
        // 如果是文件，则在 Tree 中给定节点后插入一个节点
        treeRef.value?.insertAfter(data, currentNodeKey.value);
      }
    } else {
      // 如果没有节点被选中，则直接添加到根目录
      dataSource.push(data);
    }
    // 2. 然后获取焦点
    await nextTick();
    newFileRef.value?.focus();
  }
  // 删除isNew 节点，确保整个过程只有一个新建节点
  function removeNewItem(data?: ITreeData) {
    const list = data || dataSource;
    list.forEach((item, index) => {
      if (Object.hasOwn(item, "isNew")) {
        delete list[index];
      }
      if (Object.hasOwn(item, "children"))
        removeNewItem((item as ITreeDataFolder).children);
    });
  }
  // 新建文件
  async function newFile() {
    expandCurrentNode();
    await nextTick();
    addNewItem(false);
  }
  // 新建文件夹
  async function newFolder() {
    expandCurrentNode();
    await nextTick();
    addNewItem(true);
  }
  // 折叠所有文件
  function collapseAll() {
    // 全部展开 - 可用于定位某个文件
    // Object.values(treeRef.value!.store.nodesMap).forEach((v) => v.expand())
    Object.values(treeRef.value!.store.nodesMap).forEach((v) => v.collapse());
  }
  // 展开当前节点
  function expandCurrentNode() {
    const currentNode = treeRef.value?.getNode(currentNodeKey.value);
    currentNode?.expand();
  }

  /**
   * 节点点击回调 - 通过该参数实现识别当前的目录层级
   * @param data
   */
  function nodeClick(data: ITree) {
    removeNewItem(dataSource);
    newFileName.value = "";
    currentNodeKey.value = data.id;
  }

  /**
   * cancelChecked 点击树外部，需要取消所有的选中
   */
  function cancelChecked() {
    removeNewItem(dataSource);
    newFileName.value = "";
    //  .is-current 通过该类实现的当前文件激活样式
    currentNodeKey.value = "";
    treeRef.value?.setCurrentKey();
  }

  function newFileEnter() {
    newFileRef.value?.blur();
  }

  /**
   * confirm 新建文件/文件夹确认事件
   */
  function confirm() {
    removeNewItem(dataSource);
    if (!newFileName.value) return;
    // 不然，就根据当前位置，push 真实的数据到dataTree中，通过 newFileFlag.value 识别是文件还是文件夹
    const fileSuffix = newFileName.value.split(".")[1];
    const data: ITreeDataFile | ITreeDataFolder = {
      id: `${new Date().getTime()}`,
      label: newFileName.value,
      isFolder: !newFileFlag.value,
      children: [],
      icon: newFileFlag.value ? getFileIcon(fileSuffix) : "",
    };
    if (currentNodeKey.value) {
      // 如果有节点被选中，则看是文件，还是文件夹，是文件-在父级添加，是文件夹-直接在当前添加
      const currentNode = treeRef.value?.getNode(currentNodeKey.value);
      if (currentNode?.data.isFolder) {
        // 如果是文件夹，则在当前节点下添加
        treeRef.value?.append(data, currentNodeKey.value);
      } else {
        // 如果是文件，则在 Tree 中给定节点后插入一个节点
        treeRef.value?.insertAfter(data, currentNodeKey.value);
      }
    } else {
      // 如果没有节点被选中，则直接添加到根目录
      dataSource.push(data);
    }
  }

  /**
   * 初始化 Vue 项目
   *  1. 将 mock 数据源处理后赋值给 dataSource
   *  2. 挂载 filetree
   */
  async function initVue() {
    const data = JSON.parse(JSON.stringify(mock.vueProject));
    containerStore.setFileTree(data);
    // 解析当前data 转成数组
    const list = await containerStore.getDirectory();
    dataSource.length = 0;
    dataSource.push(...list);
  }

  return {
    newFileRef,
    newFileName,
    treeRef,
    icons,
    dataSource,
    currentNodeKey,
    iconClick,
    nodeClick,
    cancelChecked,
    confirm,
    newFileEnter,
    initVue,
  };
};
