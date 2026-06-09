import { useState, useCallback, useEffect } from 'react';
import type { AppData, AppSettings, TodoList, TodoTask, FilterOptions, ImportMode } from '@/types';
import { DEFAULT_SETTINGS } from '@/types';
import {
  loadData,
  saveData,
  saveDataImmediate,
  addList,
  addTask,
  updateTask,
  deleteTask,
  toggleTask,
  deleteList,
  renameList,
  reorderLists,
  reorderTasks,
} from '@/services/storage';
import { applyImport, generateWeeklyText, exportData } from '@/services/importExport';

export function useAppState() {
  const [data, setData] = useState<AppData>(() => loadData());
  const [activeListId, setActiveListId] = useState<string>(() => {
    const d = loadData();
    return d.lists[0]?.id ?? '';
  });
  const [filter, setFilter] = useState<FilterOptions>(() => {
    const d = loadData();
    const s = d.settings ?? DEFAULT_SETTINGS;
    return {
      keyword: '',
      priority: '',
      completed: s.defaultFilter === 'all' ? '' : s.defaultFilter === 'done' ? 'yes' : 'no',
      tag: '',
      archived: 'no',
    };
  });

  // 持久化
  useEffect(() => {
    saveData(data);
  }, [data]);

  // ==========================================================
  // 列表操作
  // ==========================================================
  const handleAddList = useCallback((name: string, color: string) => {
    setData((prev) => {
      const result = addList(prev, name, color);
      if (prev.lists.length === 0) setActiveListId(result.list.id);
      return result.data;
    });
  }, []);

  const handleDeleteList = useCallback(
    (listId: string) => {
      setData((prev) => {
        const newData = deleteList(prev, listId);
        if (listId === activeListId) {
          setActiveListId(newData.lists[0]?.id ?? '');
        }
        return newData;
      });
    },
    [activeListId],
  );

  const handleRenameList = useCallback((listId: string, name: string) => {
    setData((prev) => renameList(prev, listId, name));
  }, []);

  const handleReorderList = useCallback((ids: string[]) => {
    setData((prev) => reorderLists(prev, ids));
  }, []);

  const handleReorderTasks = useCallback((listId: string, ids: string[]) => {
    setData((prev) => reorderTasks(prev, listId, ids));
  }, []);

  // ==========================================================
  // 任务操作
  // ==========================================================
  const handleAddTask = useCallback((listId: string, title: string) => {
    setData((prev) => {
      const priority = prev.settings?.defaultPriority ?? DEFAULT_SETTINGS.defaultPriority;
      return addTask(prev, listId, title, priority).data;
    });
  }, []);

  const handleUpdateTask = useCallback((taskId: string, patch: Partial<TodoTask>) => {
    setData((prev) => updateTask(prev, taskId, patch));
  }, []);

  const handleDeleteTask = useCallback((taskId: string) => {
    setData((prev) => deleteTask(prev, taskId));
  }, []);

  const handleToggleTask = useCallback((taskId: string) => {
    setData((prev) => toggleTask(prev, taskId));
  }, []);

  // ==========================================================
  // 导入导出
  // ==========================================================
  const handleExport = useCallback(() => {
    saveDataImmediate(data);
    exportData(data);
  }, [data]);

  const handleGenerateWeekly = useCallback((): string => {
    return generateWeeklyText(data);
  }, [data]);

  const handleImport = useCallback(
    (incoming: AppData, mode: ImportMode) => {
      setData((prev) => {
        const newData = applyImport(prev, incoming, mode);
        // 修正 activeListId（如果列表已被删除）
        if (!newData.lists.find((l) => l.id === activeListId)) {
          setActiveListId(newData.lists[0]?.id ?? '');
        }
        saveDataImmediate(newData);
        return newData;
      });
    },
    [activeListId],
  );

  // ==========================================================
  // 设置操作
  // ==========================================================
  const handleUpdateSettings = useCallback((patch: Partial<AppSettings>) => {
    setData((prev) => ({
      ...prev,
      settings: { ...(prev.settings ?? DEFAULT_SETTINGS), ...patch },
    }));
  }, []);

  // ==========================================================
  // 筛选后的任务
  // ==========================================================
  const filteredTasks = useCallback((): TodoTask[] => {
    let tasks = data.tasks.filter((t) => t.listId === activeListId);

    if (filter.keyword) {
      const kw = filter.keyword.toLowerCase();
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(kw) ||
          t.note.toLowerCase().includes(kw),
      );
    }
    if (filter.priority) {
      tasks = tasks.filter((t) => t.priority === filter.priority);
    }
    if (filter.completed === 'yes') {
      tasks = tasks.filter((t) => t.completed);
    } else if (filter.completed === 'no') {
      tasks = tasks.filter((t) => !t.completed);
    }
    if (filter.tag) {
      tasks = tasks.filter((t) => t.tags.includes(filter.tag));
    }
    if (filter.archived === 'yes') {
      tasks = tasks.filter((t) => t.archived);
    } else if (filter.archived === 'no') {
      tasks = tasks.filter((t) => !t.archived);
    }
    return tasks;
  }, [data, activeListId, filter]);

  const allTags = useCallback((): string[] => {
    const tags = new Set<string>();
    data.tasks.forEach((t) => t.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [data]);

  return {
    data,
    activeListId,
    filter,
    setActiveListId,
    setFilter,
    handleAddList,
    handleDeleteList,
    handleRenameList,
    handleReorderList,
    handleReorderTasks,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    handleToggleTask,
    handleExport,
    handleGenerateWeekly,
    handleImport,
    handleUpdateSettings,
    filteredTasks,
    allTags,
  };
}
