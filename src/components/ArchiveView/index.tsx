import { useState, useMemo } from 'react';
import type { TodoTask, TodoList } from '@/types';
import { CustomSelect } from '@/components/CustomSelect';
import { IconArrowLeft, IconTrash, IconCheck, IconBarChart } from '@/components/Icon';
import { exportTasksCSV } from '@/services/importExport';
import styles from './index.module.css';

interface Props {
  tasks: TodoTask[];
  lists: TodoList[];
  confirmDelete?: boolean;
  onRestore: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onBack: () => void;
}

const PRIORITY_LABELS: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

export function ArchiveView({ tasks, lists, confirmDelete = true, onRestore, onDelete, onBack }: Props) {
  const [keyword, setKeyword] = useState('');
  const [listFilter, setListFilter] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [batchConfirm, setBatchConfirm] = useState<'delete' | null>(null);

  const listMap = useMemo(() => new Map(lists.map((l) => [l.id, l])), [lists]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    tasks.filter((t) => t.archived).forEach((t) => t.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [tasks]);

  // 过滤后的归档任务
  const filtered = useMemo(() => {
    let result = tasks.filter((t) => t.archived);
    if (keyword) {
      const kw = keyword.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(kw));
    }
    if (listFilter) {
      result = result.filter((t) => t.listId === listFilter);
    }
    return result;
  }, [tasks, keyword, listFilter]);

  const getListName = (listId: string) => {
    const list = listMap.get(listId);
    return list ? list.name : '(列表已删除)';
  };
  const getListColor = (listId: string) => {
    const list = listMap.get(listId);
    return list?.color;
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    const allIds = filtered.map((t) => t.id);
    if (allIds.every((id) => selected.has(id))) {
      setSelected(new Set());
    } else {
      setSelected(new Set(allIds));
    }
  };

  const clearSelection = () => setSelected(new Set());

  const handleDelete = (taskId: string) => {
    if (confirmDelete) {
      setDeletingId(taskId);
    } else {
      doDelete(taskId);
    }
  };

  const doDelete = (taskId: string) => {
    onDelete(taskId);
    setDeletingId(null);
  };

  const handleBatchRestore = () => {
    selected.forEach((id) => onRestore(id));
    setSelected(new Set());
  };

  const handleBatchDelete = () => {
    if (batchConfirm === 'delete') {
      selected.forEach((id) => onDelete(id));
      setSelected(new Set());
      setBatchConfirm(null);
    } else {
      setBatchConfirm('delete');
    }
  };

  const clearFilters = () => {
    setKeyword('');
    setListFilter('');
  };

  const listOptions = [
    { value: '', label: '全部列表' },
    ...lists.map((l) => ({ value: l.id, label: l.name })),
  ];

  const hasFilter = keyword !== '' || listFilter !== '';

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          <IconArrowLeft size={16} /> 返回
        </button>
        <h2 className={styles.title}>归档任务</h2>
        <span className={styles.count}>{filtered.length} 个</span>
      </header>

      {/* 搜索和筛选 */}
      <div className={styles.toolbar}>
        <div className={styles.searchRow}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="搜索归档任务..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <CustomSelect
            className={styles.listSelect}
            value={listFilter}
            options={listOptions}
            onChange={(v) => setListFilter(v)}
          />
          <button
            className={styles.exportBtn}
            title="导出归档为 CSV"
            onClick={() => exportTasksCSV(filtered, lists)}
          >
            <IconBarChart size={14} />
          </button>
          {hasFilter && (
            <button className={styles.clearFilterBtn} onClick={clearFilters}>
              清除
            </button>
          )}
        </div>

        {/* 批量操作 */}
        <div className={styles.batchRow}>
          <label className={styles.selectAllLabel}>
            <input
              type="checkbox"
              checked={filtered.length > 0 && filtered.every((t) => selected.has(t.id))}
              onChange={selectAll}
            />
            全选 ({selected.size} 项)
          </label>
          {selected.size > 0 && (
            <div className={styles.batchActions}>
              <button className={styles.batchRestoreBtn} onClick={handleBatchRestore}>
                <IconCheck size={14} /> 批量还原
              </button>
              {batchConfirm === 'delete' ? (
                <span className={styles.batchConfirm}>
                  确定永久删除 {selected.size} 个任务？
                  <button className={styles.confirmYes} onClick={handleBatchDelete}>是</button>
                  <button className={styles.confirmNo} onClick={() => setBatchConfirm(null)}>否</button>
                </span>
              ) : (
                <button className={styles.batchDeleteBtn} onClick={handleBatchDelete}>
                  <IconTrash size={14} /> 批量删除
                </button>
              )}
              <button className={styles.cancelSelectBtn} onClick={clearSelection}>
                取消选择
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 列表 */}
      <div className={styles.list}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>{hasFilter ? '无匹配的归档任务' : '暂无归档任务'}</div>
        ) : (
          filtered.map((task) => (
            <div key={task.id} className={`${styles.item} ${selected.has(task.id) ? styles.selected : ''}`}>
              <label className={styles.checkLabel}>
                <input
                  type="checkbox"
                  checked={selected.has(task.id)}
                  onChange={() => toggleSelect(task.id)}
                />
              </label>
              <div className={styles.itemBody}>
                <div className={styles.info}>
                  <span
                    className={styles.listDot}
                    style={{ backgroundColor: getListColor(task.listId) ?? '#94a3b8' }}
                  />
                  <span className={styles.listName}>{getListName(task.listId)}</span>
                </div>
                <div className={styles.taskTitle}>{task.title}</div>
                <div className={styles.meta}>
                  <span className={`${styles.priority} ${styles[`p_${task.priority}`]}`}>
                    {PRIORITY_LABELS[task.priority]}
                  </span>
                  {task.dueDate && (
                    <span className={styles.dueDate}>{task.dueDate}</span>
                  )}
                  {task.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                  {task.suspended && (
                    <span className={styles.suspendedTag}>已挂起</span>
                  )}
                </div>
                <div className={styles.actions}>
                  <button
                    className={styles.restoreBtn}
                    onClick={() => onRestore(task.id)}
                    title="还原任务"
                  >
                    <IconCheck size={14} /> 还原
                  </button>
                  {deletingId === task.id ? (
                    <span className={styles.confirmDelete}>
                      确定永久删除？
                      <button className={styles.confirmYes} onClick={() => doDelete(task.id)}>是</button>
                      <button className={styles.confirmNo} onClick={() => setDeletingId(null)}>否</button>
                    </span>
                  ) : (
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(task.id)}
                      title="永久删除"
                    >
                      <IconTrash size={14} /> 删除
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
