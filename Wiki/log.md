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
- Cross-linked: ← 原始视频转录 [[创新药全产业链(1)]]

## [2026-07-19] ingest | Vlog 拍摄技巧 — 影视飓风 2019 公开课

- Source: `raw/剪辑教学/影视飓风2019：如何拍第一个Vlog.md`（Bilibili · 影视飓风 Tim · UP 学园公开课）
- Created `Wiki/tech-video-editing/vlog-shooting.md` — Vlog 拍摄四大维度知识梳理
- Key topics:
  - **A-Roll（讲话部分）** — 心态建设（多拍适应/不顾路人眼光/讲错自然接续）、固定机位优先于走动、16–24mm 舒适焦段
  - **音频** — 差的音频会毁掉视频、防风毛衣（低端）/枪式麦克风（高端）、规避噪音环境、防止输入过爆
  - **构图与曝光** — 中心构图避免歪斜/过爆/失焦、优先保证人物曝光避免背光、室内柔光窗帘 + 纸灯笼替代专业影视灯
  - **B-Roll（空镜头）** — 三分法/对角线构图、延时摄影、升格慢动作、俯拍（懒人支架/灯架）、锡箔纸+镜子焦外、三面镜子无限循环、卡纸产品打光
- Core thesis: Vlog 的本质是多拍多练，纸上谈兵没有用
- Updated `Wiki/index.md` with entry under Technical Patterns
- Cross-linked: ← 原始视频转录 [[raw/剪辑教学/影视飓风2019：如何拍第一个Vlog]]; → [[tech-video-editing/README]]（编辑阶段工作流）; → [[tech-ai-video-prod/README]]（AI 辅助后期）

## [2026-07-19] ingest | AI 辅助自媒体视频制作工作流

- Source: `raw/剪辑教学/番外：自媒体Ai工具使用.md`（Bilibili · 映像同好会 · 视频转录）
- Created `Wiki/tech-ai-video-prod/README.md` — AI 赋能自媒体视频制作全流程知识梳理
- Key topics:
  - **AI 分镜** — Claude/Codex agent 自动生成分镜头表格，从 2 天缩短到 30 分钟
  - **Mac vs Windows** — macOS POSIX 兼容性在 AI agent 时代的结构性优势（达芬奇 MCP 实测对比）
  - **拍摄工作流** — GH6 + iPhone 15 Pro 双机位 + 雷电硬盘盒直录 + AirDrop 传素材
  - **后期硬件生态** — M1 Pro MacBook + 雷电 4 拓展坞 + NAS + 双显示器 + 达芬奇多端适配
  - **AI 动效** — Codex + Remotion 自动生成基于 Web 的动效视频，替代 AE 古法手搓
  - **字幕自动化** — Codex 编写达芬奇脚本实现自动字幕处理与校对
  - **封面与元数据** — GPT 生图做封面参考 + MCP 自动生成简介/分段标签/BGM 信息
- Core thesis: Mac 是 AI 时代自媒体创作者的「创作前台」——串联人的创意、AI 的效率、硬件的可靠；PC 适合 3D 渲染等重型任务，Linux 服务器跑后台 agent
- Created new category `tech-ai-video-prod/` for AI-assisted content creation / video production patterns
- Updated `Wiki/index.md` with entry under Technical Patterns
- Cross-linked: ← 原始来源 [[raw/剪辑教学/番外：自媒体Ai工具使用]]; → [[tech-ai-usage/README]]（AI 使用反模式在内容创作领域的具体实践案例）

## [2026-07-19] ingest | 视频剪辑系统课程全三季 —— 从基础到实战

- Sources: `raw/剪辑教学/`（S1 四课 + S2 四课 + S3 五课 + 番外三篇，共 15 份源文件）
- Created `Wiki/tech-video-editing/README.md` — 覆盖完整剪辑课程的知识梳理
- Key topics:

  **S1 剪辑基础（4 课）：**
  - **口播精剪与 A/BRoll** — 自动剪口播、气口处理（叠化+环境音垫底）、B-Roll 对齐节奏、响度统一、字幕样式参数
  - **节奏学控** — BGM 踩点定调、景别递进（大远景→中景→特写）、匹配剪辑/交叉叙事/蒙太奇、切分卡点破格
  - **听觉塑造** — 音频尾迹制造（回声混响）、J-cut/L-cut 环境音、特殊设计音效、AI 音效尝试
  - **交付导出** — 封面标题规范、分辨率/帧率/码率/编码选择、AAC PCM 音频格式对比

  **S2 进阶技术（4 课）：**
  - **关键帧与曲线** — 补间动画、组合关键帧、曲线运动一致性
  - **曲线变速** — 帧融合 vs 光流法补帧、高帧率拍摄建议、极快极慢反差变速、变速卡点
  - **抠像合成** — 智能/自定义抠像、抠像三明治（人物背后大字）、绿幕/色度抠图、蒙版、混合模式组速查
  - **色彩科学** — Log/LUT 原理、色轮四区域（阴影/中间调/高光/偏移）、波形图/分量图/矢量图示波器

  **S3 综合实战（5 课）：**
  - **拉片解构** — 镜头时长由信息密度决定、踩梯子技巧、文字追踪流程（先粗剪后追踪）
  - **进阶平面追踪** — 复合片段追踪、物体消失处理、拉伸/透视修正
  - **多机位剪辑** — 音频对齐/时码器同步、切换原则（对准说话人）、角标人名条
  - **时钟理论** — 长视频波峰理论（20 分钟 10 波峰）、0/3/6/9 退出点布局、计时器效果制作
  - **Vlog 结构** — 三段式创作（乱序→导图→分段）、RGB 曲线/S 型曲线、色彩克隆、分级导出

  **番外：**
  - **Vlog 剪辑 8 招** — 景别丰富、乱拍快切、鱼眼/慢门/快闪/旋焦/黑白彩色对比
  - **设备清单** — 支架/麦克风/灯光基础配置
  - **AI 工具** — 已独立为 [[tech-ai-video-prod/README]]
