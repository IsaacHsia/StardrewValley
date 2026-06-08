# 赛博青哥 Wiki

> 基于财经博主「青枫浦上Q」全部公开内容的 AI 知识库 + 交易决策系统。
> 把你的 AI 助手变成赛博青哥。

---

## 这是什么

一套完整的投资辅助系统：
- **Wiki 知识库**：博主 2025.10~2026.05 全部方法论 + 121 天每日复盘 + 标的全追踪
- **选股脚本**：全市场粗筛 → 博主 F10 框架精筛 → 七轨布林线扫描
- **交易策略**：持仓诊断 + 开仓建议 + 做 T 策略 + 每日市场状态
- **AI 集成**：配套 skill 文件，AI 助手直接加载

---

## 快速开始（3 步）

### 1. 安装依赖

```bash
pip install mootdx requests pandas stockstats
```

> 需要国内 IP（mootdx 连通达信服务器）。

### 2. 安装 skill

把压缩包内的 `SKILL.md` 放到你的 AI 助手的 skill 目录：

| 助手 | skill 目录 |
|------|-----------|
| Claude Code | `~/.claude/skills/  /` |
| Codex | `~/.codex/skills/finance-wiki/` |
| Hanako | `C:\Users\{用户名}\.hanako\skills\finance-wiki\` |

然后说：「安装这个压缩包内的内容」。

skill 加载后，你的 AI 助手会拥有这些能力。

### 3. 告诉 AI 你的持仓

```
我的持仓：
- 网宿科技 成本 XX 元 XX 万
- XXXX 成本 XX 元 XX 万
- A 股现金 XX 万
```

---

## 怎么用

### 每日操作

```bash
# 每天 15:30 后跑（约 15-20 分钟）
cd 财经/scripts
python coarse_screen.py
python fine_screen.py
python daily_report.py
```

跑完后对 AI 说 **`sug`**，得到完整的交易策略报告。

### 消化博主的视频文字稿

把文字稿放到 `Raw/` 目录，对 AI 说 **`ing`**。

### 操作代号速查

| 你说 | AI 做什么 |
|------|----------|
| `ing` | 消化 Raw/ 中未处理的文字稿，更新 Wiki |
| `sug` | 持仓分析 + 大盘判断 + 开仓建议 + 仓位分配 |
| `qry {问题}` | 基于 Wiki 知识库回答 |
| `trk {标的}` | 拉取某只标的的博主全痕迹 |
| `chk` | Wiki 健康检查 |
| `rw` | 校对视频文字稿（修正语音识别错误） |

---

## 文件说明

```
赛博青哥wiki/
├── SKILL.md                 ← 核心：AI 助手的 skill 文件（必须安装）
├── 财经/
│   ├── schema.md            ← Wiki 操作规范
│   ├── trade_template.md    ← sug 回复模板
│   ├── Raw/                 ← 博主的全部原始文字稿（363 篇）
│   ├── Wiki/                ← 结构化知识库（132 页）
│   │   ├── 投资方法论/      ← 选股/仓位/风控/情绪周期/估值体系...
│   │   ├── 市场分析/        ← 大盘历史 + 板块轮动
│   │   ├── 每日复盘/        ← 121 天完整记录（含导航链）
│   │   ├── 博主/            ← 观点演进/标的总览/决策时间线/标的追踪
│   │   └── 数据/            ← 脚本输出目录
│   └── scripts/             ← Python 脚本
│       ├── coarse_screen.py ← 全市场粗筛
│       ├── fine_screen.py   ← 精筛 + 标的池 + 布林线 + 做T建议
│       └── daily_report.py  ← 市场状态日报
└── README.md                ← 本文件
```

---

## 选股逻辑

基于博主「青哥」的投资框架：

1. **粗筛**：全市场 5000 只 → PE>0、PB<10、市值>50亿、非极端异动 → ~2000 只
2. **精筛**：ROE>10%、毛利率>20%、PEG 排序 → ~15 只
3. **布林线**：七轨布林线扫描，标记收敛/N字二轨/破顶轨信号
4. **博主标的池**：单独跟踪博主本人推荐的核心标的

---

## 需要自己改的

- `trade_template.md`：持仓成本换成你自己的
- `fine_screen.py` 里的 `BLOGGER_STOCKS`：博主的标的池
- `fine_screen.py` 里的 `generate_zuot_tips()`：替换成你自己的持仓标的

---

## （可选）用 Obsidian 浏览 Wiki

安装 [Obsidian](https://obsidian.md)，打开 `财经/` 作为 vault。

Ctrl+G 打开 Graph view，能看到整个知识网络的连接关系。

---

## 致谢

- 博主「青枫浦上Q」的内容体系
- [Andrej Karpathy 的 LLM Wiki 理念](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
- [a-stock-data](https://github.com/simonlin1212/a-stock-data) A 股数据接口



## 更新

---



#### 转录视频命令

---



```
自动转录命令
后续转录 16 个视频的操作

  你只需要在终端里运行一条命令：

  cd D:\BaiduNetdiskDownload\赛博青哥wiki
  python 财经/scripts/transcribe_videos.py --from-date 2026-05-14

  会发什么事

  1. 脚本自动列出 0514 之后的所有视频（约 16 个）
  2. 逐个下载音频 → whisper 转录 → 生成 .md 文件
  3. 每个视频生成两部分：原始文字 + 摘要总结

  时间预估

  ┌──────────────────┬───────────────┐
  │       项目       │     估计      │
  ├──────────────────┼───────────────┤
  │ 单个 15 分钟视频 │ ~4 分钟转录   │
  ├──────────────────┼───────────────┤
  │ 单个 30 分钟视频 │ ~8 分钟转录   │
  ├──────────────────┼───────────────┤
  │ 全部 16 个视频   │ 约 1.5-2 小时 │
  └──────────────────┴───────────────┘

  转录完成后

  转录的 .md 文件会保存在 财经/Raw/ 目录下。你对 AI 说 ing 即可将它们消化进 Wiki 知识库。

  其他用法

  # 只预览不转录
  python 财经/scripts/transcribe_videos.py --dry-run --from-date 2026-05-14

  # 只转录某一个视频
  python 财经/scripts/transcribe_videos.py --id 某个动态ID

  # 转录全部视频（不限日期）
  python 财经/scripts/transcribe_videos.py

  # 用更大的模型（更准确但更慢）
  python 财经/scripts/transcribe_videos.py --model medium --from-date 2026-05-14

  ▎ ⚠️ 注意：首次运行会自动下载 whisper small 模型（~1.5GB），之后不再下载。脚本会自动找到 ffmpeg（已通过 winget
  ▎ 安装）。
```





#### 抓取动态命令



```
快捷抓取命令

  以后想抓最新动态，两种方式：

  # 方式1：双击文件
  D:\BaiduNetdiskDownload\赛博青哥wiki\fetch_latest.bat

  # 方式2：命令行（可指定日期）
  cd D:\BaiduNetdiskDownload\赛博青哥wiki
  python 财经/scripts/fetch_blogger.py                    # 默认抓最近2天
  python 财经/scripts/fetch_blogger.py --from 2026-06-01  # 指定起始日期

  脚本已改为默认抓取最近2天，直接运行不传参数即可。
```



### qry的正确方式

```
 以后 qry 的正确方式

  你问「明天买什么」时，我应该做的不是复述清枫看好什么方向，而是：

  1. 拉出清枫当前主线的所有标的
  2. 检查谁涨了、谁没涨、谁回调到位了
  3. 筛选：主线内 + 近期调整过 + 今天没涨 + PE合理 + 你能买
  4. 给你候选，而不是给你方向

  这才是「基于清枫框架+观察市场结构」的正确做法。 我昨天跳过了步骤 2 和 3，直接从清枫的一句话跳到了推荐。这是偷懒。
```

