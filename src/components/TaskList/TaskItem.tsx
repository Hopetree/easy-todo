import { useState } from 'react';
import type { TodoTask } from '@/types';
import { CustomSelect } from '@/components/CustomSelect';
import styles from './index.module.css';

interface Props {
  task: TodoTask;
  lists: { id: string; name: string }[];
  listColor?: string;
  defaultExpanded?: boolean;
  confirmDelete?: boolean;
  isDragging?: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, patch: Partial<TodoTask>) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDragOver?: (e: React.DragEvent) => void;
}

const PRIORITY_LABELS: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

export function TaskItem({ task, lists, listColor, defaultExpanded = false, confirmDelete = true, isDragging, onToggle, onDelete, onUpdate, onDragStart, onDragEnd, onDragOver }: Props) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editNote, setEditNote] = useState(task.note);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editDueDate, setEditDueDate] = useState(task.dueDate ?? '');
  const [editTags, setEditTags] = useState(task.tags.join(', '));
  const [editProgress, setEditProgress] = useState(task.progress);
  const [editArchived, setEditArchived] = useState(task.archived);
  const [editSuspended, setEditSuspended] = useState(task.suspended);
  const [editListId, setEditListId] = useState(task.listId);
  const [expanded, setExpanded] = useState(defaultExpanded);

  const saveEdit = () => {
    const title = editTitle.trim();
    if (!title) return;
    onUpdate(task.id, {
      title,
      listId: editListId,
      note: editNote.trim(),
      priority: editPriority,
      dueDate: editDueDate || null,
      tags: editTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      progress: editProgress,
      archived: editArchived,
      suspended: editSuspended,
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
      setEditProgress(task.progress);
      setEditArchived(task.archived);
      setEditSuspended(task.suspended);
      setEditListId(task.listId);
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
          <CustomSelect
            value={editListId}
            options={lists.map((l) => ({ value: l.id, label: l.name }))}
            onChange={(v) => setEditListId(v)}
          />
          <CustomSelect
            value={editPriority}
            options={[
              { value: 'high', label: '🔴 高' },
              { value: 'medium', label: '🟡 中' },
              { value: 'low', label: '🟢 低' },
            ]}
            onChange={(v) => setEditPriority(v as TodoTask['priority'])}
          />
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
        <div className={styles.editProgressRow}>
          <span className={styles.editProgressLabel}>
            进度 {editProgress}%
          </span>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={editProgress}
            onChange={(e) => setEditProgress(Number(e.target.value))}
            className={styles.editProgressSlider}
          />
        </div>
        <label className={styles.editArchiveLabel}>
          <input
            type="checkbox"
            checked={editArchived}
            onChange={(e) => setEditArchived(e.target.checked)}
          />
          已归档（不显示在周报中）
        </label>
        <label className={styles.editArchiveLabel}>
          <input
            type="checkbox"
            checked={editSuspended}
            onChange={(e) => setEditSuspended(e.target.checked)}
          />
          已挂起（不显示在周报中）
        </label>
        <textarea
          className={styles.editNoteArea}
          placeholder="备注..."
          value={editNote}
          onChange={(e) => setEditNote(e.target.value)}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
          }}
          onKeyDown={handleKeyDown}
          rows={5}
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
    <div
      className={`${styles.item} ${task.completed ? styles.completed : ''} ${isDragging ? styles.dragging : ''}`}
      onDragOver={(e) => onDragOver?.(e)}
    >
      <div className={styles.row}>
        <span
          className={styles.dragHandle}
          title="拖动排序"
          draggable={!editing}
          onDragStart={() => onDragStart?.()}
          onDragEnd={() => onDragEnd?.()}
        >
          ⠿
        </span>
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
            {task.archived && (
              <span className={styles.archivedTag}>已归档</span>
            )}
            {task.suspended && (
              <span className={styles.suspendedTag}>已挂起</span>
            )}
          </div>
        </div>

        <button
          className={`${styles.suspendBtn} ${task.suspended ? styles.suspended : ''}`}
          title={task.suspended ? '取消挂起' : '挂起'}
          onClick={(e) => {
            e.stopPropagation();
            onUpdate(task.id, { suspended: !task.suspended });
          }}
        >
          {task.suspended ? '▶' : '⏸'}
        </button>
        <button
          className={styles.editBtn}
          title="编辑"
          onClick={() => {
            setEditTitle(task.title);
            setEditNote(task.note);
            setEditPriority(task.priority);
            setEditDueDate(task.dueDate ?? '');
            setEditTags(task.tags.join(', '));
            setEditProgress(task.progress);
            setEditArchived(task.archived);
            setEditSuspended(task.suspended);
            setEditListId(task.listId);
            setEditing(true);
          }}
        >
          ✎
        </button>
        <button
          className={styles.deleteBtn}
          title="删除"
          onClick={() => {
            if (confirmDelete && !confirm('确定删除此任务？')) return;
            onDelete(task.id);
          }}
        >
          ×
        </button>
      </div>

      {/* 进度条 */}
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${task.progress}%` }}
        />
      </div>
      <span className={styles.progressText}>{task.progress}%</span>

      {expanded && task.note && (
        <div className={styles.note}>{task.note}</div>
      )}
    </div>
  );
}
