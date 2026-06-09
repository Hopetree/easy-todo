import type { AppData, ImportMode } from '@/types';

const FILE_PREFIX = 'easy-todo-backup';

// ============================================================
// 周报生成
// ============================================================
export function generateWeeklyText(data: AppData): string {
  const lines: string[] = [];
  lines.push('本周工作：');

  // 只显示有任务的列表
  let listIndex = 0;
  data.lists.forEach((list) => {
    const listTasks = data.tasks.filter((t) => t.listId === list.id && !t.archived);
    if (listTasks.length === 0) return;

    listIndex++;
    lines.push(`${listIndex}、${list.name}`);

    listTasks.forEach((task, i) => {
      lines.push(`${i + 1}）${task.title} (${task.progress}%)`);
    });
  });

  if (listIndex === 0) {
    lines.push('（暂无任务）');
  }

  return lines.join('\n');
}

// ============================================================
// 导出
// ============================================================
export function exportData(data: AppData): void {
  const payload: AppData = {
    ...data,
    exportedAt: new Date().toISOString(),
  };
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const a = document.createElement('a');
  a.href = url;
  a.download = `${FILE_PREFIX}-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============================================================
// 导入
// ============================================================
export function readImportFile(file: File): Promise<AppData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (!validateAppData(data)) {
          reject(new Error('文件格式不匹配：缺少必要字段或数据类型不正确'));
          return;
        }
        resolve(data as AppData);
      } catch {
        reject(new Error('文件解析失败：不是有效的 JSON 文件'));
      }
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file);
  });
}

export function applyImport(
  current: AppData,
  incoming: AppData,
  mode: ImportMode,
): AppData {
  if (mode === 'overwrite') {
    return { ...incoming, version: current.version };
  }
  // merge 模式: 追加不冲突的列表和任务
  const existingListIds = new Set(current.lists.map((l) => l.id));
  const existingTaskIds = new Set(current.tasks.map((t) => t.id));

  const newLists = incoming.lists.filter((l) => !existingListIds.has(l.id));
  const newTasks = incoming.tasks.filter((t) => !existingTaskIds.has(t.id));

  return {
    lists: [...current.lists, ...newLists],
    tasks: [...current.tasks, ...newTasks],
    version: current.version,
  };
}

// ============================================================
// 校验
// ============================================================
function validateAppData(data: unknown): data is AppData {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  if (!Array.isArray(d.lists)) return false;
  if (!Array.isArray(d.tasks)) return false;
  if (typeof d.version !== 'number') return false;
  return true;
}
