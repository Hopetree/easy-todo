# Easy Todo

浏览器插件 TODO 管理器，支持多列表、搜索筛选、JSON 导入导出。

## 技术栈

- **WXT** — 浏览器插件框架，Manifest V3
- **React 18** + **TypeScript**
- **CSS Modules** — 样式隔离
- **localStorage** — 本地数据持久化

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式（热更新）
npm run dev

# 生产构建
npm run build
```

构建产物在 `dist/chrome-mv3/`，加载方式：

1. 打开 `chrome://extensions/`
2. 开启「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择 `dist/chrome-mv3/` 目录

## 设计文档

| 文档 | 说明 |
|------|------|
| [PRD 产品需求规格](docs/design/01_PRD_产品需求规格说明书.md) | 用户故事、核心功能、功能边界 |
| [TDD 技术架构设计](docs/design/02_TDD_技术架构设计文档.md) | 技术选型、模块划分、数据模型 |
| [Code Review 报告](docs/code-review.md) | 代码审查问题跟踪 |
