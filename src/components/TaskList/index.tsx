import { useState } from 'react';
import type { TodoTask, TodoList } from '@/types';
import { TaskItem } from './TaskItem';
import styles from './index.module.css';

interface Props {
  tasks: TodoTask[];
  lists: TodoList[];
  defaultExpanded?: boolean;
  confirmDelete?: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, patch: Partial<TodoTask>) => void;
  onReorder: (ids: string[]) => void;
}

export function TaskList({ tasks, lists, defaultExpanded, confirmDelete, onToggle, onDelete, onUpdate, onReorder }: Props) {
  const [dragId, setDragId] = useState<string | null>(null);

  if (tasks.length === 0) {
    return <div className={styles.empty}>暂无任务</div>;
  }

  const getListInfo = (listId: string) => lists.find((l) => l.id === listId);

  // 排序：sortOrder 升序 → 优先级高到低 → 更新时间倒序（同组内未完成在前）
  const PRIORITY_ORDER: Record<string, number> = { high: 3, medium: 2, low: 1 };
  const sorted = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    const pa = PRIORITY_ORDER[a.priority] ?? 0;
    const pb = PRIORITY_ORDER[b.priority] ?? 0;
    if (pa !== pb) return pb - pa;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const handleDragStart = (id: string) => setDragId(id);
  const handleDragEnd = () => setDragId(null);

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!dragId || dragId === targetId) return;
    const ids = sorted.map((t) => t.id);
    const fromIdx = ids.indexOf(dragId);
    const toIdx = ids.indexOf(targetId);
    ids.splice(fromIdx, 1);
    ids.splice(toIdx, 0, dragId);
    onReorder(ids);
  };

  return (
    <div className={styles.list}>
      {sorted.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          listColor={getListInfo(task.listId)?.color}
          defaultExpanded={defaultExpanded}
          confirmDelete={confirmDelete}
          isDragging={dragId === task.id}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onDragStart={() => handleDragStart(task.id)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(e, task.id)}
        />
      ))}
    </div>
  );
}
