# 用 AI CLI 模式全面接管游戏引擎工程的实战指南

下面是一套完整方案，帮你让 AI（CodeBuddy CLI / Claude Code / Gemini CLI 等）以**命令行模式**深度接管你的 Godot（或 Unity/UE）工程，按设计意图自动改代码、改场景、改资源。

---

## 一、核心思路：把"工程文件夹"变成 AI 的工作区

所有主流游戏引擎的工程本质都是**文本化可读文件**，这正是 CLI AI 的强项：

|引擎|AI 可直接读写的关键文件|
|---|---|
|**Godot 4.x**|`.gd`（脚本）、`.tscn`（场景，纯文本）、`.tres`（资源）、`project.godot`|
|**Unity**|`.cs` 脚本、`.prefab` / `.unity` / `.asset`（YAML 文本）、`ProjectSettings/*.asset`|
|**Unreal**|`.cpp`/`.h`、`.uproject`、`Config/*.ini`、Blueprint 需导出为文本|

> ✅ 结论：只要让 AI CLI 以你的工程根目录为 `cwd`，它就能像人类程序员一样增删改查**所有工程文件**。

---

## 二、落地步骤（以 CodeBuddy CLI / Claude Code 为例）

### 1. 启动 CLI 并指向工程根目录

**powershell**

复制

```powershell
cd C:\Users\isaacxia\CodeBuddy\你的游戏工程
codebuddy            # 或 claude / gemini
```

此时 AI 的读写范围 = 整个工程。

### 2. 在工程根建立一份「AI 规则文件」

这是最关键的一步。创建 `CLAUDE.md` 或 `.codebuddy/rules.md`：

**markdown**

复制

```markdown
# 项目规则（AI 必须严格遵守）

## 引擎与语言
- Godot 4.3 + GDScript
- 所有脚本头部必须标注：# Engine: Godot 4.3  # Language: GDScript

## 架构约定（不可违反）
1. 全局状态 → 只通过 GameManager（autoload）访问
2. 存档读写 → 只通过 SaveManager
3. UI 显示/隐藏/切换 → 只通过 UIManager
4. 相似场景复用同一套逻辑，禁止重复实现
5. 每个函数必须有注释；关键分支要有解释

## 场景文件（.tscn）编辑约束
- ❌ 禁止修改节点的 anchor / offset / position / size / margin
- ✅ 只允许改 text、script、signal、脚本导出变量
- 修改前必须先 read_file 确认当前布局

## 设计目标（按需写入）
- 玩法：横版 roguelike
- 核心循环：进入房间 → 战斗 → 掉落 → 选择强化 → 下一房间
- ...
```

AI CLI 每轮对话都会自动读取这份文件，**等于给它装上了项目宪法**。

### 3. 用「设计文档」驱动 AI，而不是零散指令

在工程内建一个 `design/` 目录：

```
design/
├─ 01_gameplay.md       # 玩法设计
├─ 02_systems.md        # 系统拆解（战斗/背包/存档…）
├─ 03_scenes.md         # 场景清单与跳转
├─ 04_data_schema.md    # 数据结构（武器/敌人/关卡）
└─ todo.md              # 当前迭代任务
```

然后一句话就能驱动 AI：

> "读取 `design/02_systems.md` 的『背包系统』章节，在 `scripts/systems/` 下新建 `InventoryManager.gd`，注册为 autoload，并在 `UIManager` 中暴露 `show_inventory()` 接口，遵守 rules.md。"

AI 会自动：查文件 → 读规则 → 改脚本 → 改 `project.godot` 注册 autoload → 跑 lint。

### 4. 让 AI 能「自己验证」——接上命令行运行

在 `CLAUDE.md` 里告诉它可用命令：

**markdown**

复制

```markdown
## 可执行命令
- 运行工程（headless 跑一帧自检）：
  godot --headless --quit
- 运行单个测试场景：
  godot --headless res://tests/test_inventory.tscn
- 导出检查：
  godot --headless --export-debug "Windows Desktop" build/game.exe
```

AI 改完代码后会**主动调用这些命令验证**，报错了自己修，形成闭环。

### 5. 用 Git 做安全网

**powershell**

复制

```powershell
git init
git add . && git commit -m "baseline"
```

每次让 AI 干活前：

> "开新分支 `feat/inventory`，做完自测通过再停下来等我 review。"

出问题随时 `git reset --hard`，0 风险。

---

## 三、让 AI 真正「接管」的三个进阶技巧

### ① 用 TODO 文件做长任务编排

在 `design/todo.md` 写清楚分步任务，指令只需：

> "按 `design/todo.md` 的顺序推进，做完一项打勾，遇到模糊的地方先停下来问我。"

### ② 用 Skill / Subagent 处理引擎专属知识

CodeBuddy 里可以加载 **Godot Dev Guide** skill，它内置了 `.tscn` 格式、信号系统、导出规范等，AI 改场景文件不会乱。

### ③ 建立「禁改清单」

在 `rules.md` 里列出绝对不能动的文件，例如：

```
## 禁止直接修改（需人工确认）
- scenes/MainUI.tscn 的根节点布局
- project.godot 的 [display] 区块
- addons/ 下的第三方插件
```

---

## 四、典型一句话指令模板

| 你要干的事 | 一句话喂给 AI                                                                     |
| ----- | ---------------------------------------------------------------------------- |
| 加新系统  | 「按 `design/02_systems.md` 实现存档系统，autoload 注册为 SaveManager，写 3 个单测场景」         |
| 改玩法数值 | 「把所有敌人的血量配置抽出到 `data/enemies.tres`，代码从 tres 读取，不要硬编码」                        |
| 重构    | 「把 `Player.gd` 里 UI 相关调用全部迁移到 `UIManager`，保持行为一致」                            |
| 修 bug | 「运行 `godot --headless` 贴报错给你看，自己定位并修复」                                       |
| 生成关卡  | 「按 `design/levels/level_02.md` 的描述生成 `scenes/levels/Level02.tscn`，不要改已有节点布局」 |

---

## 五、一句话总结

> **把工程目录 = AI 的工作台，把 `rules.md` = 项目宪法，把 `design/` = 需求来源，把 Git = 后悔药，把 `godot --headless` = AI 自测工具**——AI CLI 就能 7×24 按你的设计意图全面接管工程。