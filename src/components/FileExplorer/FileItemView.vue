<script setup lang="ts">
  import { NCheckbox } from 'naive-ui';
  import type { FileItem } from './types';
  import { getFileIcon, formatFileSize, formatDate } from './utils';

  const props = defineProps<{
    item: FileItem;
    selected: boolean;
    viewMode: 'grid' | 'list';
  }>();

  const emit = defineEmits<{
    click: [item: FileItem, event: MouseEvent];
    dblclick: [item: FileItem];
    contextmenu: [item: FileItem, event: MouseEvent];
    check: [item: FileItem, event: MouseEvent];
  }>();

  const icon = computed(() => getFileIcon(props.item));
  const size = computed(() => formatFileSize(props.item.size));
  const date = computed(() => formatDate(props.item.lastModified));

  function handleCheck(e: MouseEvent) {
    e.stopPropagation();
    emit('check', props.item, e);
  }
</script>

<template>
  <!-- 网格视图 -->
  <div
    v-if="viewMode === 'grid'"
    data-file-item
    class="group relative flex flex-col items-center p-3 cursor-pointer transition-all duration-150 select-none rounded-(--border-radius)"
    :class="
      selected
        ? 'bg-(--primary-color)/10 ring-1 ring-inset ring-(--primary-color)/35'
        : 'hover:bg-(--hover-color) active:bg-(--pressed-color)'
    "
    @click.stop="emit('click', item, $event)"
    @dblclick.stop="emit('dblclick', item)"
    @contextmenu.prevent.stop="emit('contextmenu', item, $event)"
  >
    <!-- 复选框 -->
    <div
      class="absolute top-1 left-1 flex items-center transition-opacity"
      :class="selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
      @click.stop="handleCheck"
    >
      <NCheckbox :checked="selected" />
    </div>

    <!-- 缩略图或图标 -->
    <div class="w-16 h-16 flex items-center justify-center mb-2">
      <img
        v-if="item.thumbnail"
        :src="item.thumbnail"
        :alt="item.name"
        class="w-full h-full object-cover rounded-md"
        loading="lazy"
      />
      <span v-else class="text-4xl leading-none">{{ icon }}</span>
    </div>

    <!-- 文件名 -->
    <div class="text-xs text-center w-full truncate px-1" :title="item.name">
      {{ item.name }}
    </div>

    <!-- 只读标记 -->
    <div v-if="item.readonly" class="absolute top-1 right-1 text-[10px] text-(--text-color-3)">
      🔒
    </div>
  </div>

  <!-- 列表视图 -->
  <div
    v-else
    data-file-item
    class="group flex items-center px-3 py-1.5 cursor-pointer transition-colors duration-100 select-none border-b border-(--divider-color)"
    :class="
      selected ? 'bg-(--primary-color)/10' : 'hover:bg-(--hover-color) active:bg-(--pressed-color)'
    "
    @click.stop="emit('click', item, $event)"
    @dblclick.stop="emit('dblclick', item)"
    @contextmenu.prevent.stop="emit('contextmenu', item, $event)"
  >
    <!-- 复选框 -->
    <div
      class="w-6 shrink-0 flex items-center justify-center transition-opacity"
      :class="selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
      @click.stop="handleCheck"
    >
      <NCheckbox :checked="selected" />
    </div>

    <!-- 图标 -->
    <div class="w-8 h-8 flex items-center justify-center shrink-0">
      <img
        v-if="item.thumbnail"
        :src="item.thumbnail"
        :alt="item.name"
        class="w-7 h-7 object-cover rounded"
        loading="lazy"
      />
      <span v-else class="text-xl leading-none">{{ icon }}</span>
    </div>

    <!-- 名称 -->
    <div class="flex-1 min-w-0 ml-2 text-sm truncate" :title="item.name">
      {{ item.name }}
    </div>

    <!-- 大小 -->
    <div class="w-24 text-xs text-right shrink-0 text-(--text-color-3)">
      {{ item.type === 'folder' ? '-' : size }}
    </div>

    <!-- 修改日期 -->
    <div class="w-40 text-xs text-right shrink-0 ml-3 text-(--text-color-3)">
      {{ date }}
    </div>

    <!-- 只读标记 -->
    <div v-if="item.readonly" class="w-6 text-center shrink-0 ml-2">
      <span class="text-[10px] text-(--text-color-3)">🔒</span>
    </div>
  </div>
</template>
