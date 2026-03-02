<script setup lang="ts">
  import { NButton, NButtonGroup, NInput, NTooltip } from 'naive-ui';
  import type { ViewMode } from './types';

  defineProps<{
    canGoUp: boolean;
    viewMode: ViewMode;
    searchQuery: string;
    loading: boolean;
  }>();

  const emit = defineEmits<{
    up: [];
    refresh: [];
    toggleView: [];
    'update:searchQuery': [value: string];
    newFolder: [];
    upload: [];
  }>();
</script>

<template>
  <div class="flex items-center gap-2 px-3 py-2 border-b border-(--border-color) bg-(--card-color)">
    <!-- 导航按钮 -->
    <NTooltip>
      <template #trigger>
        <NButton size="small" :disabled="!canGoUp" quaternary @click="emit('up')">
          <template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </template>
        </NButton>
      </template>
      上级目录
    </NTooltip>

    <div class="w-px h-5 mx-1 bg-(--divider-color)" />

    <!-- 刷新按钮 -->
    <NTooltip>
      <template #trigger>
        <NButton size="small" quaternary @click="emit('refresh')">
          <template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              :class="{ 'animate-spin': loading }"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
            </svg>
          </template>
        </NButton>
      </template>
      刷新
    </NTooltip>

    <!-- 弹性空间 -->
    <div class="flex-1" />

    <!-- 搜索框 -->
    <NInput
      :value="searchQuery"
      size="small"
      placeholder="搜索文件..."
      clearable
      class="max-w-55"
      @update:value="emit('update:searchQuery', $event)"
    >
      <template #prefix>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="opacity-50"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </template>
    </NInput>

    <div class="w-px h-5 mx-1 bg-(--divider-color)" />

    <!-- 新建文件夹 -->
    <NTooltip>
      <template #trigger>
        <NButton size="small" quaternary @click="emit('newFolder')">
          <template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 10v6M9 13h6" />
              <path
                d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
              />
            </svg>
          </template>
        </NButton>
      </template>
      新建文件夹
    </NTooltip>

    <!-- 上传 -->
    <NTooltip>
      <template #trigger>
        <NButton size="small" quaternary @click="emit('upload')">
          <template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
          </template>
        </NButton>
      </template>
      上传文件
    </NTooltip>

    <div class="w-px h-5 mx-1 bg-(--divider-color)" />

    <!-- 视图切换 -->
    <NButtonGroup size="small">
      <NTooltip>
        <template #trigger>
          <NButton
            :type="viewMode === 'grid' ? 'primary' : 'default'"
            quaternary
            @click="viewMode !== 'grid' && emit('toggleView')"
          >
            <template #icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
            </template>
          </NButton>
        </template>
        网格视图
      </NTooltip>

      <NTooltip>
        <template #trigger>
          <NButton
            :type="viewMode === 'list' ? 'primary' : 'default'"
            quaternary
            @click="viewMode !== 'list' && emit('toggleView')"
          >
            <template #icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="8" x2="21" y1="6" y2="6" />
                <line x1="8" x2="21" y1="12" y2="12" />
                <line x1="8" x2="21" y1="18" y2="18" />
                <line x1="3" x2="3.01" y1="6" y2="6" />
                <line x1="3" x2="3.01" y1="12" y2="12" />
                <line x1="3" x2="3.01" y1="18" y2="18" />
              </svg>
            </template>
          </NButton>
        </template>
        列表视图
      </NTooltip>
    </NButtonGroup>
  </div>
</template>
