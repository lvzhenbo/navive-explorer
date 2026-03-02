import type { FileItem } from './types';

// 批量生成根目录文件
function generateRootFiles(): FileItem[] {
  const folders: FileItem[] = [
    { id: '1', name: '文档', type: 'folder', path: '/', lastModified: '2026-02-28T10:30:00Z' },
    { id: '2', name: '图片', type: 'folder', path: '/', lastModified: '2026-02-25T14:20:00Z' },
    { id: '3', name: '视频', type: 'folder', path: '/', lastModified: '2026-02-20T09:00:00Z' },
    { id: '4', name: '音乐', type: 'folder', path: '/', lastModified: '2026-02-15T16:45:00Z' },
    { id: '5', name: '项目', type: 'folder', path: '/', lastModified: '2026-03-01T08:00:00Z' },
    { id: '6', name: '下载', type: 'folder', path: '/', lastModified: '2026-03-02T11:30:00Z' },
    { id: '7', name: '备份', type: 'folder', path: '/', lastModified: '2026-01-20T08:00:00Z' },
    { id: '8', name: '工具', type: 'folder', path: '/', lastModified: '2026-02-10T10:00:00Z' },
    { id: '9', name: '模板', type: 'folder', path: '/', lastModified: '2026-02-05T14:30:00Z' },
    { id: '10', name: '归档', type: 'folder', path: '/', lastModified: '2026-01-15T09:00:00Z' },
  ];

  const fileTemplates: { name: string; ext: string; sizeRange: [number, number] }[] = [
    { name: '项目需求文档', ext: 'docx', sizeRange: [40960, 204800] },
    { name: '接口设计说明', ext: 'pdf', sizeRange: [102400, 1048576] },
    { name: '数据分析报告', ext: 'xlsx', sizeRange: [32768, 524288] },
    { name: '产品原型', ext: 'pptx', sizeRange: [1048576, 5242880] },
    { name: '代码审查记录', ext: 'md', sizeRange: [2048, 16384] },
    { name: '测试用例', ext: 'xlsx', sizeRange: [16384, 65536] },
    { name: '系统架构图', ext: 'png', sizeRange: [524288, 3145728] },
    { name: '部署手册', ext: 'pdf', sizeRange: [204800, 1048576] },
    { name: '用户手册', ext: 'docx', sizeRange: [65536, 524288] },
    { name: '性能测试报告', ext: 'html', sizeRange: [8192, 32768] },
    { name: '数据库设计', ext: 'sql', sizeRange: [4096, 32768] },
    { name: '配置文件', ext: 'json', sizeRange: [256, 4096] },
    { name: '日志文件', ext: 'log', sizeRange: [1048576, 10485760] },
    { name: '操作指南', ext: 'txt', sizeRange: [1024, 8192] },
    { name: '培训资料', ext: 'pptx', sizeRange: [2097152, 10485760] },
    { name: '合同文件', ext: 'pdf', sizeRange: [524288, 2097152] },
    { name: '发票扫描', ext: 'jpg', sizeRange: [1048576, 5242880] },
    { name: '预算表', ext: 'xlsx', sizeRange: [16384, 131072] },
    { name: '备忘录', ext: 'txt', sizeRange: [512, 4096] },
    { name: '脚本文件', ext: 'sh', sizeRange: [256, 8192] },
    { name: '样式表', ext: 'css', sizeRange: [2048, 32768] },
    { name: '组件源码', ext: 'vue', sizeRange: [1024, 16384] },
    { name: '工具函数', ext: 'ts', sizeRange: [512, 8192] },
    { name: '环境变量', ext: 'env', sizeRange: [128, 1024] },
    { name: 'Docker配置', ext: 'yml', sizeRange: [256, 4096] },
    { name: '许可证', ext: 'md', sizeRange: [1024, 4096] },
    { name: '更新日志', ext: 'md', sizeRange: [4096, 32768] },
    { name: '截图记录', ext: 'png', sizeRange: [204800, 2097152] },
    { name: '音频笔记', ext: 'mp3', sizeRange: [1048576, 5242880] },
    { name: '压缩包', ext: 'zip', sizeRange: [10485760, 104857600] },
    { name: '字体文件', ext: 'woff2', sizeRange: [32768, 262144] },
    { name: '图标集', ext: 'svg', sizeRange: [4096, 32768] },
    { name: '数据导出', ext: 'csv', sizeRange: [8192, 524288] },
    { name: '安全审计报告', ext: 'pdf', sizeRange: [131072, 1048576] },
    { name: '运维文档', ext: 'docx', sizeRange: [32768, 262144] },
  ];

  const files: FileItem[] = [];
  let idCounter = 100;

  for (let i = 0; i < fileTemplates.length; i++) {
    const t = fileTemplates[i];
    // 每个模板生成 1-2 个带编号的文件变体
    const variants = i < 20 ? 2 : 1;
    for (let v = 0; v < variants; v++) {
      const suffix = variants > 1 ? `_v${v + 1}` : '';
      const size = t.sizeRange[0] + Math.floor(Math.random() * (t.sizeRange[1] - t.sizeRange[0]));
      const day = String(1 + (idCounter % 28)).padStart(2, '0');
      const hour = String(8 + (idCounter % 12)).padStart(2, '0');
      files.push({
        id: String(idCounter++),
        name: `${t.name}${suffix}.${t.ext}`,
        type: 'file',
        path: '/',
        size,
        extension: t.ext,
        lastModified: `2026-02-${day}T${hour}:${String(idCounter % 60).padStart(2, '0')}:00Z`,
      });
    }
  }

  return [...folders, ...files];
}

