# CLAUDE.md

## Wiki Knowledge Management System

Based on [Karpathy's LLM Wiki Design](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)

---

## Architecture

### Three Layers

1. **Raw Sources** → `raw/` - Immutable collection of articles, papers, images, data
2. **The Wiki** → `Wiki/` - LLM-generated markdown (summaries, entities, concepts, synthesis)
3. **The Schema** → `CLAUDE.md` - This file, defining structure and conventions

---

## Folder Structure

```
.
├── Wiki/                      # Wiki content (git-tracked)
│   ├── index.md               # Content-oriented catalog
│   ├── log.md                 # Chronological append-only record
│   ├── tech-{name}/          # Technical patterns
│   ├── team-{name}/          # Organizational knowledge
│   ├── project-{name}/        # Project-specific patterns
│   ├── process-{name}/        # Workflows and processes
│   ├── synthesis/             # Cross-domain insights
│   └── dashboards/           # Markdown-first dashboards
├── Wiki-inbox/               # Personal drop zone (not git-tracked)
├── Worklogs/                 # Task artifacts (raw layer)
├── Projects/                 # Code artifacts (raw layer)
└── raw/                      # Source materials (raw layer)
    ├── assets/               # Downloaded images
    └── sources/              # Ingested documents
```

---

## Naming Convention

Folders: `{category}-{name}`
- `tech-bigquery/`, `tech-transformers/`
- `team-engineering/`, `team-design/`
- `project-launch/`, `project-migration/`
- `process-onboarding/`, `process-code-review/`

---

## Frontmatter Schema

```yaml
---
title: Title
tags: [tag1, tag2]
date: YYYY-MM-DD
source-count: N
confidence: high|medium|speculative
status: active|superseded|archived
open-questions:
  - unanswered question
contradictions:
  - Source A says X, Source B says Y
---
```

---

## Core Operations

### Ingest
1. Drop new source in `Wiki-inbox/` or `raw/sources/`
2. LLM reads and analyzes
3. Discuss takeaways
4. Write summary to appropriate Wiki folder
5. Update `Wiki/index.md`
6. Update relevant entity/concept pages
7. Append to `Wiki/log.md`

### Query
1. Search relevant Wiki pages
2. Read and synthesize
3. Cite sources
4. File valuable outputs back into Wiki

### Lint
- Check for contradictions
- Flag stale claims
- Find orphan pages
- Verify cross-references
- Identify data gaps

---

## Key Principles

- The wiki is a **persistent, compounding artifact**
- Cross-references already exist; contradictions flagged; synthesis reflects all sources
- The LLM does **summarizing, cross-referencing, filing, and bookkeeping**
- `index.md` and `log.md` are the two **special files** for navigation
- The wiki is just a **git repo** — version history, branching, collaboration come free

---

## Workflow Prompts

### Ingest New Source
```
Analyze this source and create appropriate Wiki entries:
1. Create summary in relevant category folder
2. Update index.md with new entry
3. Add to log.md
4. Link to/from related pages
```

### Query Knowledge
```
Search the Wiki for relevant information, synthesize an answer,
and cite sources. File valuable insights back into the Wiki.
```

### Lint Wiki
```
Run health-check:
- Find orphan pages (unlinked pages)
- Flag contradictions and stale content
- Check for missing cross-references
- Verify frontmatter completeness
```

---

# 中文翻译

## Wiki 知识管理系统

基于 [Karpathy 的 LLM Wiki 设计](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)

---

## 架构

### 三层结构

1. **原始资料** → `raw/` - 不可变的文章、论文、图片、数据集合
2. **Wiki** → `Wiki/` - LLM 生成的 Markdown（摘要、实体、概念、综合）
3. **模式定义** → `CLAUDE.md` - 本文件，定义结构和约定

---

## 目录结构

```
.
├── Wiki/                      # Wiki 内容（纳入 git 版本管理）
│   ├── index.md               # 面向内容的目录
│   ├── log.md                 # 按时间顺序追加的记录
│   ├── tech-{name}/          # 技术模式
│   ├── team-{name}/          # 组织知识
│   ├── project-{name}/        # 项目特定模式
│   ├── process-{name}/        # 工作流和流程
│   ├── synthesis/             # 跨领域洞察
│   └── dashboards/           # Markdown 优先的面板
├── Wiki-inbox/               # 个人暂存区（不纳入 git）
├── Worklogs/                 # 任务产物（原始层）
├── Projects/                 # 代码产物（原始层）
└── raw/                      # 源材料（原始层）
    ├── assets/               # 下载的图片
    └── sources/              # 已摄取的文件
```

---

## 命名规范

目录格式：`{类别}-{名称}`
- `tech-bigquery/`、`tech-transformers/`
- `team-engineering/`、`team-design/`
- `project-launch/`、`project-migration/`
- `process-onboarding/`、`process-code-review/`

---

## Frontmatter 结构

```yaml
---
title: 标题
tags: [标签1, 标签2]
date: YYYY-MM-DD
source-count: N
confidence: high|medium|speculative
status: active|superseded|archived
open-questions:
  - 未解答的问题
contradictions:
  - 来源A 说 X，来源B 说 Y
---
```

---

## 核心操作

### 摄取
1. 将新来源放入 `Wiki-inbox/` 或 `raw/sources/`
2. LLM 读取并分析
3. 讨论要点
4. 将摘要写入对应的 Wiki 目录
5. 更新 `Wiki/index.md`
6. 更新相关实体/概念页面
7. 追加到 `Wiki/log.md`

### 查询
1. 搜索相关 Wiki 页面
2. 阅读并综合
3. 引用来源
4. 将有价值的产出归档回 Wiki

### 检查
- 检查矛盾点
- 标记过时声明
- 查找孤立页面
- 验证交叉引用
- 识别数据缺口

---

## 核心原则

- Wiki 是一个**持续积累、复利增长的知识产物**
- 交叉引用已建立；矛盾已标记；综合内容反映所有来源
- LLM 负责**摘要、交叉引用、归档和记录**
- `index.md` 和 `log.md` 是两个用于导航的**特殊文件**
- Wiki 本质上就是一个 **git 仓库**——版本历史、分支、协作都是免费附带的

---

## 工作流提示词

### 摄取新来源
```
分析此来源并创建合适的 Wiki 条目：
1. 在相关类别目录中创建摘要
2. 更新 index.md 添加新条目
3. 添加到 log.md
4. 链接到/自相关页面
```

### 查询知识
```
搜索 Wiki 中的相关信息，综合形成答案，
并引用来源。将有价值的洞察归档回 Wiki。
```

### 检查 Wiki
```
运行健康检查：
- 查找孤立页面（未被链接的页面）
- 标记矛盾点和过时内容
- 检查缺失的交叉引用
- 验证 frontmatter 完整性
```
