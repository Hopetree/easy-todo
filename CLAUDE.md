# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用命令

```bash
npm run dev           # 开发模式（热更新，Chrome）
npm run dev:firefox   # 开发模式（Firefox）
npm run build         # 生产构建 → dist/chrome-mv3/
npm run build:zip     # 生产构建 + 打包 zip
npm run typecheck     # TypeScript 类型检查
```

加载插件：Chrome 打开 `chrome://extensions/` → 开发者模式 → 加载已解压 → 选择 `dist/chrome-mv3/`。

## 技术栈

- **WXT** (`wxt`) — 浏览器插件框架，Manifest V3，内置 Vite 构建
- **React 18** + **TypeScript 5**，路径别名 `@/` → `./src/`
- **CSS Modules** — 样式隔离，无第三方 UI 库
- **localStorage** — 唯一的数据持久化方式，key 为 `easy-todo-data`

## 架构概览

```
entrypoints/popup/           # 插件入口（仅 popup 模式，无 background/content script）
  └─ main.tsx → App.tsx
                  ├── ListManager      # 侧边栏：列表的创建/切换/重命名/删除
                  ├── TaskEditor       # 顶部：快速添加任务
                  ├── SearchFilter     # 关键词搜索 + 优先级/状态/标签筛选
                  ├── TaskList         # 任务列表（含 TaskItem 行内编辑）
                  └── ImportExport     # JSON 导入/导出（合并或覆盖）
hooks/useAppState.ts         # 全局唯一状态管理（无 Router，无 Context）
services/storage.ts          # localStorage 读写 + 不可变原子操作（addList, updateTask 等）
services/importExport.ts     # 文件导出/导入/校验/合并策略
types/index.ts               # TodoTask, TodoList, AppData, FilterOptions 等类型
```

## 数据流

1. `useAppState` 初始化时从 `localStorage` 加载 `AppData`
2. 所有操作通过 hook 返回的 handler（`handleAddTask`, `handleToggleTask` 等）修改状态
3. `services/storage.ts` 的函数返回**新对象**（不可变），由 `useAppState` 的 `setData` 更新
4. `useEffect` 监听 `data` 变化，自动 debounce 300ms 写入 localStorage
5. 导入时写入模式：`merge`（追加不冲突的 ID）或 `overwrite`（完全替换）

## 数据版本

`AppData.version` 当前为 `1`。`loadData()` 中通过检查 `version` 字段进行迁移——无 `version` 的旧数据走 `migrateFrom0()` 补全 `priority`/`tags`/`note` 字段。

## 关键约定

- 所有 ID 使用 `crypto.randomUUID()` 生成（回退到时间戳+随机串）
- 时间格式统一为 ISO 字符串 (`.toISOString()`)
- `wxt.config.ts` 中 `srcDir: 'src'`, `outDir: 'dist'`, `publicDir: 'src/public'`
- 图标放置在 `src/public/icons/`，构建时自动复制到 dist 根目录
