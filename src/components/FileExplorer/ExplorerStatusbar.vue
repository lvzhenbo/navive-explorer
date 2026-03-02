<script setup lang="ts">
  import { NPagination } from 'naive-ui';

  defineProps<{
    totalCount: number;
    folderCount: number;
    fileCount: number;
    selectedCount: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
  }>();

  const emit = defineEmits<{
    'update:currentPage': [page: number];
    'update:pageSize': [size: number];
  }>();
</script>

<template>
  <div
    class="flex items-center justify-between px-3 py-1 text-xs border-t shrink-0 text-(--text-color-3) border-(--border-color) bg-(--action-color)"
  >
    <div class="flex items-center gap-3">
      <span>{{ totalCount }} 项</span>
      <span v-if="folderCount > 0">{{ folderCount }} 个文件夹</span>
      <span v-if="fileCount > 0">{{ fileCount }} 个文件</span>
      <span v-if="selectedCount > 0" class="text-(--primary-color)">
        已选择 {{ selectedCount }} 项
      </span>
    </div>
    <div class="flex items-center gap-2">
      <NPagination
        :page="currentPage"
        :page-count="totalPages"
        :page-size="pageSize"
        :page-sizes="[20, 50, 100, 200]"
        size="small"
        show-size-picker
        :page-slot="5"
        @update:page="emit('update:currentPage', $event)"
        @update:page-size="emit('update:pageSize', $event)"
      />
    </div>
  </div>
</template>
