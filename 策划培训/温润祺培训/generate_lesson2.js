const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "游戏策划培训";
pres.title = "Lesson 2：关卡策划入门";

// ── Color Palette ──
const C = {
  darkBg: "1B1B2F",
  darkBg2: "162447",
  primary: "E43F5A",    // coral accent
  accent: "1FAB89",     // teal
  accent2: "F0883E",    // orange
  lightBg: "EBEEF2",
  cardBg: "FFFFFF",
  textDark: "1B1B2F",
  textMuted: "6B7280",
  textLight: "E8E8EC",
  border: "CDD1D6",
  highlight: "FFF3CD",  // soft yellow for warnings
  warnText: "92400E",
};

// ── Factory functions (avoid object reuse pitfall) ──
const makeShadow = () => ({
  type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.10,
});
const makeCardShadow = () => ({
  type: "outer", color: "000000", blur: 8, offset: 3, angle: 135, opacity: 0.08,
});
const makeAccentShadow = () => ({
  type: "outer", color: "E43F5A", blur: 4, offset: 1, angle: 135, opacity: 0.15,
});

// ── Helper: add a card (background rect + text on top) ──
function addCard(slide, opts) {
  const { x, y, w, h, fill, shadow, rectRadius, borderColor } = opts;
  const useFill = fill || C.cardBg;
  const useBorder = borderColor !== undefined ? borderColor : (useFill === C.cardBg ? C.border : undefined);
  slide.addShape(rectRadius ? pres.shapes.ROUNDED_RECTANGLE : pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: useFill },
    shadow: shadow || makeCardShadow(),
    ...(rectRadius ? { rectRadius } : {}),
    ...(useBorder ? { line: { color: useBorder, width: 0.5 } } : {}),
  });
}

function addCardText(slide, opts) {
  slide.addText(opts.text, {
    x: opts.x, y: opts.y, w: opts.w, h: opts.h,
    fontSize: opts.fontSize || 13,
    fontFace: opts.fontFace || "Microsoft YaHei",
    color: opts.color || C.textDark,
    align: opts.align || "left",
    valign: opts.valign || "top",
    bold: opts.bold,
    margin: opts.margin !== undefined ? opts.margin : [8, 10, 8, 10],
    ...(opts.lineSpacing ? { lineSpacing: opts.lineSpacing } : {}),
  });
}

// ── Helper: numbered circle ──
function addNumberCircle(slide, num, x, y, size, color) {
  slide.addShape(pres.shapes.OVAL, {
    x, y, w: size, h: size,
    fill: { color: color || C.primary },
  });
  slide.addText(String(num), {
    x, y, w: size, h: size,
    fontSize: size * 28, fontFace: "Arial", color: "FFFFFF",
    bold: true, align: "center", valign: "middle", margin: 0,
  });
}

// ── Helper: section divider bar ──
function addSectionBar(slide, x, y, w, color) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: w || 0.08, h: 0.45,
    fill: { color: color || C.primary },
  });
}

// ── Helper: top accent line ──
function addTopAccent(slide, color) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: color || C.primary },
  });
}

// ============================================================
// SLIDE 1: TITLE
// ============================================================
(() => {
  const slide = pres.addSlide();
  slide.background = { color: C.darkBg };

  // Large decorative circle (top right)
  slide.addShape(pres.shapes.OVAL, {
    x: 7.2, y: -1.2, w: 4.5, h: 4.5,
    fill: { color: C.primary, transparency: 85 },
  });
  // Smaller decorative circle (left)
  slide.addShape(pres.shapes.OVAL, {
    x: -0.8, y: 3.8, w: 3.0, h: 3.0,
    fill: { color: C.accent, transparency: 82 },
  });

  // Accent bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 1.0, y: 2.05, w: 0.9, h: 0.06,
    fill: { color: C.primary },
  });

  // Title
  slide.addText("关卡策划入门", {
    x: 1.0, y: 2.3, w: 8.0, h: 1.2,
    fontSize: 44, fontFace: "Microsoft YaHei", color: "FFFFFF",
    bold: true, align: "left", valign: "middle", margin: 0,
  });

  // Subtitle
  slide.addText("Lesson 2  ·  游戏策划培训", {
    x: 1.0, y: 3.5, w: 8.0, h: 0.5,
    fontSize: 18, fontFace: "Microsoft YaHei", color: C.textLight,
    align: "left", valign: "middle", margin: 0,
  });

  // Bottom info bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.1, w: 10, h: 0.525,
    fill: { color: "000000", transparency: 30 },
  });
  slide.addText("学生：温润祺    课程：关卡策划入门    日期：2026", {
    x: 0.5, y: 5.1, w: 9.0, h: 0.525,
    fontSize: 11, fontFace: "Microsoft YaHei", color: C.textLight,
    align: "left", valign: "middle", margin: 0,
  });
})();

// ============================================================
// SLIDE 2: 课程目标
// ============================================================
(() => {
  const slide = pres.addSlide();
  slide.background = { color: C.lightBg };
  addTopAccent(slide, C.primary);

  // Title
  addSectionBar(slide, 0.5, 0.35, 0.08, C.primary);
  slide.addText("课程目标", {
    x: 0.75, y: 0.3, w: 5, h: 0.55,
    fontSize: 28, fontFace: "Microsoft YaHei", color: C.textDark,
    bold: true, align: "left", valign: "middle", margin: 0,
  });

  // Three objective cards
  const objectives = [
    {
      num: 1,
      title: "明确职业方向",
      desc: "理解单机游戏与商业游戏对新人策划的核心区别，确认个人目标定位",
      color: C.primary,
    },
    {
      num: 2,
      title: "关卡策划入门",
      desc: "掌握关卡策划作品集的构成要素与所需核心技能",
      color: C.accent2,
    },
    {
      num: 3,
      title: "关卡设计要素",
      desc: "了解关卡设计的核心要素：空间、节奏、引导、挑战、叙事",
      color: C.accent,
    },
  ];

  objectives.forEach((obj, i) => {
    const cx = 0.5 + i * 3.1;
    const cy = 1.4;

    // Card bg
    addCard(slide, {
      x: cx, y: cy, w: 2.85, h: 2.8,
      fill: C.cardBg, shadow: makeCardShadow(), rectRadius: 0.1,
    });

    // Number circle
    addNumberCircle(slide, obj.num, cx + 0.95, cy + 0.3, 0.65, obj.color);

    // Card title
    slide.addText(obj.title, {
      x: cx + 0.2, y: cy + 1.2, w: 2.45, h: 0.45,
      fontSize: 16, fontFace: "Microsoft YaHei", color: C.textDark,
      bold: true, align: "center", valign: "middle", margin: 0,
    });

    // Card description
    slide.addText(obj.desc, {
      x: cx + 0.2, y: cy + 1.7, w: 2.45, h: 0.85,
      fontSize: 11.5, fontFace: "Microsoft YaHei", color: C.textMuted,
      align: "center", valign: "top", margin: [4, 6, 4, 6],
      lineSpacing: 18,
    });
  });

  // Bottom note
  slide.addText("本课程以学生作业为案例，结合理论展开讲解", {
    x: 0.5, y: 4.7, w: 9, h: 0.4,
    fontSize: 11, fontFace: "Microsoft YaHei", color: C.textMuted,
    align: "center", valign: "middle", margin: 0, italic: true,
  });
})();

