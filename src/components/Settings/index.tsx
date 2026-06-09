import { useState } from 'react';
import type { AppData, AppSettings, ImportMode } from '@/types';
import { DEFAULT_SETTINGS } from '@/types';
import { ImportExport } from '@/components/ImportExport';
import styles from './index.module.css';

interface Props {
  settings: AppSettings;
  data: AppData;
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
  onExport: () => void;
  onGenerateWeekly: () => string;
  onImport: (data: AppData, mode: ImportMode) => void;
  onBack: () => void;
}

export function Settings({
  settings,
  data,
  onUpdateSettings,
  onExport,
  onGenerateWeekly,
  onImport,
  onBack,
}: Props) {
  const s = settings ?? DEFAULT_SETTINGS;
  const [weeklyText, setWeeklyText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          ← 返回
        </button>
        <h2 className={styles.title}>设置</h2>
        <div className={styles.spacer} />
      </header>

      <div className={styles.body}>
        {/* 数据管理 */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>数据管理</h3>
          <div className={styles.importExportCard}>
            <ImportExport
              data={data}
              onExport={onExport}
              onImport={onImport}
            />
            <button
              className={styles.weeklyBtn}
              onClick={() => setWeeklyText(onGenerateWeekly())}
            >
              📋 生成周报
            </button>
          </div>
        </section>

        {/* 周报展示 */}
        {weeklyText !== null && (
          <section className={styles.section}>
            <div className={styles.weeklyHeader}>
              <h3 className={styles.weeklyTitle}>周报预览</h3>
              <button
                className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
                onClick={async () => {
                  await navigator.clipboard.writeText(weeklyText);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
              >
                {copied ? '✓ 已复制' : '复制'}
              </button>
            </div>
            <textarea
              className={styles.weeklyTextarea}
              value={weeklyText}
              onChange={(e) => setWeeklyText(e.target.value)}
              rows={weeklyText.split('\n').length || 4}
            />
          </section>
        )}

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
              <select
                className={styles.select}
                value={s.defaultPriority}
                onChange={(e) =>
                  onUpdateSettings({
                    defaultPriority: e.target.value as AppSettings['defaultPriority'],
                  })
                }
              >
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>

            <div className={styles.row}>
              <div className={styles.label}>
                <span className={styles.labelText}>默认筛选视图</span>
                <span className={styles.labelHint}>打开插件时默认显示的任务范围</span>
              </div>
              <select
                className={styles.select}
                value={s.defaultFilter}
                onChange={(e) =>
                  onUpdateSettings({
                    defaultFilter: e.target.value as AppSettings['defaultFilter'],
                  })
                }
              >
                <option value="all">全部</option>
                <option value="todo">未完成</option>
                <option value="done">已完成</option>
              </select>
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
