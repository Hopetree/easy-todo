// 任务
export interface TodoTask {
  id: string;
  listId: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate: string | null;
  tags: string[];
  note: string;
  progress: number;          // 0-100
  archived: boolean;         // 已归档
  suspended: boolean;        // 已挂起（不在周报中显示）
  sortOrder: number;         // 手动排序序号
  createdAt: string;
  updatedAt: string;
}

// 列表
export interface TodoList {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  sortOrder: number;
}

// 应用设置
export interface AppSettings {
  taskDefaultExpanded: boolean;   // 任务默认展开详情
  defaultPriority: TodoTask['priority'];
  appTitle: string;              // 插件标题，默认 "Easy Todo"
  defaultFilter: '' | 'all' | 'todo' | 'done';  // 默认筛选状态
  confirmBeforeDelete: boolean;   // 删除前确认
}

export const DEFAULT_SETTINGS: AppSettings = {
  appTitle: 'Easy Todo',
  taskDefaultExpanded: false,
  defaultPriority: 'medium',
  defaultFilter: 'all',
  confirmBeforeDelete: true,
};

// 应用全局数据
export interface AppData {
  lists: TodoList[];
  tasks: TodoTask[];
  settings: AppSettings;
  version: number;
  exportedAt?: string;
}

// 应用视图
export type AppView = 'main' | 'settings';

// 筛选条件
export interface FilterOptions {
  keyword: string;
  priority: '' | TodoTask['priority'];
  completed: '' | 'yes' | 'no';
  tag: string;
  archived: '' | 'yes' | 'no';   // 默认 'no' 只显示未归档
  suspended: '' | 'yes' | 'no'; // 默认 '' 显示全部
}

// 导入模式
export type ImportMode = 'merge' | 'overwrite';

// 列表颜色预设
export const LIST_COLORS = [
  '#3b82f6', // blue
  '#22c55e', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
];
