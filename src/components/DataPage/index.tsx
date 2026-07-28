import type { AppData, ImportMode } from '@/types';
import { ImportExport } from '@/components/ImportExport';
import { IconHome } from '@/components/Icon';
import styles from './index.module.css';

interface Props {
  data: AppData;
  onExport: () => void;
  onExportCSV: () => void;
  onImport: (data: AppData, mode: ImportMode) => void;
  onBack: () => void;
}

export function DataPage({ data, onExport, onExportCSV, onImport, onBack }: Props) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          <IconHome size={16} />
        </button>
        <h2 className={styles.title}>数据管理</h2>
      </header>

      <div className={styles.body}>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>导入 / 导出</h3>
          <div className={styles.card}>
            <ImportExport
              data={data}
              onExport={onExport}
              onImport={onImport}
              onExportCSV={onExportCSV}
              variant="full"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
