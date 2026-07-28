import { useState } from 'react';
import type { AppView } from '@/types';
import { useAppState } from '@/hooks/useAppState';
import { ListManager } from './ListManager';
import { TaskList } from './TaskList';
import { TaskEditor } from './TaskEditor';
import { SearchFilter } from './SearchFilter';
import { Settings } from './Settings';
import { ArchiveView } from './ArchiveView';
import { WeeklyReport } from './WeeklyReport';
import { DataPage } from './DataPage';
import { IconSettings, IconArchive, IconClipboard, IconDownload } from './Icon';
import styles from './App.module.css';

export function App() {
  const state = useAppState();
  const [view, setView] = useState<AppView>('main');

  if (view === 'archive') {
    return (
      <div className={styles.app}>
        <ArchiveView
          tasks={state.data.tasks}
          lists={state.data.lists}
          confirmDelete={state.data.settings?.confirmBeforeDelete}
          onRestore={state.handleRestoreTask}
          onDelete={state.handleDeleteTask}
          onBack={() => setView('main')}
        />
      </div>
    );
  }

  if (view === 'weekly') {
    return (
      <div className={styles.app}>
        <WeeklyReport
          onGenerateWeekly={state.handleGenerateWeekly}
          onBack={() => setView('main')}
        />
      </div>
    );
  }

  if (view === 'data') {
    return (
      <div className={styles.app}>
        <DataPage
          data={state.data}
          onExport={state.handleExport}
          onExportCSV={state.handleExportCSV}
          onImport={state.handleImport}
          onBack={() => setView('main')}
        />
      </div>
    );
  }

  if (view === 'settings') {
    return (
      <div className={styles.app}>
        <Settings
          settings={state.data.settings}
          onUpdateSettings={state.handleUpdateSettings}
          onBack={() => setView('main')}
        />
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>{state.data.settings?.appTitle ?? 'Easy Todo'}</h1>
        <button
          className={styles.settingsBtn}
          onClick={() => setView('weekly')}
          title="周报"
        >
          <IconClipboard size={18} />
        </button>
        <button
          className={styles.settingsBtn}
          onClick={() => setView('archive')}
          title="归档任务"
        >
          <IconArchive size={18} />
        </button>
        <button
          className={styles.settingsBtn}
          onClick={() => setView('data')}
          title="数据管理"
        >
          <IconDownload size={18} />
        </button>
        <button
          className={styles.settingsBtn}
          onClick={() => setView('settings')}
          title="设置"
        >
          <IconSettings size={18} />
        </button>
      </header>

      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <ListManager
            lists={state.data.lists}
            activeListId={state.activeListId}
            taskCounts={getTaskCounts(state.data.tasks)}
            onSelect={state.setActiveListId}
            onAdd={state.handleAddList}
            onDelete={state.handleDeleteList}
            onRename={state.handleRenameList}
            onReorder={state.handleReorderList}
            confirmDelete={state.data.settings?.confirmBeforeDelete}
          />
        </aside>

        <main className={styles.main}>
          <SearchFilter
            filter={state.filter}
            allTags={state.allTags()}
            onChange={state.setFilter}
          />
          <TaskEditor onAdd={(title) => state.handleAddTask(state.activeListId, title)} />
          <div className={styles.taskListWrapper}>
            <TaskList
              tasks={state.filteredTasks()}
              lists={state.data.lists}
              defaultExpanded={state.data.settings?.taskDefaultExpanded}
              confirmDelete={state.data.settings?.confirmBeforeDelete}
              onToggle={state.handleToggleTask}
              onDelete={state.handleArchiveTask}
              onUpdate={state.handleUpdateTask}
              onReorder={(ids) => state.handleReorderTasks(state.activeListId, ids)}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

function getTaskCounts(tasks: { listId: string; completed: boolean; suspended: boolean; archived: boolean }[]): Record<string, { total: number; done: number; suspended: number }> {
  const counts: Record<string, { total: number; done: number; suspended: number }> = {};
  tasks.forEach((t) => {
    if (t.archived) return;
    if (!counts[t.listId]) counts[t.listId] = { total: 0, done: 0, suspended: 0 };
    counts[t.listId].total += 1;
    if (t.completed) counts[t.listId].done += 1;
    if (t.suspended) counts[t.listId].suspended += 1;
  });
  return counts;
}