// ============================================================
// SLIDE 3: Part 1 - 游戏类型选择
// ============================================================
(() => {
  const slide = pres.addSlide();
  slide.background = { color: C.lightBg };
  addTopAccent(slide, C.primary);

  // Section label
  slide.addText("PART 1", {
    x: 0.5, y: 0.2, w: 2, h: 0.3,
    fontSize: 10, fontFace: "Arial", color: C.primary,
    bold: true, align: "left", valign: "middle", margin: 0,
    charSpacing: 4,
  });

  addSectionBar(slide, 0.5, 0.55, 0.08, C.primary);
  slide.addText("作业分析：想加入的游戏类型", {
    x: 0.75, y: 0.5, w: 8, h: 0.55,
    fontSize: 26, fontFace: "Microsoft YaHei", color: C.textDark,
    bold: true, align: "left", valign: "middle", margin: 0,
  });

  // Two game type cards
  // Card 1: 开放大世界
  const c1x = 0.5, c1y = 1.4;
  addCard(slide, {
    x: c1x, y: c1y, w: 4.3, h: 3.3,
    fill: C.cardBg, shadow: makeCardShadow(), rectRadius: 0.1,
  });
  // Card 1 header
  slide.addShape(pres.shapes.RECTANGLE, {
    x: c1x, y: c1y, w: 4.3, h: 0.06,
    fill: { color: C.accent },
  });
  addNumberCircle(slide, 1, c1x + 0.3, c1y + 0.3, 0.5, C.accent);
  slide.addText("开放大世界", {
    x: c1x + 1.0, y: c1y + 0.3, w: 3.0, h: 0.5,
    fontSize: 18, fontFace: "Microsoft YaHei", color: C.textDark,
    bold: true, align: "left", valign: "middle", margin: 0,
  });

  const owReasons = [
    "社交功能 — 玩家互动与社区生态",
    "模拟经营 — 系统循环与经济设计",
    "大世界地图设计 — 空间规划能力",
    "大世界玩法设计 — 开放结构下的内容填充",
  ];
  owReasons.forEach((r, ri) => {
    slide.addText([
      { text: r, options: { bullet: true } },
    ], {
      x: c1x + 0.5, y: c1y + 1.1 + ri * 0.48, w: 3.5, h: 0.4,
      fontSize: 12, fontFace: "Microsoft YaHei", color: C.textDark,
      align: "left", valign: "middle", margin: 0,
    });
  });

  // Card 2: 3DRPG ⭐️
  const c2x = 5.2, c2y = 1.4;
  addCard(slide, {
    x: c2x, y: c2y, w: 4.3, h: 3.3,
    fill: C.cardBg, shadow: makeCardShadow(), rectRadius: 0.1,
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: c2x, y: c2y, w: 4.3, h: 0.06,
    fill: { color: C.primary },
  });
  addNumberCircle(slide, 2, c2x + 0.3, c2y + 0.3, 0.5, C.primary);

  // Star badge
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: c2x + 2.9, y: c2y + 0.35, w: 0.8, h: 0.35,
    fill: { color: C.primary }, rectRadius: 0.08,
  });
  slide.addText("⭐ 重点", {
    x: c2x + 2.9, y: c2y + 0.35, w: 0.8, h: 0.35,
    fontSize: 9, fontFace: "Microsoft YaHei", color: "FFFFFF",
    bold: true, align: "center", valign: "middle", margin: 0,
  });

  slide.addText("3D RPG", {
    x: c2x + 1.0, y: c2y + 0.3, w: 1.8, h: 0.5,
    fontSize: 18, fontFace: "Microsoft YaHei", color: C.textDark,
    bold: true, align: "left", valign: "middle", margin: 0,
  });

  const rpgReasons = [
    "空间探索 — 3D 环境下的垂直/水平探索设计",
    "空间 & 角色叙事 — 环境叙事与角色塑造融合",
  ];
  rpgReasons.forEach((r, ri) => {
    slide.addText([
      { text: r, options: { bullet: true } },
    ], {
      x: c2x + 0.5, y: c2y + 1.1 + ri * 0.48, w: 3.5, h: 0.4,
      fontSize: 12, fontFace: "Microsoft YaHei", color: C.textDark,
      align: "left", valign: "middle", margin: 0,
    });
  });

  // Note at bottom of card 2
  slide.addText("分析：3D RPG 更适合关卡策划方向，推荐作为主攻类型", {
    x: c2x + 0.5, y: c2y + 2.3, w: 3.5, h: 0.7,
    fontSize: 11, fontFace: "Microsoft YaHei", color: C.textMuted,
    align: "left", valign: "top", margin: [4, 6, 4, 6], italic: true,
    lineSpacing: 16,
  });
})();

// ============================================================
// SLIDE 4: Part 1 - 游戏拆解：进步点
// ============================================================
(() => {
  const slide = pres.addSlide();
  slide.background = { color: C.lightBg };
  addTopAccent(slide, C.accent);

  slide.addText("PART 1", {
    x: 0.5, y: 0.2, w: 2, h: 0.3,
    fontSize: 10, fontFace: "Arial", color: C.primary,
    bold: true, align: "left", valign: "middle", margin: 0, charSpacing: 4,
  });

  addSectionBar(slide, 0.5, 0.55, 0.08, C.accent);
  slide.addText("游戏拆解：进步点", {
    x: 0.75, y: 0.5, w: 8, h: 0.55,
    fontSize: 26, fontFace: "Microsoft YaHei", color: C.textDark,
    bold: true, align: "left", valign: "middle", margin: 0,
  });

  const insights = [
    {
      title: "空间结构识别",
      desc: "识别「假开放真线性」（高台/悬崖锁路线）、垂直分层探索（上下层+隐藏地板）",
    },
    {
      title: "引导设计区分",
      desc: "区分明引导（草丛/陷阱/铃铛教学点）与暗引导，理解两类引导的配合机制",
    },
    {
      title: "探索节奏把控",
      desc: "单向门/竖井/捷径解锁，「即使有地图也会迷路」的不确定性设计思路",
    },
    {
      title: "难度曲线归纳",
      desc: "自发归纳出教学→变招→熟练→Boss 的节奏模型，体现系统性思考",
    },
    {
      title: "能力门控理解",
      desc: "能力锁→新区域（钩索/潜水/滑翔伞），掌握银河城关卡探索的核心逻辑",
    },
  ];

  // 3+2 grid layout
  const positions = [
    { x: 0.5, y: 1.4, w: 4.3 },
    { x: 5.2, y: 1.4, w: 4.3 },
    { x: 0.5, y: 2.8, w: 4.3 },
    { x: 5.2, y: 2.8, w: 4.3 },
    { x: 0.5, y: 4.2, w: 4.3 },
  ];

  insights.forEach((ins, i) => {
    const pos = positions[i];
    // Card
    addCard(slide, {
      x: pos.x, y: pos.y, w: pos.w, h: 1.2,
      fill: C.cardBg, shadow: makeCardShadow(), rectRadius: 0.08,
    });
    // Accent left edge
    slide.addShape(pres.shapes.RECTANGLE, {
      x: pos.x, y: pos.y, w: 0.06, h: 1.2,
      fill: { color: C.accent },
    });

    // Title
    slide.addText(ins.title, {
      x: pos.x + 0.25, y: pos.y + 0.1, w: pos.w - 0.45, h: 0.35,
      fontSize: 14, fontFace: "Microsoft YaHei", color: C.textDark,
      bold: true, align: "left", valign: "middle", margin: 0,
    });
    // Description
    slide.addText(ins.desc, {
      x: pos.x + 0.25, y: pos.y + 0.48, w: pos.w - 0.45, h: 0.6,
      fontSize: 11, fontFace: "Microsoft YaHei", color: C.textMuted,
      align: "left", valign: "top", margin: 0, lineSpacing: 16,
    });
  });

  // Last card spans full width
  const lx = 5.2, ly = 4.2;
  // (handled above in positions)
})();

