import { useRef, useState } from 'react';
import type { AppData, ImportMode } from '@/types';
import { readImportFile } from '@/services/importExport';
import styles from './index.module.css';

interface Props {
  data: AppData;
  onExport: () => void;
  onImport: (data: AppData, mode: ImportMode) => void;
  variant?: 'compact' | 'full';
}

export function ImportExport({ data, onExport, onImport, variant = 'compact' }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importData, setImportData] = useState<AppData | null>(null);
  const [showMode, setShowMode] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportData(null);
    setShowMode(false);
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsed = await readImportFile(file);
      setImportData(parsed);
      setShowMode(true);
    } catch (err: any) {
      setImportError(err.message);
    }
    // 重置 input，允许重复选同一文件
    if (fileRef.current) fileRef.current.value = '';
  };

  const doImport = (mode: ImportMode) => {
    if (!importData) return;
    onImport(importData, mode);
    setImportData(null);
    setShowMode(false);
  };

  const isFull = variant === 'full';

  return (
    <div className={`${styles.container} ${isFull ? styles.fullContainer : ''}`}>
      <button
        className={isFull ? styles.fullBtn : styles.btn}
        onClick={onExport}
        title="导出数据"
      >
        ⤓ 导出全部数据
      </button>

      <button
        className={isFull ? styles.fullBtn : styles.btn}
        onClick={() => fileRef.current?.click()}
        title="导入数据"
      >
        ⤒ 从文件导入
      </button>
      <input
        ref={fileRef}
        type="file"
        accept=".json"
        className={styles.fileInput}
        onChange={handleFileChange}
      />

      {importError && <div className={styles.error}>{importError}</div>}

      {showMode && importData && (
        <div className={styles.modalOverlay} onClick={() => setShowMode(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalTitle}>导入数据</div>
            <div className={styles.modalInfo}>
              {importData.lists.length} 个列表，{importData.tasks.length} 个任务
            </div>
            <div className={styles.modalActions}>
              <button className={styles.mergeBtn} onClick={() => doImport('merge')}>
                合并（追加不冲突的数据）
              </button>
              <button className={styles.overwriteBtn} onClick={() => doImport('overwrite')}>
                覆盖（放弃当前数据）
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setShowMode(false);
                  setImportData(null);
                }}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
