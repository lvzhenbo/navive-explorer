<script setup lang="ts">
  import { NDropdown } from 'naive-ui';
  import type { DropdownOption } from 'naive-ui';
  import type { FileItem } from './types';

  const props = defineProps<{
    visible: boolean;
    x: number;
    y: number;
    targetItem: FileItem | null;
    hasSelection: boolean;
    readonly: boolean;
  }>();

  const emit = defineEmits<{
    close: [];
    open: [];
    download: [];
    rename: [];
    copy: [];
    cut: [];
    paste: [];
    delete: [];
    newFolder: [];
    selectAll: [];
    info: [];
  }>();

  // 文件/文件夹上右键的菜单项
  const fileMenuOptions = computed<DropdownOption[]>(() => {
    const items: DropdownOption[] = [{ label: '打开', key: 'open', icon: renderIcon('📂') }];

    if (!props.readonly) {
      items.push(
        { type: 'divider', key: 'd1' },
        { label: '复制', key: 'copy', icon: renderIcon('📋') },
        { label: '剪切', key: 'cut', icon: renderIcon('✂️') },
        { label: '重命名', key: 'rename', icon: renderIcon('✏️') },
      );
    }

    items.push(
      { type: 'divider', key: 'd2' },
      { label: '下载', key: 'download', icon: renderIcon('⬇️') },
      { label: '属性', key: 'info', icon: renderIcon('ℹ️') },
    );

    if (!props.readonly) {
      items.push(
        { type: 'divider', key: 'd3' },
        {
          label: '删除',
          key: 'delete',
          icon: renderIcon('🗑️'),
          props: { style: 'color: #e06c75' },
        },
      );
    }

    return items;
  });

  // 空白处右键的菜单项
  const bgMenuOptions = computed<DropdownOption[]>(() => {
    const items: DropdownOption[] = [];

    if (!props.readonly) {
      items.push(
        { label: '新建文件夹', key: 'newFolder', icon: renderIcon('📁') },
        { label: '粘贴', key: 'paste', icon: renderIcon('📋') },
      );
    }

    items.push(
      { type: 'divider', key: 'd1' },
      { label: '全选', key: 'selectAll', icon: renderIcon('☑️') },
    );

    return items;
  });

  const options = computed(() => (props.targetItem ? fileMenuOptions.value : bgMenuOptions.value));

  function renderIcon(emoji: string) {
    return () => h('span', { style: 'font-size: 14px; width: 20px; text-align: center' }, emoji);
  }

  function handleSelect(key: string) {
    const eventMap: Record<string, () => void> = {
      open: () => emit('open'),
      copy: () => emit('copy'),
      cut: () => emit('cut'),
      rename: () => emit('rename'),
      download: () => emit('download'),
      info: () => emit('info'),
      delete: () => emit('delete'),
      newFolder: () => emit('newFolder'),
      paste: () => emit('paste'),
      selectAll: () => emit('selectAll'),
    };
    eventMap[key]?.();
    emit('close');
  }

  function handleClickOutside() {
    emit('close');
  }
</script>

<template>
  <NDropdown
    :show="visible"
    :x="x"
    :y="y"
    :options="options"
    placement="bottom-start"
    trigger="manual"
    @select="handleSelect"
    @clickoutside="handleClickOutside"
  />
</template>