// ============================================================
// SLIDE 5: Part 1 - 游戏拆解：优化点
// ============================================================
(() => {
  const slide = pres.addSlide();
  slide.background = { color: C.lightBg };
  addTopAccent(slide, C.accent2);

  slide.addText("PART 1", {
    x: 0.5, y: 0.2, w: 2, h: 0.3,
    fontSize: 10, fontFace: "Arial", color: C.primary,
    bold: true, align: "left", valign: "middle", margin: 0, charSpacing: 4,
  });

  addSectionBar(slide, 0.5, 0.55, 0.08, C.accent2);
  slide.addText("游戏拆解：优化方向", {
    x: 0.75, y: 0.5, w: 8, h: 0.55,
    fontSize: 26, fontFace: "Microsoft YaHei", color: C.textDark,
    bold: true, align: "left", valign: "middle", margin: 0,
  });

  const issues = [
    {
      icon: "⚠",
      title: "缺设计原则归纳",
      desc: "分析偏「逐点描述」，需要提炼为什么这样设计、可复用的法则是什么",
      detail: "从「描述现象」升级到「归纳设计原则」",
    },
    {
      icon: "⚠",
      title: "文档结构待优化",
      desc: "未建立标准关卡设计文档（LDD）的字段意识，需帮助读者理解游戏 & 理解你的设计思维",
      detail: "建立 LDD 文档规范意识",
    },
    {
      icon: "⚠",
      title: "缺少量化语言",
      desc: "如「前 X 分钟教学、敌人密度每 X 米一个」，让设计可被评估和验证",
      detail: "用量化指标支撑设计决策",
    },
  ];

  issues.forEach((issue, i) => {
    const iy = 1.5 + i * 1.3;

    // Warning card with warm bg
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: iy, w: 9.0, h: 1.05,
      fill: { color: "FFF8F0" },
      shadow: makeShadow(),
    });
    // Left accent
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: iy, w: 0.06, h: 1.05,
      fill: { color: C.accent2 },
    });

    // Icon
    slide.addText(issue.icon, {
      x: 0.85, y: iy, w: 0.5, h: 1.05,
      fontSize: 22, align: "center", valign: "middle", margin: 0,
    });

    // Title
    slide.addText(issue.title, {
      x: 1.45, y: iy + 0.08, w: 2.5, h: 0.35,
      fontSize: 15, fontFace: "Microsoft YaHei", color: C.warnText,
      bold: true, align: "left", valign: "middle", margin: 0,
    });
    // Description
    slide.addText(issue.desc, {
      x: 1.45, y: iy + 0.43, w: 5.5, h: 0.5,
      fontSize: 11.5, fontFace: "Microsoft YaHei", color: C.textMuted,
      align: "left", valign: "top", margin: 0, lineSpacing: 16,
    });

    // Detail tag (right side)
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 7.15, y: iy + 0.2, w: 2.1, h: 0.6,
      fill: { color: C.highlight }, rectRadius: 0.06,
      line: { color: "FCD34D", width: 0.5 },
    });
    slide.addText(issue.detail, {
      x: 7.15, y: iy + 0.2, w: 2.1, h: 0.6,
      fontSize: 10, fontFace: "Microsoft YaHei", color: C.warnText,
      align: "center", valign: "middle", margin: [2, 6, 2, 6], bold: true,
    });
  });

  // Bottom summary
  slide.addText("💡 核心改进方向：从「描述」走向「归纳」，从「感性」走向「量化」", {
    x: 0.5, y: 4.85, w: 9, h: 0.35,
    fontSize: 12, fontFace: "Microsoft YaHei", color: C.primary,
    align: "center", valign: "middle", margin: 0, bold: true,
  });
})();

// ============================================================
// SLIDE 6: Part 2 - 运营模式区别
// ============================================================
(() => {
  const slide = pres.addSlide();
  slide.background = { color: C.darkBg };

  // Decorative bg shapes
  slide.addShape(pres.shapes.OVAL, {
    x: -1.5, y: -1.5, w: 4, h: 4,
    fill: { color: C.primary, transparency: 90 },
  });

  slide.addText("PART 2", {
    x: 0.5, y: 0.3, w: 2, h: 0.3,
    fontSize: 10, fontFace: "Arial", color: C.primary,
    bold: true, align: "left", valign: "middle", margin: 0, charSpacing: 4,
  });

  slide.addText("单机策划 vs 商业化手游策划", {
    x: 0.5, y: 0.65, w: 9, h: 0.7,
    fontSize: 30, fontFace: "Microsoft YaHei", color: "FFFFFF",
    bold: true, align: "left", valign: "middle", margin: 0,
  });

  // Subtitle
  slide.addText("运营模式决定工作方式、成长路径与职业天花板", {
    x: 0.5, y: 1.35, w: 9, h: 0.4,
    fontSize: 14, fontFace: "Microsoft YaHei", color: C.textLight,
    align: "left", valign: "middle", margin: 0,
  });

  // Two mode cards
  const modes = [
    {
      title: "商业化游戏（GaaS）",
      subtitle: "服务型游戏 · 长期运营",
      desc: "用户付费驱动 · 数据导向迭代\n产品上限为起点 · 持续内容更新",
      color: C.accent2,
      pos: 0.5,
    },
    {
      title: "单机买断制游戏",
      subtitle: "内容驱动 · 口碑传播",
      desc: "一次性买断 · 作者驱动设计\n上线作为终点 · 靠内容品质取胜",
      color: C.accent,
      pos: 5.2,
    },
  ];

  modes.forEach((m) => {
    const mx = m.pos, my = 2.1;
    // Card bg (semi-transparent)
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: mx, y: my, w: 4.3, h: 2.8,
      fill: { color: "252540" },
      rectRadius: 0.12,
      line: { color: m.color, width: 1.5 },
    });

    // Top color bar
    slide.addShape(pres.shapes.RECTANGLE, {
      x: mx + 0.3, y: my + 0.3, w: 0.9, h: 0.05,
      fill: { color: m.color },
    });

    slide.addText(m.title, {
      x: mx + 0.3, y: my + 0.5, w: 3.7, h: 0.5,
      fontSize: 20, fontFace: "Microsoft YaHei", color: "FFFFFF",
      bold: true, align: "left", valign: "middle", margin: 0,
    });
    slide.addText(m.subtitle, {
      x: mx + 0.3, y: my + 1.0, w: 3.7, h: 0.35,
      fontSize: 12, fontFace: "Microsoft YaHei", color: C.textLight,
      align: "left", valign: "middle", margin: 0,
    });
    slide.addText(m.desc, {
      x: mx + 0.3, y: my + 1.5, w: 3.7, h: 1.0,
      fontSize: 13, fontFace: "Microsoft YaHei", color: C.textLight,
      align: "left", valign: "top", margin: 0, lineSpacing: 22,
    });
  });
})();

