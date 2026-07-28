import type { AppSettings } from '@/types';
import { DEFAULT_SETTINGS } from '@/types';
import { CustomSelect } from '@/components/CustomSelect';
import { IconHome } from '@/components/Icon';
import { version } from '@/../package.json';
import styles from './index.module.css';

interface Props {
  settings: AppSettings;
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
  onBack: () => void;
}

export function Settings({ settings, onUpdateSettings, onBack }: Props) {
  const s = settings ?? DEFAULT_SETTINGS;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          <IconHome size={16} />
        </button>
        <h2 className={styles.title}>设置</h2>
        <div className={styles.spacer} />
        <span className={styles.version}>v{version}</span>
      </header>

      <div className={styles.body}>
        {/* 常规设置 */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>常规设置</h3>
          <div className={styles.card}>
            <div className={styles.row}>
              <div className={styles.label}>
                <span className={styles.labelText}>插件标题</span>
                <span className={styles.labelHint}>显示在主页左上角的名称</span>
              </div>
              <input
                className={styles.input}
                type="text"
                value={s.appTitle}
                onChange={(e) => onUpdateSettings({ appTitle: e.target.value })}
                placeholder="Easy Todo"
              />
            </div>
          </div>
        </section>

        {/* 任务默认设置 */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>任务默认设置</h3>
          <div className={styles.card}>
            <div className={styles.row}>
              <div className={styles.label}>
                <span className={styles.labelText}>默认展开详情</span>
                <span className={styles.labelHint}>任务创建后是否默认展开备注等详情</span>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={s.taskDefaultExpanded}
                  onChange={(e) =>
                    onUpdateSettings({ taskDefaultExpanded: e.target.checked })
                  }
                />
                <span className={styles.toggleSlider} />
              </label>
            </div>

            <div className={styles.row}>
              <div className={styles.label}>
                <span className={styles.labelText}>默认优先级</span>
                <span className={styles.labelHint}>新建任务时的初始优先级</span>
              </div>
              <CustomSelect
                className={styles.select}
                value={s.defaultPriority}
                options={[
                  { value: 'high', label: '高' },
                  { value: 'medium', label: '中' },
                  { value: 'low', label: '低' },
                ]}
                onChange={(v) =>
                  onUpdateSettings({
                    defaultPriority: v as AppSettings['defaultPriority'],
                  })
                }
              />
            </div>

            <div className={styles.row}>
              <div className={styles.label}>
                <span className={styles.labelText}>默认筛选视图</span>
                <span className={styles.labelHint}>打开插件时默认显示的任务范围</span>
              </div>
              <CustomSelect
                className={styles.select}
                value={s.defaultFilter}
                options={[
                  { value: 'all', label: '全部' },
                  { value: 'todo', label: '未完成' },
                  { value: 'done', label: '已完成' },
                ]}
                onChange={(v) =>
                  onUpdateSettings({
                    defaultFilter: v as AppSettings['defaultFilter'],
                  })
                }
              />
            </div>
          </div>
        </section>

        {/* 交互设置 */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>交互设置</h3>
          <div className={styles.card}>
            <div className={styles.row}>
              <div className={styles.label}>
                <span className={styles.labelText}>删除前确认</span>
                <span className={styles.labelHint}>删除任务和列表时弹出确认对话框</span>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={s.confirmBeforeDelete}
                  onChange={(e) =>
                    onUpdateSettings({ confirmBeforeDelete: e.target.checked })
                  }
                />
                <span className={styles.toggleSlider} />
              </label>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
