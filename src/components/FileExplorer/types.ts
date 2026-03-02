/** 文件/文件夹条目 */
export interface FileItem {
  /** 唯一标识 */
  id: string;
  /** 文件名 */
  name: string;
  /** 类型 */
  type: 'file' | 'folder';
  /** 文件大小（字节） */
  size?: number;
  /** 最后修改时间 ISO 字符串 */
  lastModified?: string;
  /** MIME 类型 */
  mime?: string;
  /** 文件扩展名（不含点号） */
  extension?: string;
  /** 缩略图 URL */
  thumbnail?: string;
  /** 所在路径 */
  path: string;
  /** 是否只读 */
  readonly?: boolean;
}

/** 视图模式 */
export type ViewMode = 'grid' | 'list';

/** 排序字段 */
export type SortField = 'name' | 'size' | 'lastModified' | 'type';

/** 排序方向 */
export type SortDirection = 'asc' | 'desc';

/** 排序配置 */
export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

/** 面包屑段 */
export interface BreadcrumbSegment {
  label: string;
  path: string;
}

/** 右键菜单项 */
export interface ContextMenuItem {
  key: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  divider?: boolean;
  children?: ContextMenuItem[];
}

/** 文件浏览器配置 */
export interface FileExplorerProps {
  /** 初始路径 */
  initialPath?: string;
  /** 文件列表数据（外部提供，组件不管数据来源） */
  items?: FileItem[];
  /** 是否显示状态栏 */
  showStatusbar?: boolean;
  /** 是否允许多选 */
  multiSelect?: boolean;
  /** 是否只读模式 */
  readonly?: boolean;
  /** 高度 */
  height?: string | number;
}
