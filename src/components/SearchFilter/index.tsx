import type { FilterOptions, TodoTask } from '@/types';
import { CustomSelect } from '@/components/CustomSelect';
import styles from './index.module.css';

const PRIORITY_OPTIONS = [
  { value: '', label: '全部优先级' },
  { value: 'high', label: '高优先级' },
  { value: 'medium', label: '中优先级' },
  { value: 'low', label: '低优先级' },
];
const COMPLETED_OPTIONS = [
  { value: '', label: '全部状态' },
  { value: 'no', label: '未完成' },
  { value: 'yes', label: '已完成' },
];
const ARCHIVED_OPTIONS = [
  { value: 'no', label: '未归档' },
  { value: 'yes', label: '已归档' },
  { value: '', label: '全部（含归档）' },
];
const SUSPENDED_OPTIONS = [
  { value: '', label: '全部（含挂起）' },
  { value: 'no', label: '未挂起' },
  { value: 'yes', label: '已挂起' },
];

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
    filter.archived !== 'no' ||
    filter.suspended !== '';

  const clearAll = () => {
    onChange({ keyword: '', priority: '', completed: '', tag: '', archived: 'no', suspended: '' });
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
        <CustomSelect
          className={styles.select}
          value={filter.priority}
          options={PRIORITY_OPTIONS}
          onChange={(v) => update({ priority: v as '' | TodoTask['priority'] })}
        />
        <CustomSelect
          className={styles.select}
          value={filter.completed}
          options={COMPLETED_OPTIONS}
          onChange={(v) => update({ completed: v as '' | 'yes' | 'no' })}
        />
        <CustomSelect
          className={styles.select}
          value={filter.archived}
          options={ARCHIVED_OPTIONS}
          onChange={(v) => update({ archived: v as '' | 'yes' | 'no' })}
        />
        <CustomSelect
          className={styles.select}
          value={filter.suspended}
          options={SUSPENDED_OPTIONS}
          onChange={(v) => update({ suspended: v as '' | 'yes' | 'no' })}
        />
        {allTags.length > 0 && (
          <CustomSelect
            className={styles.select}
            value={filter.tag}
            options={[
              { value: '', label: '全部标签' },
              ...allTags.map((t) => ({ value: t, label: t })),
            ]}
            onChange={(v) => update({ tag: v })}
          />
        )}
      </div>
    </div>
  );
}
