import { useState } from 'react';
import type { TodoTask } from '@/types';
import styles from './index.module.css';

interface Props {
  task: TodoTask;
  listColor?: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, patch: Partial<TodoTask>) => void;
}

const PRIORITY_LABELS: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

export function TaskItem({ task, listColor, onToggle, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editNote, setEditNote] = useState(task.note);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editDueDate, setEditDueDate] = useState(task.dueDate ?? '');
  const [editTags, setEditTags] = useState(task.tags.join(', '));
  const [expanded, setExpanded] = useState(false);

  const saveEdit = () => {
    const title = editTitle.trim();
    if (!title) return;
    onUpdate(task.id, {
      title,
      note: editNote.trim(),
      priority: editPriority,
      dueDate: editDueDate || null,
      tags: editTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) saveEdit();
    if (e.key === 'Escape') {
      setEditTitle(task.title);
      setEditNote(task.note);
      setEditPriority(task.priority);
      setEditDueDate(task.dueDate ?? '');
      setEditTags(task.tags.join(', '));
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <div className={`${styles.item} ${styles.editing}`}>
        <input
          className={styles.editTitleInput}
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="任务标题"
          autoFocus
        />
        <div className={styles.editFields}>
          <select
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value as TodoTask['priority'])}
          >
            <option value="high">🔴 高</option>
            <option value="medium">🟡 中</option>
            <option value="low">🟢 低</option>
          </select>
          <input
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
          />
          <input
            type="text"
            placeholder="标签 (逗号分隔)"
            value={editTags}
            onChange={(e) => setEditTags(e.target.value)}
          />
        </div>
        <textarea
          className={styles.editNoteArea}
          placeholder="备注..."
          value={editNote}
          onChange={(e) => setEditNote(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
        />
        <div className={styles.editActions}>
          <button className={styles.saveBtn} onClick={saveEdit}>
            保存
          </button>
          <button
            className={styles.cancelEditBtn}
            onClick={() => setEditing(false)}
          >
            取消
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.item} ${task.completed ? styles.completed : ''}`}>
      <div className={styles.row}>
        <button
          className={`${styles.checkbox} ${task.completed ? styles.checked : ''}`}
          onClick={() => onToggle(task.id)}
          title={task.completed ? '标记未完成' : '标记完成'}
        >
          {task.completed ? '✓' : ''}
        </button>

        <div
          className={styles.content}
          onClick={() => setExpanded(!expanded)}
        >
          <span className={styles.title}>{task.title}</span>
          <div className={styles.meta}>
            <span className={`${styles.priority} ${styles[`p_${task.priority}`]}`}>
              {PRIORITY_LABELS[task.priority]}
            </span>
            {task.dueDate && (
              <span className={styles.dueDate}>
                {task.dueDate}
              </span>
            )}
            {task.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <button
          className={styles.editBtn}
          title="编辑"
          onClick={() => {
            setEditTitle(task.title);
            setEditNote(task.note);
            setEditPriority(task.priority);
            setEditDueDate(task.dueDate ?? '');
            setEditTags(task.tags.join(', '));
            setEditing(true);
          }}
        >
          ✎
        </button>
        <button
          className={styles.deleteBtn}
          title="删除"
          onClick={() => onDelete(task.id)}
        >
          ×
        </button>
      </div>

      {expanded && task.note && (
        <div className={styles.note}>{task.note}</div>
      )}
    </div>
  );
}
