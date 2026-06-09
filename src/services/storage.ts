import type { AppData, TodoList, TodoTask } from '@/types';
import { DEFAULT_SETTINGS } from '@/types';

const STORAGE_KEY = 'easy-todo-data';
const CURRENT_VERSION = 1;

function getDefaultData(): AppData {
  const defaultListId = generateId();
  return {
    lists: [
      {
        id: defaultListId,
        name: '默认列表',
        color: '#3b82f6',
        createdAt: new Date().toISOString(),
        sortOrder: 0,
      },
    ],
    tasks: [],
    settings: { ...DEFAULT_SETTINGS },
    version: CURRENT_VERSION,
  };
}

// ============================================================
// ID 生成
// ============================================================
export function generateId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

// ============================================================
// 读
// ============================================================
export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();
    const data: AppData = JSON.parse(raw);
    // 简单版本兼容
    if (!data.version) {
      return migrateFrom0(data);
    }
    return data;
  } catch {
    return getDefaultData();
  }
}

function migrateFrom0(data: Partial<AppData>): AppData {
  return {
    lists: data.lists ?? getDefaultData().lists,
    tasks: (data.tasks ?? []).map((t) => ({
      ...t,
      priority: t.priority ?? ('medium' as const),
      tags: t.tags ?? [],
      note: t.note ?? '',
      progress: t.progress ?? (t.completed ? 100 : 0),
      archived: t.archived ?? false,
      sortOrder: t.sortOrder ?? 0,
    })),
    settings: data.settings ?? { ...DEFAULT_SETTINGS },
    version: CURRENT_VERSION,
  };
}

// ============================================================
// 写
// ============================================================
let saveTimer: ReturnType<typeof setTimeout> | null = null;

export function saveData(data: AppData): void {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save data:', e);
    }
  }, 300);
}

export function saveDataImmediate(data: AppData): void {
  if (saveTimer) clearTimeout(saveTimer);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data:', e);
  }
}

// ============================================================
// 原子操作辅助
// ============================================================
export function addList(data: AppData, name: string, color: string): { data: AppData; list: TodoList } {
  const list: TodoList = {
    id: generateId(),
    name,
    color,
    createdAt: new Date().toISOString(),
    sortOrder: data.lists.length,
  };
  return {
    data: { ...data, lists: [...data.lists, list] },
    list,
  };
}

export function addTask(data: AppData, listId: string, title: string, priority?: TodoTask['priority']): { data: AppData; task: TodoTask } {
  const now = new Date().toISOString();
  const task: TodoTask = {
    id: generateId(),
    listId,
    title,
    completed: false,
    priority: priority ?? 'medium',
    dueDate: new Date().toISOString().slice(0, 10),
    tags: [],
    note: '',
    progress: 0,
    archived: false,
    sortOrder: data.tasks.length,
    createdAt: now,
    updatedAt: now,
  };
  return {
    data: { ...data, tasks: [...data.tasks, task] },
    task,
  };
}

export function updateTask(data: AppData, taskId: string, patch: Partial<TodoTask>): AppData {
  return {
    ...data,
    tasks: data.tasks.map((t) =>
      t.id === taskId ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t,
    ),
  };
}

export function deleteTask(data: AppData, taskId: string): AppData {
  return {
    ...data,
    tasks: data.tasks.filter((t) => t.id !== taskId),
  };
}

export function toggleTask(data: AppData, taskId: string): AppData {
  return {
    ...data,
    tasks: data.tasks.map((t) => {
      if (t.id !== taskId) return t;
      const completed = !t.completed;
      return {
        ...t,
        completed,
        progress: completed ? 100 : 0,
        updatedAt: new Date().toISOString(),
      };
    }),
  };
}

export function deleteList(data: AppData, listId: string): AppData {
  return {
    ...data,
    lists: data.lists.filter((l) => l.id !== listId),
    tasks: data.tasks.filter((t) => t.listId !== listId),
  };
}

export function renameList(data: AppData, listId: string, name: string): AppData {
  return {
    ...data,
    lists: data.lists.map((l) => (l.id === listId ? { ...l, name } : l)),
  };
}

export function reorderLists(data: AppData, ids: string[]): AppData {
  const orderMap = new Map(ids.map((id, i) => [id, i]));
  return {
    ...data,
    lists: data.lists
      .map((l) => ({ ...l, sortOrder: orderMap.get(l.id) ?? l.sortOrder }))
      .sort((a, b) => a.sortOrder - b.sortOrder),
  };
}

export function reorderTasks(data: AppData, listId: string, ids: string[]): AppData {
  const orderMap = new Map(ids.map((id, i) => [id, i]));
  return {
    ...data,
    tasks: data.tasks.map((t) =>
      t.listId === listId && orderMap.has(t.id)
        ? { ...t, sortOrder: orderMap.get(t.id) ?? t.sortOrder, updatedAt: new Date().toISOString() }
        : t,
    ),
  };
}
