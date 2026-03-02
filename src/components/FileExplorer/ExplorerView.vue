<script setup lang="ts">
  import { NSpin, NEmpty, NScrollbar, NCheckbox } from 'naive-ui';
  import type { FileItem, ViewMode, SortConfig, SortField } from './types';
  import FileItemView from './FileItemView.vue';

  defineProps<{
    items: FileItem[];
    viewMode: ViewMode;
    loading: boolean;
    selectedItems: Set<string>;
    sortConfig: SortConfig;
  }>();

  const emit = defineEmits<{
    clickItem: [item: FileItem, event: MouseEvent];
    dblclickItem: [item: FileItem];
    contextmenuItem: [item: FileItem, event: MouseEvent];
    contextmenuBg: [event: MouseEvent];
    sort: [field: SortField];
    clearSelection: [];
    checkItem: [item: FileItem, event: MouseEvent];
    toggleSelectAll: [];
  }>();

  function isSelected(item: FileItem, selectedItems: Set<string>): boolean {
    return selectedItems.has(item.id);
  }

  // 判断点击是否在文件项上 —— 通过 data-file-item 属性标记
  function handleBgClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target.closest('[data-file-item]')) {
      emit('clearSelection');
    }
  }

  function handleBgContextMenu(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target.closest('[data-file-item]')) {
      emit('contextmenuBg', e);
    }
  }
</script>

<template>
  <div
    class="flex-1 flex flex-col overflow-hidden relative"
    @click="handleBgClick"
    @contextmenu.prevent="handleBgContextMenu"
  >
    <NSpin :show="loading" class="flex-1 overflow-hidden" content-class="h-full">
      <NScrollbar class="h-full">
        <!-- 空状态 -->
        <NEmpty v-if="!loading && items.length === 0" description="当前文件夹为空" class="py-16" />

        <!-- 列表视图表头 -->
        <div
          v-if="viewMode === 'list' && items.length > 0"
          class="flex items-center px-3 py-1.5 text-xs font-medium border-b sticky top-0 z-10 text-(--text-color-3) border-(--border-color) bg-(--table-header-color)"
        >
          <div
            class="w-6 shrink-0 flex items-center justify-center"
            @click.stop="emit('toggleSelectAll')"
          >
            <NCheckbox
              :checked="items.length > 0 && items.every((i) => selectedItems.has(i.id))"
              :indeterminate="
                items.some((i) => selectedItems.has(i.id)) &&
                !items.every((i) => selectedItems.has(i.id))
              "
            />
          </div>
          <div class="w-8 shrink-0" />
          <div
            class="flex-1 min-w-0 ml-2 cursor-pointer select-none hover:text-(--text-color-2)"
            @click.stop="emit('sort', 'name')"
          >
            名称
            <span v-if="sortConfig.field === 'name'" class="ml-1">
              {{ sortConfig.direction === 'asc' ? '↑' : '↓' }}
            </span>
          </div>
          <div
            class="w-24 text-right shrink-0 cursor-pointer select-none hover:text-(--text-color-2)"
            @click.stop="emit('sort', 'size')"
          >
            大小
            <span v-if="sortConfig.field === 'size'" class="ml-1">
              {{ sortConfig.direction === 'asc' ? '↑' : '↓' }}
            </span>
          </div>
          <div
            class="w-40 text-right shrink-0 ml-3 cursor-pointer select-none hover:text-(--text-color-2)"
            @click.stop="emit('sort', 'lastModified')"
          >
            修改日期
            <span v-if="sortConfig.field === 'lastModified'" class="ml-1">
              {{ sortConfig.direction === 'asc' ? '↑' : '↓' }}
            </span>
          </div>
          <div class="w-6 shrink-0 ml-2" />
        </div>

        <!-- 网格视图 -->
        <div
          v-if="viewMode === 'grid' && items.length > 0"
          class="grid gap-1 p-3"
          style="grid-template-columns: repeat(auto-fill, minmax(100px, 1fr))"
        >
          <FileItemView
            v-for="item in items"
            :key="item.id"
            :item="item"
            :selected="isSelected(item, selectedItems)"
            view-mode="grid"
            @click="(_item: FileItem, e: MouseEvent) => emit('clickItem', _item, e)"
            @dblclick="(_item: FileItem) => emit('dblclickItem', _item)"
            @contextmenu="(_item: FileItem, e: MouseEvent) => emit('contextmenuItem', _item, e)"
            @check="(_item: FileItem, e: MouseEvent) => emit('checkItem', _item, e)"
          />
        </div>

        <!-- 列表视图 -->
        <div v-if="viewMode === 'list' && items.length > 0">
          <FileItemView
            v-for="item in items"
            :key="item.id"
            :item="item"
            :selected="isSelected(item, selectedItems)"
            view-mode="list"
            @click="(_item: FileItem, e: MouseEvent) => emit('clickItem', _item, e)"
            @dblclick="(_item: FileItem) => emit('dblclickItem', _item)"
            @contextmenu="(_item: FileItem, e: MouseEvent) => emit('contextmenuItem', _item, e)"
            @check="(_item: FileItem, e: MouseEvent) => emit('checkItem', _item, e)"
          />
        </div>
      </NScrollbar>
    </NSpin>
  </div>
</template>
