import { useState } from 'react';
import type { AppView } from '@/types';
import { useAppState } from '@/hooks/useAppState';
import { ListManager } from './ListManager';
import { TaskList } from './TaskList';
import { TaskEditor } from './TaskEditor';
import { SearchFilter } from './SearchFilter';
import { Settings } from './Settings';
import styles from './App.module.css';

export function App() {
  const state = useAppState();
  const [view, setView] = useState<AppView>('main');

  if (view === 'settings') {
    return (
      <div className={styles.app}>
        <Settings
          settings={state.data.settings}
          data={state.data}
          onUpdateSettings={state.handleUpdateSettings}
          onExport={state.handleExport}
          onGenerateWeekly={state.handleGenerateWeekly}
          onImport={state.handleImport}
          onBack={() => setView('main')}
        />
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Easy Todo</h1>
        <button
          className={styles.settingsBtn}
          onClick={() => setView('settings')}
          title="设置"
        >
          ⚙
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
              onDelete={state.handleDeleteTask}
              onUpdate={state.handleUpdateTask}
              onReorder={(ids) => state.handleReorderTasks(state.activeListId, ids)}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

function getTaskCounts(tasks: { listId: string; completed: boolean }[]): Record<string, { total: number; done: number }> {
  const counts: Record<string, { total: number; done: number }> = {};
  tasks.forEach((t) => {
    if (!counts[t.listId]) counts[t.listId] = { total: 0, done: 0 };
    counts[t.listId].total += 1;
    if (t.completed) counts[t.listId].done += 1;
  });
  return counts;
}