// ============================================================
// SLIDE 7: Part 2 - 详细对比表
// ============================================================
(() => {
  const slide = pres.addSlide();
  slide.background = { color: C.lightBg };
  addTopAccent(slide, C.primary);

  slide.addText("PART 2", {
    x: 0.5, y: 0.2, w: 2, h: 0.3,
    fontSize: 10, fontFace: "Arial", color: C.primary,
    bold: true, align: "left", valign: "middle", margin: 0, charSpacing: 4,
  });

  addSectionBar(slide, 0.5, 0.55, 0.08, C.primary);
  slide.addText("全方位对比", {
    x: 0.75, y: 0.5, w: 8, h: 0.55,
    fontSize: 26, fontFace: "Microsoft YaHei", color: C.textDark,
    bold: true, align: "left", valign: "middle", margin: 0,
  });

  const tableHeader = [
    { text: "维度", options: { fill: { color: C.darkBg }, color: "FFFFFF", bold: true, fontSize: 12, fontFace: "Microsoft YaHei", align: "center", valign: "middle" } },
    { text: "商业化游戏", options: { fill: { color: C.accent2 }, color: "FFFFFF", bold: true, fontSize: 12, fontFace: "Microsoft YaHei", align: "center", valign: "middle" } },
    { text: "单机游戏", options: { fill: { color: C.accent }, color: "FFFFFF", bold: true, fontSize: 12, fontFace: "Microsoft YaHei", align: "center", valign: "middle" } },
  ];

  const rows = [
    ["待遇", "起薪较高、旱涝保收、定时分红", "起薪较低、回报后置"],
    ["现金流", "上线回收快", "不稳定，研发期长依赖稳定投产"],
    ["岗位数量", "极多（95%+）", "少数团队"],
    ["对应届生", "校招通道较多", "保守，经验要求高"],
    ["成长方向", "方法论+数据导向", "设计内容导向"],
    ["风险", "缺亮眼项目经历则转向单机较难", "门槛高，非头部团队风险较高、待遇较差"],
  ];

  const tableData = [tableHeader];
  rows.forEach((row) => {
    tableData.push([
      { text: row[0], options: { fill: { color: "F8F9FA" }, color: C.textDark, bold: true, fontSize: 11, fontFace: "Microsoft YaHei", align: "center", valign: "middle" } },
      { text: row[1], options: { fill: { color: "FFFFFF" }, color: C.textDark, fontSize: 11, fontFace: "Microsoft YaHei", align: "left", valign: "middle" } },
      { text: row[2], options: { fill: { color: "FFFFFF" }, color: C.textDark, fontSize: 11, fontFace: "Microsoft YaHei", align: "left", valign: "middle" } },
    ]);
  });

  slide.addTable(tableData, {
    x: 0.5, y: 1.3, w: 9.0,
    colW: [1.5, 3.75, 3.75],
    rowH: [0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45],
    border: { pt: 0.5, color: C.border },
    margin: [4, 8, 4, 8],
  });

  // Bottom note
  slide.addText("💡 新人入行建议：商业游戏岗位多、成长体系完善；单机游戏注重内容创造力，可作为长期方向", {
    x: 0.5, y: 4.85, w: 9, h: 0.4,
    fontSize: 11, fontFace: "Microsoft YaHei", color: C.textMuted,
    align: "center", valign: "middle", margin: 0, italic: true,
  });
})();

// ============================================================
// SLIDE 8: Part 3 - 作品集概览
// ============================================================
(() => {
  const slide = pres.addSlide();
  slide.background = { color: C.darkBg };

  slide.addShape(pres.shapes.OVAL, {
    x: 7.5, y: -0.5, w: 3.5, h: 3.5,
    fill: { color: C.accent, transparency: 88 },
  });

  slide.addText("PART 3", {
    x: 0.5, y: 0.3, w: 2, h: 0.3,
    fontSize: 10, fontFace: "Arial", color: C.primary,
    bold: true, align: "left", valign: "middle", margin: 0, charSpacing: 4,
  });

  slide.addText("关卡策划作品集构成", {
    x: 0.5, y: 0.65, w: 9, h: 0.7,
    fontSize: 30, fontFace: "Microsoft YaHei", color: "FFFFFF",
    bold: true, align: "left", valign: "middle", margin: 0,
  });

  slide.addText("一份完整的关卡策划作品集应包含三大模块", {
    x: 0.5, y: 1.35, w: 9, h: 0.4,
    fontSize: 14, fontFace: "Microsoft YaHei", color: C.textLight,
    align: "left", valign: "middle", margin: 0,
  });

  // Three large category cards
  const cats = [
    {
      num: "01",
      title: "关卡作品",
      items: ["关卡白盒（可玩）", "交互逻辑", "难度曲线", "怪物/事件布局", "环境叙事"],
      color: C.primary,
    },
    {
      num: "02",
      title: "设计文档与表达",
      items: ["关卡设计文档 LDD", "平面图与动线图", "设计思路表达", "协作流程说明"],
      color: C.accent,
    },
    {
      num: "03",
      title: "游戏拆解作品",
      items: ["深度关卡拆解", "改进设计提案", "差异化优势包装"],
      color: C.accent2,
    },
  ];

  cats.forEach((cat, i) => {
    const cx = 0.5 + i * 3.1, cy = 2.0;

    // Card
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: cx, y: cy, w: 2.85, h: 3.1,
      fill: { color: "252540" },
      rectRadius: 0.1,
      line: { color: cat.color, width: 1 },
    });

    // Number
    slide.addText(cat.num, {
      x: cx + 0.2, y: cy + 0.15, w: 2.45, h: 0.6,
      fontSize: 32, fontFace: "Arial", color: cat.color,
      bold: true, align: "left", valign: "middle", margin: 0,
    });

    // Title
    slide.addText(cat.title, {
      x: cx + 0.2, y: cy + 0.7, w: 2.45, h: 0.4,
      fontSize: 16, fontFace: "Microsoft YaHei", color: "FFFFFF",
      bold: true, align: "left", valign: "middle", margin: 0,
    });

    // Items
    cat.items.forEach((item, ii) => {
      slide.addText([
        { text: item, options: { bullet: true } },
      ], {
        x: cx + 0.2, y: cy + 1.25 + ii * 0.38, w: 2.45, h: 0.35,
        fontSize: 11, fontFace: "Microsoft YaHei", color: C.textLight,
        align: "left", valign: "middle", margin: 0,
      });
    });
  });
})();

