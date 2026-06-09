import type { FilterOptions, TodoTask } from '@/types';
import styles from './index.module.css';

interface Props {
  filter: FilterOptions;
  allTags: string[];
  onChange: (f: FilterOptions) => void;
}

export function SearchFilter({ filter, allTags, onChange }: Props) {
  const update = (patch: Partial<FilterOptions>) => {
    onChange({ ...filter, ...patch });
  };

  const hasFilter =
    filter.keyword !== '' ||
    filter.priority !== '' ||
    filter.completed !== '' ||
    filter.tag !== '' ||
    filter.archived !== 'no';

  const clearAll = () => {
    onChange({ keyword: '', priority: '', completed: '', tag: '', archived: 'no' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchRow}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="搜索任务..."
          value={filter.keyword}
          onChange={(e) => update({ keyword: e.target.value })}
        />
        {hasFilter && (
          <button className={styles.clearBtn} onClick={clearAll} title="清除所有筛选">
            清除
          </button>
        )}
      </div>

      <div className={styles.filters}>
        <select
          className={styles.select}
          value={filter.priority}
          onChange={(e) => update({ priority: e.target.value as '' | TodoTask['priority'] })}
        >
          <option value="">全部优先级</option>
          <option value="high">高优先级</option>
          <option value="medium">中优先级</option>
          <option value="low">低优先级</option>
        </select>

        <select
          className={styles.select}
          value={filter.completed}
          onChange={(e) => update({ completed: e.target.value as '' | 'yes' | 'no' })}
        >
          <option value="">全部状态</option>
          <option value="no">未完成</option>
          <option value="yes">已完成</option>
        </select>

        <select
          className={styles.select}
          value={filter.archived}
          onChange={(e) => update({ archived: e.target.value as '' | 'yes' | 'no' })}
        >
          <option value="no">未归档</option>
          <option value="yes">已归档</option>
          <option value="">全部（含归档）</option>
        </select>

        {allTags.length > 0 && (
          <select
            className={styles.select}
            value={filter.tag}
            onChange={(e) => update({ tag: e.target.value })}
          >
            <option value="">全部标签</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
