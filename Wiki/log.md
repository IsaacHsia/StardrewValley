---
title: Wiki Log
description: Chronological append-only record of wiki activity
---

# Wiki Log

> Parseable with: `grep "^## \[" log.md | tail -20`

---

## [YYYY-MM-DD] init | Wiki initialized

- Created wiki structure based on LLM Wiki Knowledge Management System design
- Source: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f

## [2026-04-10] init | Initial wiki setup

- Established folder structure following three-layer architecture
- Created schema file (CLAUDE.md) for conventions and workflows

## [2026-05-28] ingest | 5.28 A股收盘分析 — V型修复与聚焦度博弈

- Source: `A股/开盘收盘分析/5.28收盘.md`
- Raw asset: `raw/assets/5.28收盘分析.md`
- Created `Wiki/project-a-stock/2026-05-28-收盘.md` — V型修复定性、两大验证点、六大主线全景
- Key topics: CPU自研主题（ST得润/万通数渡）、CPO盘面核心（易中天创新高）、上游涨价链扩散路径、液冷cage三标的、AWS Bedrock TaaS模式
- New catalysis: 字节跳动自研CPU、中国拟开发AI token期货、SemiAnalysis Bedrock深度
- Extracted 40+ 专业术语增量注解 (盘面结构/AI产业链/制造工艺/宏观商业模式/操作风控)
- Updated `Wiki/index.md` with entries under Concepts, Sources, Projects
- Cross-linked: ← 前日5.27情绪周期起点 → 聚焦度验证

## [2026-05-27] ingest | 5.27 A股收盘分析 — 新一轮情绪周期起点

- Source: `A股/开盘收盘分析/5.27收盘.md`
- Raw asset: `raw/assets/5.27收盘分析.md`
- Created `Wiki/project-a-stock/2026-05-27-收盘.md` — 盘面定性、两种情景推演、六大AI主线方向
- Key topics: 情绪周期切换、AI供电三剑客（超级电容/纳米晶/SST）、新技术补涨分支、硬逻辑方向
- Extracted 40+ 专业术语注解 (盘面情绪/市场结构/技术形态/AI科技/产业链)
- Updated `Wiki/index.md` with entries under Concepts
- Cross-linked: 情绪周期、补涨分支、韬定律、AI供电三剑客

## [2026-06-22] ingest | 58种老物件小红书视频 → 场景独占产品观

- Source: `raw/xhs/2026-06-22 58种老物件.md`（小红书 · 摸鱼创意 · 视频转录）
- Created `Wiki/synthesis/scene-monopoly.md` — 场景独占作为产品壁垒的另一种范式
- Core insight: 产品的真正壁垒不一定是技术领先，可能是成为用户某段人生中「唯一的解法」
- Key concepts: 时间独占 / 渠道独占 / 仪式独占；「更好」的陷阱 — 仅比竞品好20%不足以打破场景独占
- Cross-linked: ← 58种老物件原始帖子（xhs提取 + Whisper转录）
- First xhs-sourced Wiki entry; marks expansion of Wiki ingestion pipeline beyond A股 analysis

## [2026-06-27] ingest | 黑暗之魂3 洛斯里克高墙 关卡拆解② — 高墙深处

- Source: `raw/游戏素材/黑暗之魂3洛斯里克高墙2：高墙深处.md`（Bilibili · Ymagine · 视频转录）
- Created `Wiki/tech-game-level-design/ds3-lothric-high-wall-2.md` — 关卡设计深度拆解
- Key topics: 高墙边塔/人脓屋顶/餐厅/肥仔广场/返程捷径五大区块，包含 20+ 关卡设计手法详解
- Core thesis: "关卡是会呼吸的" — 心流理论、3D恶魔城空间连通性、方向感模糊→捷径惊艳
- Design patterns cataloged: 视觉引导/敌人引导/空间引导/心理节奏/路线控制 五大类
- Updated `Wiki/index.md` with entries under Technical Patterns, Sources
- Cross-linked: → Part 1（高墙前期）[[ds3-lothric-high-wall-1]]

## [2026-06-27] ingest | 黑暗之魂3 洛斯里克高墙 关卡拆解① — 高墙前期

- Source: `raw/游戏素材/黑暗之魂3洛斯里克高墙1：高墙前期.md`（Bilibili · Ymagine · 视频转录）
- Created `Wiki/tech-game-level-design/ds3-lothric-high-wall-1.md` — 关卡设计深度拆解（Part 1）
- Key topics: 初始之塔 POI 系统、龙石塔教学闭环（提灯哥→实践→奖励）、火龙塔非强制锁钥解谜、高墙边塔多层引导
- Core thesis: 高墙是「新手保姆」——通过 POI 兴趣点、光影引导、教学式战斗编排、偷袭时机控制完成游戏基础语法教学
- Key discoveries: 追光源解包实锤（FromSoftware 刻意在楼梯口放置）、偷袭时机 = 心理防御最低点、洪七公理论（道具给予匹配即将面临的挑战）
- Cross-linked: → Part 2（高墙深处）[[ds3-lothric-high-wall-2]]

## [2026-06-27] ingest | 关卡策划入门 — 行业路径、作品集与设计方法论

- Source: `策划培训/温润祺培训/Lesson 2：关卡策划入门.md`（温润祺培训课件）
- Created `Wiki/tech-game-level-design/level-design-primer.md` — 关卡策划入门方法论
- Key topics: 单机买断制 vs 商业化手游（GaaS）行业路径对比、关卡策划作品集五大模块、设计草稿六步法（以 Half-Life 2 逃脱关为例）
- Core thesis: 关卡策划核心能力不是「会做地图」而是「能用设计意图驱动玩家行为」
- Design patterns: 长期目标+短期目标交替 / 逻辑先于视觉 / 教学→解题→组合 / 游戏性桥段节奏弧线
- Cross-linked: DS3 拆解①②（关卡拆解范本）、与设计草稿六步法互补（创作框架 vs 分析框架）

