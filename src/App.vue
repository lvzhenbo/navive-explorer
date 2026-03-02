<script setup lang="ts">
  import { zhCN, dateZhCN, useOsTheme, darkTheme, lightTheme } from 'naive-ui';
  import { FileExplorer } from '@/components/FileExplorer';

  const osThemeRef = useOsTheme();
  const theme = computed(() => {
    return osThemeRef.value === 'dark' ? darkTheme : lightTheme;
  });
</script>

<template>
  <NConfigProvider :locale="zhCN" :date-locale="dateZhCN" :theme="theme">
    <NLoadingBarProvider>
      <NDialogProvider>
        <NMessageProvider>
          <NNotificationProvider>
            <NEl class="min-h-screen p-6 bg-(--body-color)">
              <div class="max-w-300 mx-auto">
                <h1 class="text-2xl font-bold mb-4 text-(--text-color-1)">云盘文件管理器</h1>
                <FileExplorer initial-path="/" :show-statusbar="true" :height="600" />
              </div>
            </NEl>
          </NNotificationProvider>
        </NMessageProvider>
      </NDialogProvider>
    </NLoadingBarProvider>
  </NConfigProvider>
</template>

<style scoped></style>
