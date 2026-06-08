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

// 应用全局数据
export interface AppData {
  lists: TodoList[];
  tasks: TodoTask[];
  version: number;
  exportedAt?: string;
}

// 筛选条件
export interface FilterOptions {
  keyword: string;
  priority: '' | TodoTask['priority'];
  completed: '' | 'yes' | 'no';
  tag: string;
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
