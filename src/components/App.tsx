import { useAppState } from '@/hooks/useAppState';
import { ListManager } from './ListManager';
import { TaskList } from './TaskList';
import { TaskEditor } from './TaskEditor';
import { SearchFilter } from './SearchFilter';
import { ImportExport } from './ImportExport';
import styles from './App.module.css';

export function App() {
  const state = useAppState();

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Easy Todo</h1>
        <ImportExport
          data={state.data}
          onExport={state.handleExport}
          onImport={state.handleImport}
        />
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
          />
        </aside>

        <main className={styles.main}>
          <SearchFilter
            filter={state.filter}
            allTags={state.allTags()}
            onChange={state.setFilter}
          />
          <TaskEditor onAdd={(title) => state.handleAddTask(state.activeListId, title)} />
          <TaskList
            tasks={state.filteredTasks()}
            lists={state.data.lists}
            onToggle={state.handleToggleTask}
            onDelete={state.handleDeleteTask}
            onUpdate={state.handleUpdateTask}
          />
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