// ============================================================
// SLIDE 9: Part 3 - 关卡作品详解
// ============================================================
(() => {
  const slide = pres.addSlide();
  slide.background = { color: C.lightBg };
  addTopAccent(slide, C.primary);

  slide.addText("PART 3", {
    x: 0.5, y: 0.2, w: 2, h: 0.3,
    fontSize: 10, fontFace: "Arial", color: C.primary,
    bold: true, align: "left", valign: "middle", margin: 0, charSpacing: 4,
  });

  addSectionBar(slide, 0.5, 0.55, 0.08, C.primary);
  slide.addText("关卡作品核心内容", {
    x: 0.75, y: 0.5, w: 8, h: 0.55,
    fontSize: 26, fontFace: "Microsoft YaHei", color: C.textDark,
    bold: true, align: "left", valign: "middle", margin: 0,
  });

  // 5 content cards in a 3+2 layout
  const contents = [
    {
      title: "1. 关卡白盒（可玩）",
      subtitle: "5-10 分钟可玩关卡",
      items: ["地图结构 · 动线垂直分层", "捷径/回路 · 地标布置", "玩家动线 · 游戏引导", "玩法展示 · 探索节奏"],
    },
    {
      title: "2. 简单交互逻辑",
      subtitle: "加分项",
      items: ["触发器机制", "开门/关门逻辑", "能力门控（钥匙/解谜）"],
    },
    {
      title: "3. 难度曲线设计",
      subtitle: "核心节奏",
      items: ["教学→解题→组合→考验", "战斗→解谜→修整的节奏"],
    },
    {
      title: "4. 怪物/事件布局",
      subtitle: "遭遇设计",
      items: ["体现遭遇设计意图", "展示战斗节奏把控"],
    },
    {
      title: "5. 环境叙事",
      subtitle: "空间讲故事",
      items: ["场景/道具/布局叙事", "关卡与世界观角色融合"],
    },
  ];

  // Row 1: 3 cards
  for (let i = 0; i < 3; i++) {
    const cx = 0.5 + i * 3.1, cy = 1.35;
    addCard(slide, {
      x: cx, y: cy, w: 2.85, h: 2.0,
      fill: C.cardBg, shadow: makeCardShadow(), rectRadius: 0.08,
    });
    // Top accent
    slide.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: 2.85, h: 0.05,
      fill: { color: C.primary },
    });
    slide.addText(contents[i].title, {
      x: cx + 0.18, y: cy + 0.18, w: 2.5, h: 0.35,
      fontSize: 13.5, fontFace: "Microsoft YaHei", color: C.textDark,
      bold: true, align: "left", valign: "middle", margin: 0,
    });
    slide.addText(contents[i].subtitle, {
      x: cx + 0.18, y: cy + 0.52, w: 2.5, h: 0.25,
      fontSize: 10, fontFace: "Microsoft YaHei", color: C.primary,
      align: "left", valign: "middle", margin: 0, italic: true,
    });
    contents[i].items.forEach((item, ii) => {
      slide.addText([
        { text: item, options: { bullet: true } },
      ], {
        x: cx + 0.18, y: cy + 0.85 + ii * 0.28, w: 2.5, h: 0.25,
        fontSize: 10, fontFace: "Microsoft YaHei", color: C.textMuted,
        align: "left", valign: "middle", margin: 0,
      });
    });
  }

  // Row 2: 2 cards
  for (let i = 3; i < 5; i++) {
    const cx = 1.55 + (i - 3) * 3.1, cy = 3.55;
    addCard(slide, {
      x: cx, y: cy, w: 2.85, h: 1.7,
      fill: C.cardBg, shadow: makeCardShadow(), rectRadius: 0.08,
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: 2.85, h: 0.05,
      fill: { color: C.accent },
    });
    slide.addText(contents[i].title, {
      x: cx + 0.18, y: cy + 0.18, w: 2.5, h: 0.35,
      fontSize: 13.5, fontFace: "Microsoft YaHei", color: C.textDark,
      bold: true, align: "left", valign: "middle", margin: 0,
    });
    slide.addText(contents[i].subtitle, {
      x: cx + 0.18, y: cy + 0.52, w: 2.5, h: 0.25,
      fontSize: 10, fontFace: "Microsoft YaHei", color: C.accent,
      align: "left", valign: "middle", margin: 0, italic: true,
    });
    contents[i].items.forEach((item, ii) => {
      slide.addText([
        { text: item, options: { bullet: true } },
      ], {
        x: cx + 0.18, y: cy + 0.85 + ii * 0.28, w: 2.5, h: 0.25,
        fontSize: 10, fontFace: "Microsoft YaHei", color: C.textMuted,
        align: "left", valign: "middle", margin: 0,
      });
    });
  }
})();

