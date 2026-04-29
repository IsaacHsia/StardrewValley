---
title: AI CLI 游戏引擎工程接管方案
tags: [AI, CLI, game-engine, Godot, Unity, Unreal, workflow, dev-tools]
date: 2026-04-29
source-count: 1
confidence: high
status: active
open-questions:
  - 不同 AI CLI (CodeBuddy / Claude Code / Gemini CLI) 在游戏引擎场景下的实际表现差异
  - 如何让 AI 安全编辑 .tscn 场景文件而不破坏 UI 布局
contradictions: []
---

# AI CLI 游戏引擎工程接管方案

## 来源

- `raw/assets/AI CLI使用方案.md` — 用 AI CLI 模式全面接管游戏引擎工程的实战指南

## 核心思路

所有主流游戏引擎的工程文件本质上是**文本化可读文件**，AI CLI 可以直接读写和修改：

| 引擎 | AI 可直接读写的关键文件 |
|------|----------------------|
| **Godot 4.x** | `.gd`（脚本）、`.tscn`（场景纯文本）、`.tres`（资源）、`project.godot` |
| **Unity** | `.cs` 脚本、`.prefab` / `.unity` / `.asset`（YAML 文本）、`ProjectSettings/*.asset` |
| **Unreal** | `.cpp` / `.h`、`.uproject`、`Config/*.ini` |

## 落地步骤

### 1. 启动 CLI 并指向工程根目录
以游戏工程根目录为 `cwd` 启动 AI CLI，实现对完整工程文件的读写权限。

### 2. 建立规则文件（项目宪法）
在工程根目录创建 `CLAUDE.md` 或 `.codebuddy/rules.md`，包含：
- 引擎与语言声明（如 `Godot 4.3 + GDScript`）
- 架构约定（全局状态、存档、UI 等访问路径）
- 场景文件编辑约束（禁止改布局，只允许改 text / script / signal）
- 设计目标与可执行命令（供 AI 自测）

### 3. 设计文档驱动
建立 `design/` 目录，按模块编写玩法、系统、场景、数据结构的文档。AI 读取后按文档自动实现。

### 4. 自测闭环
在规则文件中写入可执行命令，AI 改完代码后主动调用验证，报错自行修复。

```
godot --headless --quit                                # 跑一帧自检
godot --headless res://tests/test_inventory.tscn       # 运行单个测试场景
```

### 5. Git 安全网
- 初始化 git 并提交 baseline
- 每次任务开新分支
- 出问题随时 `git reset --hard`

## 进阶技巧

| 技巧 | 说明 |
|------|------|
| **TODO 任务编排** | 在 `design/todo.md` 写分步任务，AI 逐项推进打勾 |
| **Skill / Subagent** | 加载引擎专属知识（如 Godot Dev Guide），避免 AI 乱改场景文件 |
| **禁改清单** | 在规则文件中列出绝对不能动的文件（根节点布局、第三方插件等） |

## 一句话指令模板

| 场景 | 指令 |
|------|------|
| 加新系统 | 「按 `design/02_systems.md` 实现存档系统，autoload 注册为 SaveManager，写 3 个单测场景」 |
| 改数值 | 「把所有敌人的血量配置抽出到 `data/enemies.tres`，代码从 tres 读取」 |
| 重构 | 「把 `Player.gd` 里 UI 相关调用全部迁移到 `UIManager`」 |
| 修 Bug | 「运行 `godot --headless` 贴报错，自己定位并修复」 |
| 生成关卡 | 「按 `design/levels/level_02.md` 生成 `Level02.tscn`，不要改已有节点布局」 |

## 一句话总结

> 工程目录 = AI 的工作台，rules.md = 项目宪法，design/ = 需求来源，Git = 后悔药，`godot --headless` = AI 自测工具。
