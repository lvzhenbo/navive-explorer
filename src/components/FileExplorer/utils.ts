import type { FileItem } from './types';

// 文件图标映射
const iconMap: Record<string, string> = {
  folder: '📁',
  pdf: '📕',
  doc: '📄',
  docx: '📄',
  xls: '📊',
  xlsx: '📊',
  ppt: '📑',
  pptx: '📑',
  txt: '📝',
  md: '📝',
  jpg: '🖼️',
  jpeg: '🖼️',
  png: '🖼️',
  gif: '🖼️',
  svg: '🖼️',
  webp: '🖼️',
  bmp: '🖼️',
  mp4: '🎬',
  avi: '🎬',
  mov: '🎬',
  mkv: '🎬',
  mp3: '🎵',
  wav: '🎵',
  flac: '🎵',
  ogg: '🎵',
  zip: '📦',
  rar: '📦',
  '7z': '📦',
  tar: '📦',
  gz: '📦',
  js: '⚙️',
  ts: '⚙️',
  vue: '⚙️',
  json: '⚙️',
  html: '🌐',
  css: '🎨',
  py: '🐍',
  java: '☕',
  go: '🔵',
  rs: '🦀',
  gitignore: '🔧',
};

export function getFileIcon(item: FileItem): string {
  if (item.type === 'folder') return iconMap.folder;
  const ext = item.extension?.toLowerCase() || '';
  return iconMap[ext] || '📄';
}

export function formatFileSize(bytes?: number): string {
  if (bytes === undefined || bytes === null) return '-';
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getExtension(filename: string): string {
  const parts = filename.split('.');
  if (parts.length <= 1) return '';
  return parts.pop()?.toLowerCase() || '';
}

export function isImageFile(item: FileItem): boolean {
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'];
  return imageExts.includes(item.extension?.toLowerCase() || '');
}

export function isVideoFile(item: FileItem): boolean {
  const videoExts = ['mp4', 'avi', 'mov', 'mkv', 'webm'];
  return videoExts.includes(item.extension?.toLowerCase() || '');
}

export function isAudioFile(item: FileItem): boolean {
  const audioExts = ['mp3', 'wav', 'flac', 'ogg', 'aac'];
  return audioExts.includes(item.extension?.toLowerCase() || '');
}

export function isTextFile(item: FileItem): boolean {
  const textExts = [
    'txt',
    'md',
    'json',
    'js',
    'ts',
    'vue',
    'html',
    'css',
    'scss',
    'less',
    'xml',
    'yaml',
    'yml',
    'toml',
    'ini',
    'conf',
    'sh',
    'bat',
    'py',
    'java',
    'go',
    'rs',
    'c',
    'cpp',
    'h',
    'gitignore',
    'env',
  ];
  return textExts.includes(item.extension?.toLowerCase() || '');
}
