<script setup lang="ts">
  import type { FileItem } from './types';
  import { useFileExplorer } from './useFileExplorer';
  import { fetchFiles } from './mockData';
  import ExplorerToolbar from './ExplorerToolbar.vue';
  import ExplorerBreadcrumb from './ExplorerBreadcrumb.vue';
  import ExplorerView from './ExplorerView.vue';
  import ExplorerContextMenu from './ExplorerContextMenu.vue';
  import ExplorerStatusbar from './ExplorerStatusbar.vue';

  const props = withDefaults(
    defineProps<{
      initialPath?: string;
      showStatusbar?: boolean;
      multiSelect?: boolean;
      readonly?: boolean;
      height?: string | number;
    }>(),
    {
      initialPath: '/',
      showStatusbar: true,
      multiSelect: true,
      readonly: false,
      height: 560,
    },
  );

  const emit = defineEmits<{
    open: [item: FileItem];
    select: [items: FileItem[]];
    delete: [items: FileItem[]];
    rename: [item: FileItem, newName: string];
    navigate: [path: string];
  }>();

  const message = useMessage();
  const dialog = useDialog();

  const {
    currentPath,
    items,
    selectedItems,
    viewMode,
    sortConfig,
    searchQuery,
    loading,
    breadcrumbs,
    paginatedItems,
    selectedCount,
    totalCount,
    totalPages,
    folderCount,
    fileCount,
    canGoUp,
    currentPage,
    pageSize,
    navigateTo,
    goUp,
    toggleSelect,
    rangeSelect,
    selectAll,
    clearSelection,
    isSelected,
    setSort,
    toggleViewMode,
    copyItems,
    cutItems,
    clipboardItems,
    setPage,
    setPageSize,
  } = useFileExplorer();

  // 右键菜单状态
  const contextMenu = ref({
    visible: false,
    x: 0,
    y: 0,
    targetItem: null as FileItem | null,
  });

  // 重命名状态
  const renameDialogVisible = ref(false);
  const renameTarget = ref<FileItem | null>(null);
  const renameNewName = ref('');

  // 加载目录
  async function loadDirectory(path: string) {
    loading.value = true;
    try {
      const result = await fetchFiles(path);
      items.value = result;
    } catch {
      message.error('加载文件列表失败');
    } finally {
      loading.value = false;
    }
  }

  // 监听路径变化
  watch(currentPath, (newPath) => {
    loadDirectory(newPath);
    emit('navigate', newPath);
  });

  // 初始加载
  onMounted(() => {
    if (props.initialPath) {
      currentPath.value = props.initialPath;
    }
    loadDirectory(currentPath.value);
  });

  // 处理文件/文件夹点击
  function handleItemClick(item: FileItem, event: MouseEvent) {
    if (event.shiftKey) {
      rangeSelect(item, event.ctrlKey || event.metaKey);
    } else {
      toggleSelect(item, event.ctrlKey || event.metaKey);
    }
  }

  // 复选框勾选
  function handleCheckItem(item: FileItem, event: MouseEvent) {
    if (event.shiftKey) {
      rangeSelect(item, true);
    } else {
      toggleSelect(item, true);
    }
  }

  // 全选/取消全选切换
  function handleToggleSelectAll() {
    const allChecked =
      paginatedItems.value.length > 0 &&
      paginatedItems.value.every((i) => selectedItems.value.has(i.id));
    if (allChecked) {
      clearSelection();
    } else {
      selectAll();
    }
  }

  // 处理双击
  function handleItemDblClick(item: FileItem) {
    if (item.type === 'folder') {
      const path = item.path === '/' ? `/${item.name}` : `${item.path}/${item.name}`;
      navigateTo(path);
    } else {
      emit('open', item);
    }
  }

  // 处理右键菜单
  function handleItemContextMenu(item: FileItem, event: MouseEvent) {
    if (!isSelected(item)) {
      toggleSelect(item, false);
    }
    contextMenu.value = {
      visible: true,
      x: event.clientX,
      y: event.clientY,
      targetItem: item,
    };
  }

  function handleBgContextMenu(event: MouseEvent) {
    clearSelection();
    contextMenu.value = {
      visible: true,
      x: event.clientX,
      y: event.clientY,
      targetItem: null,
    };
  }

  function closeContextMenu() {
    contextMenu.value.visible = false;
  }

  // 菜单操作
  function handleOpen() {
    if (contextMenu.value.targetItem) {
      handleItemDblClick(contextMenu.value.targetItem);
    }
  }

  function handleCopy() {
    const selected = getSelectedItems();
    if (selected.length > 0) {
      copyItems(selected);
      message.success(`已复制 ${selected.length} 个项目`);
    }
  }

  function handleCut() {
    const selected = getSelectedItems();
    if (selected.length > 0) {
      cutItems(selected);
      message.success(`已剪切 ${selected.length} 个项目`);
    }
  }

  function handlePaste() {
    if (clipboardItems.value) {
      message.info(`粘贴 ${clipboardItems.value.items.length} 个项目到 ${currentPath.value}`);
      clipboardItems.value = null;
    }
  }

  function handleDelete() {
    const selected = getSelectedItems();
    if (selected.length === 0) return;
    dialog.warning({
      title: '确认删除',
      content: `确定要删除 ${selected.length} 个项目吗？此操作不可撤销。`,
      positiveText: '删除',
      negativeText: '取消',
      onPositiveClick: () => {
        items.value = items.value.filter((i) => !selectedItems.value.has(i.id));
        clearSelection();
        message.success('删除成功');
        emit('delete', selected);
      },
    });
  }

  function handleRename() {
    if (contextMenu.value.targetItem) {
      renameTarget.value = contextMenu.value.targetItem;
      renameNewName.value = contextMenu.value.targetItem.name;
      renameDialogVisible.value = true;
    }
  }

  function submitRename() {
    if (renameTarget.value && renameNewName.value.trim()) {
      const oldItem = renameTarget.value;
      const idx = items.value.findIndex((i) => i.id === oldItem.id);
      if (idx !== -1) {
        items.value[idx] = { ...items.value[idx], name: renameNewName.value.trim() };
      }
      message.success('重命名成功');
      emit('rename', oldItem, renameNewName.value.trim());
      renameDialogVisible.value = false;
    }
  }

  function handleDownload() {
    const selected = getSelectedItems();
    if (selected.length > 0) {
      message.info(`开始下载 ${selected.length} 个项目`);
    }
  }

  function handleInfo() {
    if (contextMenu.value.targetItem) {
      message.info(`文件: ${contextMenu.value.targetItem.name}`);
    }
  }

  function handleNewFolder() {
    dialog.create({
      title: '新建文件夹',
      content: () =>
        h('div', { class: 'pt-2' }, [
          h(resolveComponent('NInput') as any, {
            placeholder: '请输入文件夹名称',
            defaultValue: '新建文件夹',
            onUpdateValue: (v: string) => {
              (dialog as any).__newFolderName = v;
            },
          }),
        ]),
      positiveText: '创建',
      negativeText: '取消',
      onPositiveClick: () => {
        const name = (dialog as any).__newFolderName || '新建文件夹';
        const newFolder: FileItem = {
          id: `folder-${Date.now()}`,
          name,
          type: 'folder',
          path: currentPath.value,
          lastModified: new Date().toISOString(),
        };
        items.value = [...items.value, newFolder];
        message.success(`文件夹 "${name}" 创建成功`);
      },
    });
  }

  function handleUpload() {
    message.info('上传功能演示 - 实际使用请对接后端 API');
  }

  // 辅助方法
  function getSelectedItems(): FileItem[] {
    return items.value.filter((i) => selectedItems.value.has(i.id));
  }

  // 容器高度样式
  const containerStyle = computed(() => ({
    height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  }));

  // 键盘快捷键
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      selectAll();
    }
    if (e.key === 'Delete') {
      handleDelete();
    }
    if (e.key === 'F5') {
      e.preventDefault();
      loadDirectory(currentPath.value);
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown);
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
  });
