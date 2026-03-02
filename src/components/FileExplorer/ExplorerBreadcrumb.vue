<script setup lang="ts">
  import { NBreadcrumb, NBreadcrumbItem } from 'naive-ui';
  import type { BreadcrumbSegment } from './types';

  defineProps<{
    segments: BreadcrumbSegment[];
    loading: boolean;
  }>();

  const emit = defineEmits<{
    navigate: [path: string];
  }>();
</script>

<template>
  <div
    class="flex items-center px-3 py-1.5 border-b border-(--border-color) bg-(--action-color) min-h-9"
  >
    <NBreadcrumb>
      <NBreadcrumbItem
        v-for="(seg, idx) in segments"
        :key="seg.path"
        @click="idx < segments.length - 1 && emit('navigate', seg.path)"
      >
        <span
          :class="[
            'text-sm',
            idx < segments.length - 1
              ? 'cursor-pointer hover:text-(--primary-color)'
              : 'font-medium',
          ]"
        >
          <span v-if="idx === 0" class="mr-0.5">
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
              class="inline -mt-0.5"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </span>
          {{ seg.label }}
        </span>
      </NBreadcrumbItem>
    </NBreadcrumb>
  </div>
</template>
