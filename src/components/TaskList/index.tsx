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
}

export function TaskList({ tasks, lists, defaultExpanded, confirmDelete, onToggle, onDelete, onUpdate }: Props) {
  if (tasks.length === 0) {
    return <div className={styles.empty}>暂无任务</div>;
  }

  const getListInfo = (listId: string) => lists.find((l) => l.id === listId);

  // 排序：未完成在前，按创建时间倒序
  const sorted = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className={styles.list}>
      {sorted.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          listColor={getListInfo(task.listId)?.color}
          defaultExpanded={defaultExpanded}
          confirmDelete={confirmDelete}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