</script>

<template>
  <NEl
    class="flex flex-col rounded-(--border-radius) border overflow-hidden shadow-sm bg-(--card-color) border-(--border-color) text-(--text-color-2)"
    :style="containerStyle"
  >
    <!-- 工具栏 -->
    <ExplorerToolbar
      :can-go-up="canGoUp"
      :view-mode="viewMode"
      :search-query="searchQuery"
      :loading="loading"
      @up="goUp"
      @refresh="loadDirectory(currentPath)"
      @toggle-view="toggleViewMode"
      @update:search-query="searchQuery = $event"
      @new-folder="handleNewFolder"
      @upload="handleUpload"
    />

    <!-- 面包屑 -->
    <ExplorerBreadcrumb :segments="breadcrumbs" :loading="loading" @navigate="navigateTo" />

    <!-- 主区域 -->
    <div class="flex flex-1 overflow-hidden min-h-0">
      <!-- 文件列表 -->
      <ExplorerView
        :items="paginatedItems"
        :view-mode="viewMode"
        :loading="loading"
        :selected-items="selectedItems"
        :sort-config="sortConfig"
        @click-item="handleItemClick"
        @dblclick-item="handleItemDblClick"
        @contextmenu-item="handleItemContextMenu"
        @contextmenu-bg="handleBgContextMenu"
        @sort="setSort"
        @clear-selection="clearSelection"
        @check-item="handleCheckItem"
        @toggle-select-all="handleToggleSelectAll"
      />
    </div>

    <!-- 状态栏 -->
    <ExplorerStatusbar
      v-if="showStatusbar"
      :total-count="totalCount"
      :folder-count="folderCount"
      :file-count="fileCount"
      :selected-count="selectedCount"
      :current-page="currentPage"
      :total-pages="totalPages"
      :page-size="pageSize"
      @update:current-page="setPage"
      @update:page-size="setPageSize"
    />

    <!-- 右键菜单 -->
    <ExplorerContextMenu
      :visible="contextMenu.visible"
      :x="contextMenu.x"
      :y="contextMenu.y"
      :target-item="contextMenu.targetItem"
      :has-selection="selectedCount > 0"
      :readonly="readonly"
      @close="closeContextMenu"
      @open="handleOpen"
      @copy="handleCopy"
      @cut="handleCut"
      @paste="handlePaste"
      @delete="handleDelete"
      @rename="handleRename"
      @download="handleDownload"
      @info="handleInfo"
      @new-folder="handleNewFolder"
      @select-all="selectAll"
    />

    <!-- 重命名对话框 -->
    <NModal
      v-model:show="renameDialogVisible"
      preset="dialog"
      title="重命名"
      positive-text="确定"
      negative-text="取消"
      @positive-click="submitRename"
    >
      <NInput
        v-model:value="renameNewName"
        placeholder="请输入新名称"
        @keydown.enter="submitRename"
      />
    </NModal>
  </NEl>
</template>