const allFiles: Record<string, FileItem[]> = {
  '/': generateRootFiles(),
  '/文档': [
    {
      id: '10',
      name: '工作报告',
      type: 'folder',
      path: '/文档',
      lastModified: '2026-02-28T10:00:00Z',
    },
    {
      id: '11',
      name: '个人笔记',
      type: 'folder',
      path: '/文档',
      lastModified: '2026-02-27T14:00:00Z',
    },
    {
      id: '12',
      name: '年度总结.docx',
      type: 'file',
      path: '/文档',
      size: 45056,
      extension: 'docx',
      lastModified: '2026-02-28T10:30:00Z',
    },
    {
      id: '13',
      name: '项目计划.xlsx',
      type: 'file',
      path: '/文档',
      size: 32768,
      extension: 'xlsx',
      lastModified: '2026-02-26T11:20:00Z',
    },
    {
      id: '14',
      name: '会议纪要.pdf',
      type: 'file',
      path: '/文档',
      size: 1048576,
      extension: 'pdf',
      lastModified: '2026-02-25T16:00:00Z',
    },
    {
      id: '15',
      name: '演示文稿.pptx',
      type: 'file',
      path: '/文档',
      size: 5242880,
      extension: 'pptx',
      lastModified: '2026-02-24T09:15:00Z',
    },
    {
      id: '16',
      name: '备忘录.txt',
      type: 'file',
      path: '/文档',
      size: 256,
      extension: 'txt',
      lastModified: '2026-02-23T08:30:00Z',
    },
  ],
  '/图片': [
    {
      id: '20',
      name: '截图',
      type: 'folder',
      path: '/图片',
      lastModified: '2026-02-28T12:00:00Z',
    },
    {
      id: '21',
      name: '壁纸',
      type: 'folder',
      path: '/图片',
      lastModified: '2026-02-20T10:00:00Z',
    },
    {
      id: '22',
      name: '风景照.jpg',
      type: 'file',
      path: '/图片',
      size: 3145728,
      extension: 'jpg',
      thumbnail: 'https://picsum.photos/seed/landscape/200/200',
      lastModified: '2026-02-27T15:30:00Z',
    },
    {
      id: '23',
      name: '头像.png',
      type: 'file',
      path: '/图片',
      size: 524288,
      extension: 'png',
      thumbnail: 'https://picsum.photos/seed/avatar/200/200',
      lastModified: '2026-02-26T11:00:00Z',
    },
    {
      id: '24',
      name: 'logo.svg',
      type: 'file',
      path: '/图片',
      size: 8192,
      extension: 'svg',
      lastModified: '2026-02-25T09:20:00Z',
    },
    {
      id: '25',
      name: '动画.gif',
      type: 'file',
      path: '/图片',
      size: 2097152,
      extension: 'gif',
      thumbnail: 'https://picsum.photos/seed/animation/200/200',
      lastModified: '2026-02-24T14:40:00Z',
    },
    {
      id: '26',
      name: '产品图.webp',
      type: 'file',
      path: '/图片',
      size: 1572864,
      extension: 'webp',
      thumbnail: 'https://picsum.photos/seed/product/200/200',
      lastModified: '2026-02-23T10:15:00Z',
    },
  ],
  '/视频': [
    {
      id: '30',
      name: '教程视频.mp4',
      type: 'file',
      path: '/视频',
      size: 104857600,
      extension: 'mp4',
      lastModified: '2026-02-20T09:00:00Z',
    },
    {
      id: '31',
      name: '会议录制.mkv',
      type: 'file',
      path: '/视频',
      size: 524288000,
      extension: 'mkv',
      lastModified: '2026-02-18T14:30:00Z',
    },
  ],
  '/音乐': [
    {
      id: '40',
      name: '晨曲.mp3',
      type: 'file',
      path: '/音乐',
      size: 5242880,
      extension: 'mp3',
      lastModified: '2026-02-15T16:45:00Z',
    },
    {
      id: '41',
      name: '轻音乐.flac',
      type: 'file',
      path: '/音乐',
      size: 31457280,
      extension: 'flac',
      lastModified: '2026-02-14T10:20:00Z',
    },
    {
      id: '42',
      name: '自然之声.wav',
      type: 'file',
      path: '/音乐',
      size: 52428800,
      extension: 'wav',
      lastModified: '2026-02-13T08:00:00Z',
    },
  ],
  '/项目': [
    {
      id: '50',
      name: 'vue-project',
      type: 'folder',
      path: '/项目',
      lastModified: '2026-03-01T08:00:00Z',
    },
    {
      id: '51',
      name: 'api-server',
      type: 'folder',
      path: '/项目',
      lastModified: '2026-02-28T17:00:00Z',
    },
    {
      id: '52',
      name: 'README.md',
      type: 'file',
      path: '/项目',
      size: 4096,
      extension: 'md',
      lastModified: '2026-03-01T08:00:00Z',
    },
  ],
  '/下载': [
    {
      id: '60',
      name: '安装包.zip',
      type: 'file',
      path: '/下载',
      size: 209715200,
      extension: 'zip',
      lastModified: '2026-03-02T11:30:00Z',
    },
    {
      id: '61',
      name: '数据备份.tar.gz',
      type: 'file',
      path: '/下载',
      size: 104857600,
      extension: 'gz',
      lastModified: '2026-03-01T20:00:00Z',
    },
    {
      id: '62',
      name: '字体包.7z',
      type: 'file',
      path: '/下载',
      size: 15728640,
      extension: '7z',
      lastModified: '2026-02-28T09:00:00Z',
    },
  ],
  '/文档/工作报告': [
    {
      id: '70',
      name: '2026年Q1报告.docx',
      type: 'file',
      path: '/文档/工作报告',
      size: 65536,
      extension: 'docx',
      lastModified: '2026-02-28T10:00:00Z',
    },
    {
      id: '71',
      name: '周报模板.docx',
      type: 'file',
      path: '/文档/工作报告',
      size: 16384,
      extension: 'docx',
      lastModified: '2026-02-20T08:00:00Z',
    },
  ],
  '/文档/个人笔记': [
    {
      id: '80',
      name: '学习笔记.md',
      type: 'file',
      path: '/文档/个人笔记',
      size: 8192,
      extension: 'md',
      lastModified: '2026-02-27T14:00:00Z',
    },
    {
      id: '81',
      name: '技术总结.md',
      type: 'file',
      path: '/文档/个人笔记',
      size: 12288,
      extension: 'md',
      lastModified: '2026-02-25T16:30:00Z',
    },
  ],
};

export function fetchFiles(path: string): Promise<FileItem[]> {
  return new Promise((resolve) => {
    setTimeout(
      () => {
        resolve(allFiles[path] || []);
      },
      300 + Math.random() * 400,
    );
  });
}
