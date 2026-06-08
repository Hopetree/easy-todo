# 02_TDD_技术架构设计文档

**项目名称**：Easy Todo

---

## 一、技术栈

| 层级 | 选型 | 说明 |
|------|------|------|
| 前端框架 | React 18+ | 组件化开发，状态管理清晰 |
| 开发语言 | TypeScript | 类型安全，减少运行时错误 |
| 插件框架 | WXT | 专为浏览器插件设计，原生支持 React + Manifest V3 |
| 构建工具 | Vite（WXT 内置） | 快速 HMR，生产构建自动压缩 |
| 样式方案 | CSS Modules | 按需引入，无第三方依赖 |
| 数据存储 | localStorage | 容量满足 TODO 数据需求，API 简洁 |
| 导出格式 | JSON | 通用格式，便于备份和跨平台 |

---

## 二、系统架构

### 2.1 整体架构图

```
┌─────────────────────────────────────────────┐
│                  Easy Todo                    │
├─────────────────────────────────────────────┤
│  Popup (插件弹窗)                             │
│  ┌─────────────────────────────────────┐     │
│  │  React App                           │     │
│  │  ┌─────────┐ ┌──────────┐ ┌───────┐ │     │
│  │  │列表管理  │ │任务列表   │ │搜索筛 │ │     │
│  │  │Sidebar  │ │TaskList  │ │选面板 │ │     │
│  │  └─────────┘ └──────────┘ └───────┘ │     │
│  │  ┌──────────────────────────────┐   │     │
│  │  │  导入/导出工具栏              │   │     │
│  │  └──────────────────────────────┘   │     │
│  └─────────────────────────────────────┘     │
│                      │                        │
│  ┌───────────────────┴──────────────────┐     │
│  │         Storage Service              │     │
│  │  ┌─────────┐  ┌──────────────────┐   │     │
│  │  │ localStorage │  Import/Export  │   │     │
│  │  └─────────┘  └──────────────────┘   │     │
│  └─────────────────────────────────────┘     │
└─────────────────────────────────────────────┘
```

### 2.2 模块划分

| 模块 | 职责 | 关键文件 |
|------|------|---------|
| **App Shell** | 应用根组件，路由/布局 | `App.tsx` |
| **ListManager** | 列表的创建、切换、重命名、删除 | `components/ListManager/` |
| **TaskList** | 任务列表渲染、CRUD 操作 | `components/TaskList/` |
| **TaskEditor** | 任务创建/编辑表单（含属性面板） | `components/TaskEditor/` |
| **SearchFilter** | 关键词搜索 + 字段筛选组合 | `components/SearchFilter/` |
| **ImportExport** | 数据导出 JSON / 导入 JSON | `components/ImportExport/` |
| **Storage Service** | localStorage 读写封装 | `services/storage.ts` |
| **ImportExport Service** | 文件读写、数据校验、合并策略 | `services/importExport.ts` |

---

## 三、数据模型

```typescript
// 任务
interface TodoTask {
  id: string;               // UUID
  listId: string;           // 所属列表 ID
  title: string;            // 任务标题
  completed: boolean;       // 完成状态
  priority: 'high' | 'medium' | 'low';
  dueDate: string | null;   // ISO 日期字符串
  tags: string[];           // 标签列表
  note: string;             // 备注
  createdAt: string;        // 创建时间
  updatedAt: string;        // 更新时间
}

// 列表
interface TodoList {
  id: string;               // UUID
  name: string;             // 列表名称
  color: string;            // 列表标识色
  createdAt: string;
  sortOrder: number;        // 排序序号
}

// 应用全局状态
interface AppData {
  lists: TodoList[];
  tasks: TodoTask[];
  version: number;          // 数据版本号
  exportedAt?: string;      // 最后导出时间
}
```

---

## 四、数据存储方案

- **存储位置**：`localStorage`
- **存储 Key**：`easy-todo-data`
- **存储内容**：`AppData` 对象的 JSON 序列化结果
- **读写策略**：
  - 应用启动时一次性加载到 React 状态
  - 状态变更时自动同步写入 localStorage（debounce 300ms）
  - 导入时根据用户选择合并或覆盖

---

## 五、导入/导出方案

**导出流程**：
1. 从状态中读取完整 `AppData`
2. 填充 `exportedAt` 时间戳
3. 序列化为 JSON 并通过 `Blob` + `URL.createObjectURL` 触发下载
4. 文件名格式：`easy-todo-backup-<YYYYMMDD>.json`

**导入流程**：
1. 用户选择 JSON 文件（`<input type="file">`）
2. 读取并解析，校验数据结构合法性
3. 弹出选项：**合并**（追加不冲突的列表/任务）或 **覆盖**（清空后写入）
4. 执行后刷新应用状态

---

## 六、Manifest V3 配置要点

```json
{
  "manifest_version": 3,
  "name": "Easy Todo",
  "version": "1.0.0",
  "action": {
    "default_popup": "index.html",
    "default_title": "Easy Todo"
  },
  "permissions": [
    "storage"
  ]
}
```

- **Popup 模式**：点击工具栏图标弹出窗口，无需 Background Service Worker 或 Content Script
- **权限最小化**：当前方案仅使用 localStorage，无需额外 Chrome 权限

---

## 七、目录结构

```
easy-todo/
├── src/
│   ├── components/
│   │   ├── App.tsx
│   │   ├── ListManager/
│   │   │   └── index.tsx
│   │   ├── TaskList/
│   │   │   ├── index.tsx
│   │   │   └── TaskItem.tsx
│   │   ├── TaskEditor/
│   │   │   └── index.tsx
│   │   ├── SearchFilter/
│   │   │   └── index.tsx
│   │   └── ImportExport/
│   │       └── index.tsx
│   ├── services/
│   │   ├── storage.ts
│   │   └── importExport.ts
│   ├── types/
│   │   └── index.ts
│   ├── hooks/
│   │   └── useAppState.ts
│   └── main.tsx
├── public/
│   └── icons/
├── wxt.config.ts
├── package.json
└── tsconfig.json
```
