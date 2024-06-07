import { nextTick, reactive, ref, watch } from "vue";
import { ITreeData, ITree } from "../type/fileMenu";
import { TFullData, ITreeDataFile } from "../type/fileMenu";
import {
  getFullPath,
  tryCatch,
  getNewFileMockData,
  getNewFileData,
} from "../utils";
import type { ElTree } from "element-plus";
import { TFileMenu } from "../type";
import { mock } from "../mock";
import { useContainerStore } from "../pinia/useContainer";
import { useMonacoStore } from "../pinia/useMonaco";
import { useFileMenuStore } from "../pinia/useFileMenu";

export const useFileMenu = () => {
  // 数据仓库
  // 数据仓库
  // 数据仓库
  const containerStore = useContainerStore();
  const monacoStore = useMonacoStore();
  const fileMenuStore = useFileMenuStore();

  /**
   * 定义树节点Ref -  InstanceType 处理 ElTree 页面dom 问题
   *  需要利用 ref 执行树的方法
   *  append 添加节点
   *  getNodeValue 获取节点数据
   */
  const treeRef = ref<InstanceType<typeof ElTree> | null>(null);

  /** 当前选中的节点 */
  const currentNodeKey = ref<string | number>("");

  /** 新建文件的 input 输入框 v-model 的值 */
  const newFileName = ref("");

  /** input ref 新建文件/文件夹的输入框 Ref */
  const newInputRef = ref<HTMLInputElement | null>(null);

  /** 新建文件标志 true ：文件  false ：文件夹 */
  const newFileFlag = ref(false);

  /** data tree 数据源 */
  const dataSource = reactive<ITreeData>([]);

  /** 定义 popover ref List */
  const popoverRefList = reactive<HTMLElement[]>([]);

  /** 定义文件右键菜单列表 */
  const contextmenu: TFileMenu[] = [
    {
      label: "在侧边打开",
      shortcut: "Ctrl + O",
      ctrlKey: true,
      keyCode: 79,
      callback: openFile,
    },
    {
      label: "打开时间线",
      ctrlKey: null,
      keyCode: null,
      callback: openTimeLine,
    },
    {
      label: "重命名",
      shortcut: "F2",
      ctrlKey: false,
      keyCode: 113,
      callback: renameFile,
    },
    {
      label: "删除",
      ctrlKey: false,
      keyCode: 46,
      shortcut: "Delete",
      callback: deleteFile,
    },
  ];

  /**
   * Watch 监听 dataSource 数据变化
   *  1. 监听 dataSource 数据变化，将数据同步到 pinia 中
   *  2. 监听 Container booted 事件，初始化 vue 项目
   */
  watch(
    () => dataSource,
    () => fileMenuStore.setDataSource(dataSource as ITreeData),
    {
      immediate: true,
      deep: true,
    }
  );
  watch(
    () => containerStore.boot,
    () => initVueProject(),
    { immediate: false }
  );

  /**
   * 文件列表顶部菜单点击事件
   * @param d 索引
   */
  async function menuClick(d: number) {
    // 1. 先清空目前存在的输入框
    removeNewItem(dataSource);
    // 2. 重置输入框内容
    newFileName.value = "";
    // 3. 展开当前节点
    expandCurrentNode();
    // 4. 等待页面渲染 - 这里的等待是为了等待目录展开，不然接下来的新建文件是获取不了焦点的
    await nextTick();
    // 5. 判断icon类型，执行不同的操作
    const nodeMap = treeRef.value!.store.nodesMap;
    switch (d) {
      case 0:
        // 新建文件
        appendNewItem(false);
        break;

      case 1:
        // 新建文件夹
        appendNewItem(true);
        break;

      case 2:
        // 折叠文件
        Object.values(nodeMap).forEach((v) => v.collapse());
        // 全部展开 - 可用于定位某个文件
        // Object.values(nodeMap).forEach((v) => v.expand())
        break;
    }
  }

  /**
   * 新建文件/文件夹，==> 其实是需要将文件名称输入框显示到页面上，也就是需要添加 isNew 属性
   * @param { boolean } isFolder 是否为文件夹
   */
  async function appendNewItem(isFolder: boolean) {
    // 将文件/文件夹的类型 isFolder 记录下来，在 container 中有用
    newFileFlag.value = !isFolder;

    // 获取mock data
    const data = getNewFileMockData(isFolder);

    // 插入合适位置
    insertNewData(data);

    // 2. 然后获取焦点
    await nextTick();
    newInputRef.value?.focus();
  }

  /**
   * 辅助函数 - 传入数据，通过条件判断该数据该插入什么位置
   */
  function insertNewData(data: ITree) {
    // 1. 定位当前的 key 在key下添加 ITreeDataIsNew 数据
    if (currentNodeKey.value) {
      // 如果有节点被选中，则看是文件，还是文件夹，是文件-在父级添加，是文件夹-直接在当前文件夹添加
      const currentNode = treeRef.value?.getNode(currentNodeKey.value);
      currentNode?.data.isFolder
        ? treeRef.value?.append(data, currentNodeKey.value)
        : treeRef.value?.insertAfter(data, currentNodeKey.value);
      // 如果没有节点被选中，则直接添加到根目录
    } else dataSource.push(data);
  }

  /**
   * 删除 isNew 节点，确保整个过程只有一个新建节点
   * @param data 需要递归的数据源
   */
  function removeNewItem(data: ITreeData) {
    data.forEach((item, index) => {
      if (Object.hasOwn(item, "isNew")) data.splice(index, 1);
      // eslint-disable-next-line
      // @ts-ignore 递归
      if (Object.hasOwn(item, "children")) removeNewItem(item.children);
    });
  }

  /**
   * 展开当前节点 - 用于目录关闭状态下，新建文件时能够自己展开
   */
  function expandCurrentNode() {
    const currentNode = treeRef.value?.getNode(currentNodeKey.value);
    currentNode?.expand();
  }

  /**
   * 节点点击回调 - 通过该参数实现识别当前的目录层级
   * 如果点击的是文件，则需要在monaco编辑器中打开文件
   * @param data
   */
  function treeNodeClick(data: ITree) {
    removeNewItem(dataSource);
    newFileName.value = "";
    currentNodeKey.value = data.id;
    if (!data.isFolder) monacoStore.openFile(data as ITreeDataFile);
  }

  /**
   * cancelChecked 点击树外部，需要取消所有的选中
   */
  function cancelChecked() {
    removeNewItem(dataSource);
    newFileName.value = "";
    currentNodeKey.value = "";
    treeRef.value?.setCurrentKey();
  }

  /**
   * 回车/确定按钮/失焦 触发的确认事件回调
   */
  async function confirm() {
    removeNewItem(dataSource);
    // 如果没有输入，则直接返回
    if (!newFileName.value) return;

    const suffix = newFileName.value.split(".")[1];
    //  获取数据
    const data = getNewFileData(!newFileFlag.value, newFileName.value, suffix);

    insertNewData(data);

    await nextTick();
    // 排序
    // const list = sortFile(JSON.parse(JSON.stringify(dataSource)));
    // dataSource.length = 0;
    // list.forEach((i) => dataSource.push(i));

    // 将文件/文件夹添加到container文件系统中
    mountedFileSystemTree();
  }

  /**
   *  将新建的文件/文件夹挂载到Web Container File System Tree 中
   */
  function mountedFileSystemTree() {
    tryCatch(async () => {
      let path = "/";
      // 如果有选中节点，则需要处理选中节点的路径问题
      if (currentNodeKey.value) {
        const currentNode = treeRef.value?.getNode(currentNodeKey.value); // 当前激活节点

        const dataMap = JSON.parse(JSON.stringify(dataSource)) as TFullData;

        let fullpath = <string[]>getFullPath(dataMap, currentNodeKey.value);

        if (currentNode?.data.isFolder) path += fullpath?.join("/");
        else {
          // 删除最后一项
          fullpath = fullpath?.slice(0, -1);
          path += fullpath?.join("/");
        }
        path += "/";
      }

      // 如果没有选中节点，则直接拼接文件名称，放置到根路径下即可
      // 例如 /vite.config.js
      path += newFileName.value;
      newFileFlag.value
        ? containerStore.newFile(path)
        : containerStore.newFolder(path);
    });
  }

  /**
   * 初始化 Vue 项目
   *  1. 将 mock 数据源处理后赋值给 dataSource
   *  2. 挂载 filetree
   */
  async function initVueProject() {
    const data = JSON.parse(JSON.stringify(mock.vueProject));
    await containerStore.setFileTree(data);
    // 解析当前data 转成数组
    const list = await containerStore.getDirectory();
    dataSource.length = 0;
    list.forEach((i) => dataSource.push(i));
  }

  /** popover 右键菜单相关事件 */
  /** 设置 popover Ref */
  const setPopoverRef = (el: HTMLElement) => popoverRefList.push(el);

  // eslint-disable-next-line
  /** @ts-ignore  关闭 poppover */
  const closePopover = () => popoverRefList.forEach((el) => el?.hide());

  /** 在侧边打开 */
  function openFile(data: ITree) {
    console.log("openFile", data);
  }

  /** 打开时间线 */
  function openTimeLine(data: ITree) {
    console.log("openTimeLine", data);
  }

  /** 重命名 */
  function renameFile(data: ITree) {
    console.log("renameFile", data);
  }

  /** 删除 */
  function deleteFile(data: ITree) {
    console.log("deleteFile", data);
  }

  /** 初始化window事件 - 监听快捷菜单 */
  function addWindowEvent() {
    window.addEventListener("keydown", eventHandle);
  }
  function removeWindowEvent() {
    window.removeEventListener("keydown", eventHandle);
  }
  function eventHandle(e: KeyboardEvent) {
    const { ctrlKey, keyCode } = e;

    // 不能用 forEach 进行事件处理，应该找到符合条件的才执行
    const events = contextmenu.find(
      (i) => i.ctrlKey === ctrlKey && i.keyCode === keyCode
    );
    if (!events) return;
    e.stopPropagation();
    e.preventDefault();
    // 获取节点node
    const node = treeRef.value?.getNode(currentNodeKey.value);
    if (!node) return;
    events.callback(node.data as ITree);
  }

  return {
    contextmenu,
    newInputRef,
    newFileName,
    treeRef,
    dataSource,
    currentNodeKey,
    menuClick,
    treeNodeClick,
    cancelChecked,
    confirm,
    initVueProject,
    setPopoverRef,
    closePopover,
    addWindowEvent,
    removeWindowEvent,
  };
};