## [2026-04-29] ingest | AI CLI 游戏引擎工程接管方案

- Source: `raw/assets/AI CLI使用方案.md`
- Created `Wiki/tech-ai-cli-game-dev/README.md` — AI CLI 模式全面接管 Godot/Unity/Unreal 工程的实战方案
- Key topics: 规则文件设计、设计文档驱动开发、自测闭环、Git 安全网、TODO 编排、禁改清单
- Updated `Wiki/index.md` with entry under Technical Patterns

## [2026-07-07] ingest | AI 使用反模式系列（7 篇）— 从「会用」到「用好」

- Sources: `raw/2026-07-06_*.md`（AI 使用反模式视频教学系列，7 集）
- Created `Wiki/tech-ai-usage/README.md` — 六大反模式诊断与成本优化知识体系
- Key topics:
  - **反模式①** 无脑顶配 → 模型分级策略（便宜/中高阶/强模型按任务匹配）
  - **反模式②** 上下文脏乱 → 上下文组成拆解、工具分级管理、阶段总结搬运法
  - **反模式③** Cache 盲区 → Cache 机制（1/10 收费、5 分钟窗口、1024 Token 阈值）、失效三件套、最大化命中习惯
  - **反模式④** Prompt 随心所欲 → 7 个常见错误、正确 Prompt 公式（角色/任务/问题/限制/期望）
  - **反模式⑤** 黑盒抽卡 → 工程化流程拆解、可单独验收的步骤设计
  - **反模式⑥** 积分浪费 → 个人积分 vs API 成本对比（4:1）、批量任务迁移方案
  - **核心辨析** Skills/Rules/MCP/Memory 四概念区别、Ask/Plan/Agent/Multi-task 模式选择金字塔
- Updated `Wiki/index.md` with entries under Technical Patterns + Sources
- First Wiki entry dedicated to general AI usage best practices

## [2026-07-14] ingest | 中日建筑屋顶区分 — 游戏场景美术指南

- Source: `raw/2026-07-14 如何区分中日建筑.md`（Bilibili · 鱼白施行 · 视频转录）
- Created `Wiki/tech-game-architecture/cn-jp-architecture-diff.md` — 中式与日式建筑屋顶的六大核心差异 + 原神璃月反面案例
- Key topics:
  - **中式基础**: 庑殿（五殿顶）、歇山（九级顶）、悬山、硬山、卷棚、抱厦（正交式/平行式）
  - **日式对应**: 入母屋造、切妻造；破风体系（千鸟破风/入母屋破风/切妻破风/唐破风）
  - **核心差异①**: 硬山顶中存日无；千鸟破风/唐破风为日式独有（不存于中国古建筑）
  - **核心差异②**: 中式抱厦正交式仅有歇山一种；日式有切妻破风抱厦和唐破风抱厦
  - **核心差异③**: 高层抱厦中式半封闭+有承托 vs 日式全封闭+可悬空
  - **反向案例**: 原神璃月大量混用千鸟破风、唐破风、切妻破风抱厦 — 以倭代唐
  - **方法论**: 古画不宜做建筑考据（多数为想象创作）；做减法才能掌握中式建筑内核
- Created new category `tech-game-architecture/` for game scene architectural knowledge
- Updated `Wiki/index.md` with entry under Technical Patterns
- Cross-linked: → [[tech-game-level-design/level-design-primer]]（游戏设计理念）; ← 原始视频转录

## [2026-07-14] ingest | 中国创新药全产业链

- Source: `raw/创新药全产业链(1).md`（视频转录 · 创新药产业深度分析）
- Created `Wiki/synthesis/china-innovative-drug-industry.md` — 中国创新药全产业链全景分析
- Core thesis: 中国医药正经历「从控费压制到创新扶持、从内需到出海、从防御到成长」的三重身份切换
- Key topics:
  - **产业身份转变**: 生物医药被定位为新兴支柱产业，估值锚从控费压制→创新扶持
  - **四大历史阶段**: 2015前仿制→2015-2018制度破冰→2019-2023泡沫出清→2024至今收获分化
  - **资金面三层结构**: 一级市场 VC/PE（结构性回暖）、二级市场 18A（2025修复）、BD首付款（2025年 1,356亿美元）
  - **四大技术主线**: ①代谢减重（GLP-1依从性竞争、MASH千亿蓝海）、②细胞治疗迭代（TIL→实体瘤、in vivo CAR-T→标准化药品）、③AI制药递送（晶泰科技「火箭+卫星」）、④呼吸抗病毒（昂拉地韦 vs 玛巴洛沙韦耐药争议）+ AD（Aβ清除 vs 神经保护路径分化）
  - **代表性公司**: 中国生物制药（平台型六边形战士）、众生药业（呼吸底座→代谢转型）、银诺医药（超长效 GLP-1 健康瘦）
  - **结构性主线**: 消费医疗皮肤赛道（新媒体重构）+ 长护险（2026全国建设）+ 中国药登（出海定价锚）
  - **产业链扩散**: CGT平台、病毒载体/CDMO、LNP递送、质控检测、上游耗材五大受益环节
- First Wiki entry covering innovative drug industry; marks expansion into biomedical/pharma domain
- Updated `Wiki/index.md` with entry under Concepts
- Cross-linked: ← 原始视频转录 [[raw/创新药全产业链(1)]]