// ============================================================
// SLIDE 10: Part 3 - 设计文档与表达
// ============================================================
(() => {
  const slide = pres.addSlide();
  slide.background = { color: C.lightBg };
  addTopAccent(slide, C.accent);

  slide.addText("PART 3", {
    x: 0.5, y: 0.2, w: 2, h: 0.3,
    fontSize: 10, fontFace: "Arial", color: C.primary,
    bold: true, align: "left", valign: "middle", margin: 0, charSpacing: 4,
  });

  addSectionBar(slide, 0.5, 0.55, 0.08, C.accent);
  slide.addText("设计文档与表达", {
    x: 0.75, y: 0.5, w: 8, h: 0.55,
    fontSize: 26, fontFace: "Microsoft YaHei", color: C.textDark,
    bold: true, align: "left", valign: "middle", margin: 0,
  });

  const docs = [
    {
      title: "关卡设计文档 LDD",
      desc: "设计目标 · 空间结构 · 动线分析\n引导设计 · 节奏规划",
      icon: "📋",
      color: C.primary,
    },
    {
      title: "平面图与动线图",
      desc: "标注路径/地标等关键位置\n可视化呈现空间设计思路",
      icon: "🗺",
      color: C.accent,
    },
    {
      title: "设计思路表达",
      desc: "用专业方式表达设计内容\n清晰的逻辑 > 华丽的辞藻",
      icon: "💡",
      color: C.accent2,
    },
    {
      title: "协作流程对接",
      desc: "与战斗/数值/美术/程序\n需对接内容清晰列出",
      icon: "🤝",
      color: "3B82F6",
    },
  ];

  docs.forEach((doc, i) => {
    const dx = 0.5 + i * 2.35, dy = 1.5;

    addCard(slide, {
      x: dx, y: dy, w: 2.1, h: 2.7,
      fill: C.cardBg, shadow: makeCardShadow(), rectRadius: 0.1,
    });

    // Icon circle
    slide.addShape(pres.shapes.OVAL, {
      x: dx + 0.6, y: dy + 0.3, w: 0.9, h: 0.9,
      fill: { color: doc.color, transparency: 15 },
      line: { color: doc.color, width: 1.5 },
    });
    slide.addText(doc.icon, {
      x: dx + 0.6, y: dy + 0.3, w: 0.9, h: 0.9,
      fontSize: 28, align: "center", valign: "middle", margin: 0,
    });

    // Title
    slide.addText(doc.title, {
      x: dx + 0.15, y: dy + 1.45, w: 1.8, h: 0.4,
      fontSize: 14, fontFace: "Microsoft YaHei", color: C.textDark,
      bold: true, align: "center", valign: "middle", margin: 0,
    });
    // Description
    slide.addText(doc.desc, {
      x: dx + 0.15, y: dy + 1.9, w: 1.8, h: 0.65,
      fontSize: 10.5, fontFace: "Microsoft YaHei", color: C.textMuted,
      align: "center", valign: "top", margin: [4, 4, 4, 4],
      lineSpacing: 17,
    });
  });

  // Bottom highlight
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 4.55, w: 9, h: 0.55,
    fill: { color: "FFF8F0" }, rectRadius: 0.06,
    line: { color: C.accent2, width: 1 },
  });
  slide.addText("📌 文档是关卡策划的「第二张脸」—— 好的文档能替你说话，差的文档会埋没你的设计", {
    x: 0.7, y: 4.55, w: 8.6, h: 0.55,
    fontSize: 12, fontFace: "Microsoft YaHei", color: C.warnText,
    align: "center", valign: "middle", margin: 0, bold: true,
  });
})();

// ============================================================
// SLIDE 11: Part 3 - 设计草稿方法论
// ============================================================
(() => {
  const slide = pres.addSlide();
  slide.background = { color: C.lightBg };
  addTopAccent(slide, C.primary);

  slide.addText("PART 3", {
    x: 0.5, y: 0.2, w: 2, h: 0.3,
    fontSize: 10, fontFace: "Arial", color: C.primary,
    bold: true, align: "left", valign: "middle", margin: 0, charSpacing: 4,
  });

  addSectionBar(slide, 0.5, 0.55, 0.08, C.primary);
  slide.addText("设计草稿方法论", {
    x: 0.75, y: 0.5, w: 8, h: 0.55,
    fontSize: 26, fontFace: "Microsoft YaHei", color: C.textDark,
    bold: true, align: "left", valign: "middle", margin: 0,
  });

  // Step flow: 7 steps in a visual process
  const steps = [
    { num: "1", title: "目标", desc: "为什么设计\n这个关卡", color: C.primary },
    { num: "2", title: "主题", desc: "逃脱/暗杀/\n潜入/…", color: C.accent2 },
    { num: "3", title: "元素", desc: "敌人/NPC/\n道具/场景", color: C.accent },
    { num: "4", title: "流程", desc: "长期+短期\n目标结合", color: "3B82F6" },
    { num: "5", title: "桥段", desc: "游戏风格\n关键时刻", color: "8B5CF6" },
    { num: "6", title: "问题", desc: "元素→方案\n解决设计", color: "EC4899" },
    { num: "7", title: "终点", desc: "关卡成功\n结束条件", color: C.primary },
  ];

  // Top row: 4 steps
  for (let i = 0; i < 4; i++) {
    const sx = 0.35 + i * 2.4, sy = 1.3;
    addCard(slide, {
      x: sx, y: sy, w: 2.15, h: 1.7,
      fill: C.cardBg, shadow: makeCardShadow(), rectRadius: 0.08,
    });

    // Number circle
    slide.addShape(pres.shapes.OVAL, {
      x: sx + 0.75, y: sy + 0.15, w: 0.55, h: 0.55,
      fill: { color: steps[i].color },
    });
    slide.addText(steps[i].num, {
      x: sx + 0.75, y: sy + 0.15, w: 0.55, h: 0.55,
      fontSize: 20, fontFace: "Arial", color: "FFFFFF",
      bold: true, align: "center", valign: "middle", margin: 0,
    });
    slide.addText(steps[i].title, {
      x: sx + 0.1, y: sy + 0.8, w: 1.95, h: 0.35,
      fontSize: 15, fontFace: "Microsoft YaHei", color: C.textDark,
      bold: true, align: "center", valign: "middle", margin: 0,
    });
    slide.addText(steps[i].desc, {
      x: sx + 0.1, y: sy + 1.15, w: 1.95, h: 0.45,
      fontSize: 10.5, fontFace: "Microsoft YaHei", color: C.textMuted,
      align: "center", valign: "top", margin: [2, 4, 2, 4],
      lineSpacing: 16,
    });

    // Arrow between (not last)
    if (i < 3) {
      slide.addText("→", {
        x: sx + 2.15, y: sy + 0.7, w: 0.25, h: 0.4,
        fontSize: 18, color: C.textMuted, align: "center", valign: "middle", margin: 0,
      });
    }
  }

  // Bottom row: 3 steps
  for (let i = 4; i < 7; i++) {
    const sx = 1.55 + (i - 4) * 2.4, sy = 3.2;
    addCard(slide, {
      x: sx, y: sy, w: 2.15, h: 1.7,
      fill: C.cardBg, shadow: makeCardShadow(), rectRadius: 0.08,
    });

    slide.addShape(pres.shapes.OVAL, {
      x: sx + 0.75, y: sy + 0.15, w: 0.55, h: 0.55,
      fill: { color: steps[i].color },
    });
    slide.addText(steps[i].num, {
      x: sx + 0.75, y: sy + 0.15, w: 0.55, h: 0.55,
      fontSize: 20, fontFace: "Arial", color: "FFFFFF",
      bold: true, align: "center", valign: "middle", margin: 0,
    });
    slide.addText(steps[i].title, {
      x: sx + 0.1, y: sy + 0.8, w: 1.95, h: 0.35,
      fontSize: 15, fontFace: "Microsoft YaHei", color: C.textDark,
      bold: true, align: "center", valign: "middle", margin: 0,
    });
    slide.addText(steps[i].desc, {
      x: sx + 0.1, y: sy + 1.15, w: 1.95, h: 0.45,
      fontSize: 10.5, fontFace: "Microsoft YaHei", color: C.textMuted,
      align: "center", valign: "top", margin: [2, 4, 2, 4],
      lineSpacing: 16,
    });

    if (i < 6) {
      slide.addText("→", {
        x: sx + 2.15, y: sy + 0.7, w: 0.25, h: 0.4,
        fontSize: 18, color: C.textMuted, align: "center", valign: "middle", margin: 0,
      });
    }
  }

  // Process note at bottom
  slide.addText("💡 「先关注设计案的逻辑性，而不是空间感和视觉性布局——这个可以之后再考虑」", {
    x: 0.5, y: 5.05, w: 9, h: 0.35,
    fontSize: 10.5, fontFace: "Microsoft YaHei", color: C.textMuted,
    align: "center", valign: "middle", margin: 0, italic: true,
  });
})();

