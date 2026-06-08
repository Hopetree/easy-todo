import { useState } from 'react';
import type { TodoList } from '@/types';
import { LIST_COLORS } from '@/types';
import styles from './index.module.css';

interface Props {
  lists: TodoList[];
  activeListId: string;
  taskCounts: Record<string, { total: number; done: number }>;
  onSelect: (id: string) => void;
  onAdd: (name: string, color: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export function ListManager({
  lists,
  activeListId,
  taskCounts,
  onSelect,
  onAdd,
  onDelete,
  onRename,
}: Props) {
  const [newName, setNewName] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    const color = LIST_COLORS[lists.length % LIST_COLORS.length];
    onAdd(name, color);
    setNewName('');
    setShowInput(false);
  };

  const startRename = (list: TodoList) => {
    setEditingId(list.id);
    setEditName(list.name);
  };

  const confirmRename = (id: string) => {
    const name = editName.trim();
    if (name) onRename(id, name);
    setEditingId(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {lists.map((list) => {
          const counts = taskCounts[list.id] ?? { total: 0, done: 0 };
          const isActive = list.id === activeListId;

          return (
            <div
              key={list.id}
              className={`${styles.item} ${isActive ? styles.active : ''}`}
              onClick={() => onSelect(list.id)}
            >
              <span
                className={styles.dot}
                style={{ backgroundColor: list.color }}
              />
              {editingId === list.id ? (
                <input
                  className={styles.editInput}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => confirmRename(list.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') confirmRename(list.id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              ) : (
                <span className={styles.name}>{list.name}</span>
              )}
              <span className={styles.count}>
                {counts.done}/{counts.total}
              </span>
              {isActive && lists.length > 1 && (
                <div className={styles.actions}>
                  <button
                    className={styles.actionBtn}
                    title="重命名"
                    onClick={(e) => {
                      e.stopPropagation();
                      startRename(list);
                    }}
                  >
                    ✎
                  </button>
                  <button
                    className={styles.actionBtn}
                    title="删除列表"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`确定删除列表「${list.name}」及其所有任务？`)) {
                        onDelete(list.id);
                      }
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showInput ? (
        <div className={styles.addForm}>
          <input
            className={styles.addInput}
            placeholder="列表名称"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd();
              if (e.key === 'Escape') {
                setShowInput(false);
                setNewName('');
              }
            }}
            autoFocus
          />
          <button className={styles.confirmBtn} onClick={handleAdd}>
            ✓
          </button>
          <button
            className={styles.cancelBtn}
            onClick={() => {
              setShowInput(false);
              setNewName('');
            }}
          >
            ×
          </button>
        </div>
      ) : (
        <button className={styles.addBtn} onClick={() => setShowInput(true)}>
          + 新建列表
        </button>
      )}
    </div>
  );
}
