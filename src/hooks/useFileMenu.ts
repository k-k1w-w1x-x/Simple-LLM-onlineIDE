import { nextTick, reactive, ref, watch } from "vue";
import {
  ITreeData,
  ITree,
  ITreeDataIsNew,
  ITreeDataFolder,
  TFullData,
  ITreeDataFile,
} from "../type/fileMenu";
import { getFullPath, getFileIcon, tryCatch } from "../utils";
import type { ElTree } from "element-plus";
import { TKeyMap, voidFun } from "../type";
import { mock } from "../mock";
import { useContainerStore } from "../pinia/useContainer";
import { useMonacoStore } from "../pinia/useMonaco";
import { useFileMenuStore } from "../pinia/useFileMenu";
export const useFileMenu = () => {
  // 数据仓库
  const containerStore = useContainerStore();
  const monacoStore = useMonacoStore();
  const fileMenuStore = useFileMenuStore();
  // 定义树节点 Ref -  InstanceType 处理 ElTree 页面dom 问题
  const treeRef = ref<InstanceType<typeof ElTree> | null>(null);

  //   当前选中的节点
  const currentNodeKey = ref<string | number>("");

  // 新建文件的 input v-model
  const newFileName = ref("");

  // input ref 新建文件/文件夹的输入框 Ref
  const newInputRef = ref<HTMLInputElement | null>(null);

  // 新建文件标志 true ：文件  false ：文件夹
  const newFileFlag = ref(false);

  // 定义顶部icon - 静态
  const icons = [
    "icon-xinjianwenjian",
    "icon-xinjianwenjianjia",
    "icon-zidongliuchengxiafaliebiao",
  ];

  // data tree 数据源
  const dataSource = reactive<ITreeData>([]);

  // 数据同步
  watch(
    () => dataSource,
    () => fileMenuStore.setDataSource(dataSource as ITreeData),
    {
      immediate: true,
      deep: true,
    }
  );

  /**
   * 文件列表顶部菜单点击事件
   * @param d 索引
   */
  function menuClick(d: number) {
    // 先清空所有添加的
    removeNewItem();
    newFileName.value = "";
    // 通过下标识别事件
    const event: TKeyMap<number, voidFun> = [
      newFile,
      newFolder,
      collapseAll,
      deleteNode,
      renameItem,
    ];
    event[d] && event[d]();
  }

  /**
   * 新建文件/文件夹，需要添加 isNew 属性
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
    newInputRef.value?.focus();
  }

  // 删除 isNew 节点，确保整个过程只有一个新建节点
  function removeNewItem(data?: ITreeData) {
    const list = data || dataSource;
    list.forEach((item, index) => {
      if (Object.hasOwn(item, "isNew")) list.splice(index, 1);
      if (Object.hasOwn(item, "children"))
        removeNewItem(
          (item as ITreeDataFolder).children as unknown as ITreeData
        );
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
  // 删除文件/文件夹
  function deleteNode() {}
  // 重命名
  function renameItem() {}

  /**
   * 节点点击回调 - 通过该参数实现识别当前的目录层级
   * @param data
   */
  function nodeClick(data: ITree) {
    removeNewItem(dataSource);
    newFileName.value = "";
    currentNodeKey.value = data.id;
    if (!data.isFolder) monacoStore.addFile(data as ITreeDataFile);
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
   * newFileEnter 新建文件/文件夹回车事件
   */
  function newFileEnter() {
    newInputRef.value?.blur();
  }

  /**
   * 回车/确定按钮/失焦 触发的确认事件回调
   */
  function confirm() {
    removeNewItem(dataSource);
    if (!newFileName.value) return;
    tryCatch(() => {
      // 不然，就根据当前位置，push 真实的数据到dataTree中，通过 newFileFlag.value 识别是文件还是文件夹
      const fileSuffix = newFileName.value.split(".")[1];
      // 定义数据
      const data = {
        id: `${new Date().getTime()}`,
        label: newFileName.value,
        isFolder: !newFileFlag.value,
        children: [],
        icon: newFileFlag.value ? getFileIcon(fileSuffix) : "",
      };
      if (currentNodeKey.value) {
        /**
         * 如果有节点被选中，则看是文件，还是文件夹，是文件-在父级添加，是文件夹-直接在当前添加
         * 如果是文件夹，则在当前节点下添加
         * 如果是文件，则在 Tree 中选中节点后插入一个节点
         */
        const currentNode = treeRef.value?.getNode(currentNodeKey.value);
        currentNode?.data.isFolder
          ? treeRef.value?.append(data, currentNodeKey.value)
          : treeRef.value?.insertAfter(data, currentNodeKey.value);
      }
      // 如果没有节点被选中，则直接添加到根目录
      else dataSource.push(data);
    });
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
        // 需要在这里加上父级 - 这里还需要判断激活的是文件还是文件夹
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
      console.log("### path ==> ", path);
      newFileFlag.value
        ? containerStore.addFile(path)
        : containerStore.addFolder(path);
    });
  }

  /**
   * 初始化 Vue 项目
   *  1. 将 mock 数据源处理后赋值给 dataSource
   *  2. 挂载 filetree
   */
  async function initVueProject() {
    console.log("initVueProject");
    const data = JSON.parse(JSON.stringify(mock.vueProject));
    await containerStore.setFileTree(data);
    // 解析当前data 转成数组
    const list = await containerStore.getDirectory();
    dataSource.length = 0;
    list.forEach((i) => dataSource.push(i));
  }

  return {
    newInputRef,
    newFileName,
    treeRef,
    icons,
    dataSource,
    currentNodeKey,
    menuClick,
    nodeClick,
    cancelChecked,
    confirm,
    newFileEnter,
    initVueProject,
  };
};