// ============================================================
// SLIDE 12: Part 3 - 游戏拆解作品 & 差异化
// ============================================================
(() => {
  const slide = pres.addSlide();
  slide.background = { color: C.lightBg };
  addTopAccent(slide, C.primary);

  slide.addText("PART 3", {
    x: 0.5, y: 0.2, w: 2, h: 0.3,
    fontSize: 10, fontFace: "Arial", color: C.primary,
    bold: true, align: "left", valign: "middle", margin: 0, charSpacing: 4,
  });

  addSectionBar(slide, 0.5, 0.55, 0.08, C.primary);
  slide.addText("游戏拆解作品 & 差异化优势", {
    x: 0.75, y: 0.5, w: 8, h: 0.55,
    fontSize: 26, fontFace: "Microsoft YaHei", color: C.textDark,
    bold: true, align: "left", valign: "middle", margin: 0,
  });

  // Left column: 游戏拆解
  addCard(slide, {
    x: 0.5, y: 1.4, w: 4.3, h: 3.6,
    fill: C.cardBg, shadow: makeCardShadow(), rectRadius: 0.1,
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.4, w: 4.3, h: 0.06,
    fill: { color: C.primary },
  });

  addNumberCircle(slide, 1, 0.8, 1.6, 0.45, C.primary);
  slide.addText("游戏拆解作品", {
    x: 1.4, y: 1.6, w: 3.1, h: 0.45,
    fontSize: 17, fontFace: "Microsoft YaHei", color: C.textDark,
    bold: true, align: "left", valign: "middle", margin: 0,
  });

  const analysisItems = [
    { title: "深度关卡拆解", desc: "图文并茂，条理清晰，从空间/引导/节奏/叙事多维度分析" },
    { title: "改进设计提案", desc: "基于拆解结论，系统性地提出自己的改进方案与设计思路" },
  ];
  analysisItems.forEach((item, ii) => {
    const iy = 2.3 + ii * 1.1;
    slide.addText(item.title, {
      x: 0.8, y: iy, w: 3.7, h: 0.3,
      fontSize: 13, fontFace: "Microsoft YaHei", color: C.textDark,
      bold: true, align: "left", valign: "middle", margin: 0,
    });
    slide.addText([
      { text: item.desc, options: { bullet: true } },
    ], {
      x: 0.8, y: iy + 0.3, w: 3.7, h: 0.6,
      fontSize: 10.5, fontFace: "Microsoft YaHei", color: C.textMuted,
      align: "left", valign: "top", margin: 0, lineSpacing: 16,
    });
  });

  // Right column: 差异化优势
  addCard(slide, {
    x: 5.2, y: 1.4, w: 4.3, h: 3.6,
    fill: C.cardBg, shadow: makeCardShadow(), rectRadius: 0.1,
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.4, w: 4.3, h: 0.06,
    fill: { color: C.accent },
  });

  // Star badge
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 8.4, y: 1.5, w: 0.85, h: 0.3,
    fill: { color: C.accent2 }, rectRadius: 0.06,
  });
  slide.addText("⭐ 加分项", {
    x: 8.4, y: 1.5, w: 0.85, h: 0.3,
    fontSize: 8, fontFace: "Microsoft YaHei", color: "FFFFFF",
    bold: true, align: "center", valign: "middle", margin: 0,
  });

  addNumberCircle(slide, 2, 5.5, 1.6, 0.45, C.accent);
  slide.addText("差异化优势包装", {
    x: 6.1, y: 1.6, w: 2.2, h: 0.45,
    fontSize: 17, fontFace: "Microsoft YaHei", color: C.textDark,
    bold: true, align: "left", valign: "middle", margin: 0,
  });

  const diffItems = [
    { title: "关卡叙事 / 空间美学", desc: "用场景布局讲故事，展示雕塑/装置作品的空间设计能力" },
    { title: "从雕塑到游戏策划", desc: "在作品集/简历中阐明跨专业选择游戏策划的原因与思考" },
  ];
  diffItems.forEach((item, ii) => {
    const iy = 2.3 + ii * 1.1;
    slide.addText(item.title, {
      x: 5.5, y: iy, w: 3.7, h: 0.3,
      fontSize: 13, fontFace: "Microsoft YaHei", color: C.textDark,
      bold: true, align: "left", valign: "middle", margin: 0,
    });
    slide.addText([
      { text: item.desc, options: { bullet: true } },
    ], {
      x: 5.5, y: iy + 0.3, w: 3.7, h: 0.6,
      fontSize: 10.5, fontFace: "Microsoft YaHei", color: C.textMuted,
      align: "left", valign: "top", margin: 0, lineSpacing: 16,
    });
  });

  // Bottom tip
  slide.addText("💡 差异化 = 你的独特背景 + 行业的通用需求。雕塑/装置的「空间设计」能力 → 关卡策划的「空间叙事」", {
    x: 0.5, y: 5.1, w: 9, h: 0.35,
    fontSize: 10, fontFace: "Microsoft YaHei", color: C.textMuted,
    align: "center", valign: "middle", margin: 0, italic: true,
  });
})();