- Created new category `tech-video-editing/` for video editing and post-production knowledge
- Updated `Wiki/index.md` with entry under Technical Patterns + Sources section
- Cross-linked: → [[tech-ai-video-prod/README]]（AI 辅助视频制作，本课程的 AI 延伸）; → [[tech-ai-usage/README]]（AI 使用反模式参考）

## [2026-07-19] ingest | 商业航天全产业链 — 从航天工程到航天工业

- Source: `A股/市场分析/商业航天. 太空算力.md`（Bilibili · 青枫浦上Q · 视频转录）
- Created `Wiki/tech-commercial-space/README.md` — 商业航天全产业链知识梳理
- Core thesis: 商业航天正从「工程验证时代」进入「万星组网、批量制造、规模运营」的航天工业时代
- Key topics:
  - **产业概况**：2015-2025十年历程、四重拐点（政策/技术/成本/需求）
  - **太空算力**（本轮最强叙事）：能源供应、热管理、抗辐射计算、星间通信四大瓶颈；国内玩家生态四类主体
  - **卫星通信星座**：Starlink 标杆数据对比（9,600星/1,030万用户）、中国星网+千帆星座规划
  - **可回收火箭**：不锈钢（SpaceX/建源科技）vs 铝合金路线、海上回收为主、成熟路径分阶段
  - **太空态势感知(SSA)**：类比太空GPS、开运集团（国内龙头、对标TLE体系）
  - **航天测控(TT&C)**：从后台客服升级为太空资产管理中枢、新异空间（580星/15万次服务）
  - **太空光伏**：三结砷化镓→钙钛矿/叠层方向、中国光伏产业链向航天延伸机会
  - **中美路径对比**：美国（资本驱动/垄断整合/大规模集中式）vs 中国（战略自主/产业协同/小批量迭代）
  - **SpaceX IPO 分析**：全部增发募资~750亿美元、n for one 叙事（太空+链接+AI）
  - **投资框架**：星座配套放量 + 前瞻性主题双轨并行、偏好0.5→1阶段公司
- Created new category `tech-commercial-space/` for commercial aerospace knowledge
- Updated `Wiki/index.md` with entry under Technical Patterns
- Cross-linked: ← 原始来源 [[A股/市场分析/商业航天. 太空算力]]（B站视频完整转录）; → [[tech-ai-usage/README]]（AI 基础设施需求是太空算力叙事核心变量）

## [2026-07-19] ingest | A股技术分析 — 青枫浦上K线课程系列（6集）

- Source: `A股/上课笔记/`（Bilibili · 青枫浦上Q · 2026年6月系列课程，共6集视频转录）
- Created new category `tech-a-stock-ta/` for A-share technical analysis knowledge
- Created `Wiki/tech-a-stock-ta/README.md` — 课程体系综合导览
- Created `Wiki/tech-a-stock-ta/single-k-line.md` — 单根K线信号（长红/长黑/上吊/铁锤/流星/倒装铁锤）
- Created `Wiki/tech-a-stock-ta/k-line-reversal-pairs.md` — 双K线反转组合（吞没/孕线/刺透形态/乌云盖顶）含A/B/C级分类
- Created `Wiki/tech-a-stock-ta/bollinger-7.md` — 7轨布林线超买超卖判断
- Created `Wiki/tech-a-stock-ta/trading-philosophy.md` — 交易之道：强趋势股分类、追高低吸买点、主动意识、滚动操作、时间周期、大五人格×八字性格适配
- Core thesis: 量化时代个人交易者应放弃与机器对决，回到逻辑与趋势，建立"强趋势模式+主动意识+性格适配"的三位一体交易系统
- Key topics:
  - **第1层（单根K线）**: 低档长红/高档长红/长红突破/长红跌破/长黑线/上吊线/铁锤线/流星线/倒装铁锤线
  - **第2层（双K线组合）**: 吞没形态（力量完全反超）、孕线（力量衰竭预警）、刺透形态&乌云盖顶（力量切换过半）— 从弱到强的完整反转谱系
  - **第3层（7轨布林线）**: 顶轨→底轨7级超买超卖梯度，第3轨为趋势分水岭
  - **第4层（交易哲学）**: 强趋势股三层分类（强/弱 × 脉冲/长趋势 × 主升/震荡/主跌）、追高vs低吸买点体系、主动意识与模式思维、滚动操作、时间周期有效性（5-7天极限、3次重复警惕失效）
  - **性格适配**: 大五人格（神经质/尽责性/开放性/外向性/宜人性）× 八字食神 — "知天命，尽人事"，把个人命运放在时代洪流下
- Updated `Wiki/index.md` with entries under Technical Patterns
- Cross-linked: ← [[A股/上课笔记]]（6个原始素材）; → [[project-a-stock/2026-05-27-收盘]]（实战应用）; → [[project-a-stock/2026-05-28-收盘]]（实战应用）; → [[tech-ai-usage/README]]（量化时代AI工具使用）