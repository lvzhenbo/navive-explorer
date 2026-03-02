import { ref, computed, watch } from 'vue';
import type { FileItem, ViewMode, SortConfig, SortField, BreadcrumbSegment } from './types';

export function useFileExplorer() {
  // 状态
  const currentPath = ref('/');
  const items = ref<FileItem[]>([]);
  const selectedItems = ref<Set<string>>(new Set());
  const viewMode = ref<ViewMode>('grid');
  const sortConfig = ref<SortConfig>({ field: 'name', direction: 'asc' });
  const searchQuery = ref('');
  const loading = ref(false);
  const clipboardItems = ref<{ items: FileItem[]; action: 'copy' | 'cut' } | null>(null);
  const lastClickedId = ref<string | null>(null);

  // 分页
  const currentPage = ref(1);
  const pageSize = ref(20);

  // 面包屑
  const breadcrumbs = computed<BreadcrumbSegment[]>(() => {
    const segments: BreadcrumbSegment[] = [{ label: '根目录', path: '/' }];
    if (currentPath.value === '/') return segments;

    const parts = currentPath.value.split('/').filter(Boolean);
    let accumulated = '';
    for (const part of parts) {
      accumulated += '/' + part;
      segments.push({ label: part, path: accumulated });
    }
    return segments;
  });

  // 排序 & 过滤后的列表
  const filteredAndSortedItems = computed(() => {
    let result = [...items.value];

    // 搜索过滤
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      result = result.filter((item) => item.name.toLowerCase().includes(q));
    }

    // 排序：文件夹始终在前
    result.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }
      const { field, direction } = sortConfig.value;
      const dir = direction === 'asc' ? 1 : -1;

      switch (field) {
        case 'name':
          return dir * a.name.localeCompare(b.name, 'zh-CN');
        case 'size':
          return dir * ((a.size || 0) - (b.size || 0));
        case 'lastModified': {
          const ta = a.lastModified ? new Date(a.lastModified).getTime() : 0;
          const tb = b.lastModified ? new Date(b.lastModified).getTime() : 0;
          return dir * (ta - tb);
        }
        case 'type':
          return dir * (a.extension || '').localeCompare(b.extension || '');
        default:
          return 0;
      }
    });

    return result;
  });

  // 分页计算
  const totalCount = computed(() => filteredAndSortedItems.value.length);
  const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pageSize.value)));
  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return filteredAndSortedItems.value.slice(start, start + pageSize.value);
  });

  // 选中计数
  const selectedCount = computed(() => selectedItems.value.size);
  const folderCount = computed(
    () => filteredAndSortedItems.value.filter((i) => i.type === 'folder').length,
  );
  const fileCount = computed(
    () => filteredAndSortedItems.value.filter((i) => i.type === 'file').length,
  );

  // 导航
  function navigateTo(path: string) {
    if (path === currentPath.value) return;
    currentPath.value = path;
    currentPage.value = 1;
    selectedItems.value.clear();
    searchQuery.value = '';
  }

  function goUp() {
    if (currentPath.value === '/') return;
    const parts = currentPath.value.split('/').filter(Boolean);
    parts.pop();
    navigateTo(parts.length === 0 ? '/' : '/' + parts.join('/'));
  }

  const canGoUp = computed(() => currentPath.value !== '/');

  // 分页操作
  function setPage(page: number) {
    currentPage.value = Math.max(1, Math.min(page, totalPages.value));
    clearSelection();
  }

  function setPageSize(size: number) {
    pageSize.value = size;
    currentPage.value = 1;
    clearSelection();
  }

  // 搜索时重置分页
  watch(searchQuery, () => {
    currentPage.value = 1;
  });

  // 选择
  function toggleSelect(item: FileItem, multi = false) {
    if (multi) {
      // Ctrl/复选框：切换单项
      if (selectedItems.value.has(item.id)) {
        selectedItems.value.delete(item.id);
      } else {
        selectedItems.value.add(item.id);
      }
      lastClickedId.value = item.id;
    } else {
      const wasOnlySelected = selectedItems.value.has(item.id) && selectedItems.value.size === 1;
      selectedItems.value.clear();
      if (!wasOnlySelected) {
        selectedItems.value.add(item.id);
        lastClickedId.value = item.id;
      } else {
        // 取消选中 → 清除锚点
        lastClickedId.value = null;
      }
    }
    // 触发响应式更新
    selectedItems.value = new Set(selectedItems.value);
  }

  // Shift+Click 范围选择，additive=true 时追加到现有选中（Ctrl+Shift）
  function rangeSelect(item: FileItem, additive = false) {
    const list = filteredAndSortedItems.value;
    const currentIndex = list.findIndex((i) => i.id === item.id);
    const anchorIndex = lastClickedId.value
      ? list.findIndex((i) => i.id === lastClickedId.value)
      : -1;

    if (anchorIndex === -1 || currentIndex === -1) {
      // 没有锚点时退化为普通选择
      toggleSelect(item, additive);
      return;
    }

    const start = Math.min(anchorIndex, currentIndex);
    const end = Math.max(anchorIndex, currentIndex);
    const rangeIds = list.slice(start, end + 1).map((i) => i.id);
    if (additive) {
      // Ctrl+Shift：追加范围到现有选中
      const merged = new Set(selectedItems.value);
      for (const id of rangeIds) merged.add(id);
      selectedItems.value = merged;
    } else {
      selectedItems.value = new Set(rangeIds);
    }
    // 不更新 lastClickedId，保持锚点不变，方便连续 Shift+Click 调整范围
  }

  function selectAll() {
    selectedItems.value = new Set(filteredAndSortedItems.value.map((i) => i.id));
  }

  function clearSelection() {
    selectedItems.value = new Set();
    lastClickedId.value = null;
  }

  function isSelected(item: FileItem): boolean {
    return selectedItems.value.has(item.id);
  }

  // 排序
  function setSort(field: SortField) {
    if (sortConfig.value.field === field) {
      sortConfig.value = {
        field,
        direction: sortConfig.value.direction === 'asc' ? 'desc' : 'asc',
      };
    } else {
      sortConfig.value = { field, direction: 'asc' };
    }
  }

  // 视图
  function toggleViewMode() {
    viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid';
  }

  // 剪贴板
  function copyItems(itemsToCopy: FileItem[]) {
    clipboardItems.value = { items: [...itemsToCopy], action: 'copy' };
  }

  function cutItems(itemsToCut: FileItem[]) {
    clipboardItems.value = { items: [...itemsToCut], action: 'cut' };
  }

  return {
    // 状态
    currentPath,
    items,
    selectedItems,
    viewMode,
    sortConfig,
    searchQuery,
    loading,
    clipboardItems,

    // 计算属性
    breadcrumbs,
    filteredAndSortedItems,
    paginatedItems,
    selectedCount,
    totalCount,
    totalPages,
    folderCount,
    fileCount,
    canGoUp,
    currentPage,
    pageSize,

    // 方法
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
    setPage,
    setPageSize,
  };
}