// ============================================================
// SLIDE 13: Part 4 - 课后作业
// ============================================================
(() => {
  const slide = pres.addSlide();
  slide.background = { color: C.lightBg };
  addTopAccent(slide, C.primary);

  slide.addText("PART 4", {
    x: 0.5, y: 0.2, w: 2, h: 0.3,
    fontSize: 10, fontFace: "Arial", color: C.primary,
    bold: true, align: "left", valign: "middle", margin: 0, charSpacing: 4,
  });

  addSectionBar(slide, 0.5, 0.55, 0.08, C.primary);
  slide.addText("课后作业", {
    x: 0.75, y: 0.5, w: 8, h: 0.55,
    fontSize: 26, fontFace: "Microsoft YaHei", color: C.textDark,
    bold: true, align: "left", valign: "middle", margin: 0,
  });

  // Assignment 1
  addCard(slide, {
    x: 0.5, y: 1.35, w: 9.0, h: 1.5,
    fill: C.cardBg, shadow: makeCardShadow(), rectRadius: 0.1,
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.35, w: 0.06, h: 1.5,
    fill: { color: C.primary },
  });

  addNumberCircle(slide, 1, 0.85, 1.55, 0.48, C.primary);
  slide.addText("归纳总结：关卡设计五要素", {
    x: 1.55, y: 1.55, w: 7.5, h: 0.45,
    fontSize: 16, fontFace: "Microsoft YaHei", color: C.textDark,
    bold: true, align: "left", valign: "middle", margin: 0,
  });
  slide.addText("你是如何理解关卡设计的五个要素的？", {
    x: 1.55, y: 2.0, w: 7.5, h: 0.3,
    fontSize: 12, fontFace: "Microsoft YaHei", color: C.textMuted,
    align: "left", valign: "middle", margin: 0,
  });
  // Five element tags
  const elems = ["空间", "节奏", "引导", "挑战", "叙事"];
  elems.forEach((e, ei) => {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 1.55 + ei * 1.35, y: 2.4, w: 1.15, h: 0.32,
      fill: { color: "F0F0FF" }, rectRadius: 0.05,
    });
    slide.addText(e, {
      x: 1.55 + ei * 1.35, y: 2.4, w: 1.15, h: 0.32,
      fontSize: 11, fontFace: "Microsoft YaHei", color: C.primary,
      bold: true, align: "center", valign: "middle", margin: 0,
    });
  });

  // Assignment 2
  addCard(slide, {
    x: 0.5, y: 3.1, w: 9.0, h: 2.2,
    fill: C.cardBg, shadow: makeCardShadow(), rectRadius: 0.1,
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.1, w: 0.06, h: 2.2,
    fill: { color: C.accent },
  });

  addNumberCircle(slide, 2, 0.85, 3.3, 0.48, C.accent);
  slide.addText("选取一款游戏的线性关卡，做系统关卡分析", {
    x: 1.55, y: 3.3, w: 7.5, h: 0.45,
    fontSize: 16, fontFace: "Microsoft YaHei", color: C.textDark,
    bold: true, align: "left", valign: "middle", margin: 0,
  });
  slide.addText("附上必要的图片/视频，下节课开始时进行口述展示", {
    x: 1.55, y: 3.75, w: 7.5, h: 0.3,
    fontSize: 12, fontFace: "Microsoft YaHei", color: C.textMuted,
    align: "left", valign: "middle", margin: 0,
  });

  // Sub-requirements in 2 columns
  const reqsLeft = [
    "① 画出关卡示意图（3D俯视图/2D侧视图）",
    "② 空间概念说明 + 设计用意与理由",
    "③ 标出 1-2 处成功引导，说明理由",
  ];
  const reqsRight = [
    "④ 分析关卡难度曲线",
    "⑤ 分析怪物布局与事件布局",
    "⑥ 分析关卡环境叙事设计",
  ];

  reqsLeft.forEach((r, ri) => {
    slide.addText(r, {
      x: 1.55, y: 4.1 + ri * 0.35, w: 3.8, h: 0.26,
      fontSize: 10.5, fontFace: "Microsoft YaHei", color: C.textDark,
      align: "left", valign: "middle", margin: 0,
    });
  });
  reqsRight.forEach((r, ri) => {
    slide.addText(r, {
      x: 5.5, y: 4.1 + ri * 0.35, w: 3.8, h: 0.26,
      fontSize: 10.5, fontFace: "Microsoft YaHei", color: C.textDark,
      align: "left", valign: "middle", margin: 0,
    });
  });
})();

// ============================================================
// SLIDE 14: 下期预告 & 总结 (Dark)
// ============================================================
(() => {
  const slide = pres.addSlide();
  slide.background = { color: C.darkBg };

  // Decorative elements
  slide.addShape(pres.shapes.OVAL, {
    x: -2, y: 3.5, w: 5, h: 5,
    fill: { color: C.accent, transparency: 88 },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 8, y: -1, w: 3, h: 3,
    fill: { color: C.primary, transparency: 85 },
  });

  // Main content area
  slide.addText("下期预告", {
    x: 0.5, y: 0.8, w: 9, h: 0.7,
    fontSize: 32, fontFace: "Microsoft YaHei", color: "FFFFFF",
    bold: true, align: "center", valign: "middle", margin: 0,
  });

  // Accent line
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 4.2, y: 1.55, w: 1.6, h: 0.05,
    fill: { color: C.primary },
  });

  slide.addText("（预告内容将在下节课揭晓）", {
    x: 0.5, y: 1.85, w: 9, h: 0.5,
    fontSize: 16, fontFace: "Microsoft YaHei", color: C.textLight,
    align: "center", valign: "middle", margin: 0,
  });

  // Summary box
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 1.5, y: 2.8, w: 7.0, h: 2.0,
    fill: { color: "252540" },
    rectRadius: 0.12,
    line: { color: C.primary, width: 1 },
  });

  slide.addText("本节课要点回顾", {
    x: 1.8, y: 2.95, w: 6.4, h: 0.4,
    fontSize: 16, fontFace: "Microsoft YaHei", color: "FFFFFF",
    bold: true, align: "center", valign: "middle", margin: 0,
  });

  const summaryItems = [
    "单机 vs 商业游戏：两种完全不同的职业路径",
    "关卡策划作品集 = 关卡作品 + 设计文档 + 拆解作品",
    "设计草稿七步法：从「为什么做」到「怎么完成」",
    "差异化优势 = 你的独特背景 × 行业通用需求",
  ];
  summaryItems.forEach((s, si) => {
    slide.addText([
      { text: s, options: { bullet: true } },
    ], {
      x: 2.0, y: 3.45 + si * 0.35, w: 6.0, h: 0.26,
      fontSize: 11.5, fontFace: "Microsoft YaHei", color: C.textLight,
      align: "left", valign: "middle", margin: 0,
    });
  });

  // Bottom
  slide.addText("感谢聆听 · 下节课见", {
    x: 0.5, y: 5.0, w: 9, h: 0.4,
    fontSize: 13, fontFace: "Microsoft YaHei", color: "CCCCD6",
    align: "center", valign: "middle", margin: 0, italic: true,
  });
})();

// ── Generate ──
const outPath = "/Users/isaachsiadocs/Library/CloudStorage/OneDrive-共享的库-onedrive/Private/个人知识库/策划培训/温润祺培训/Lesson2_关卡策划入门.pptx";
pres.writeFile({ fileName: outPath }).then(() => {
  console.log("✅ PPTX generated: " + outPath);
}).catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
