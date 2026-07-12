const pptxgen = require("pptxgenjs");

// ─── Presentation Setup ───
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10" × 5.625"
pres.author = "Isaac Hsiadocs";
pres.title = "DS3 洛斯里克高墙 关卡拆解① — 高墙前期";

// ─── Color Palette (Dark Souls theme) ───
const C = {
  darkBg:    "1A1A1E",
  darkCard:  "252528",
  lightBg:   "F5F1ED",
  whiteCard: "FFFFFF",
  gold:      "C8A050",
  deepGold:  "8B6914",
  darkText:  "1A1A1E",
  lightText: "E8E3DC",
  border:    "B8A88A",
  lightMuted:"8A8578",
  tableHead: "252528",
  tableStripe:"F0EBE3",
  tableAlt:  "FAF8F5",
  redAccent: "9B3030",
};

// ─── Factory Functions (no reused option objects!) ───
const mkShadow = () => ({ type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.12 });
const mkCardShadow = () => ({ type: "outer", color: "000000", blur: 8, offset: 3, angle: 135, opacity: 0.18 });

// Page title text style factory
const titleOpts = (color) => ({
  fontSize: 30, fontFace: "Georgia", color, bold: true, margin: 0
});
const subtitleOpts = (color) => ({
  fontSize: 16, fontFace: "Georgia", color, italic: true, margin: 0
});

// Add chapter label bar at top of content slides
function addTitleBar(slide, chapter, title) {
  // Gold square
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 0.32, w: 0.22, h: 0.22,
    fill: { color: C.gold },
  });
  // Chapter label
  slide.addText(chapter, {
    x: 0.82, y: 0.3, w: 3, h: 0.28,
    fontSize: 10, fontFace: "Calibri", color: C.gold, bold: true,
    charSpacing: 3, valign: "middle", margin: 0,
  });
  // Slide title
  slide.addText(title, {
    x: 0.5, y: 0.65, w: 9.0, h: 0.5,
    fontSize: 30, fontFace: "Georgia", color: C.darkText, bold: true, margin: 0,
  });
  // Thin gold separator line
  slide.addShape(pres.shapes.LINE, {
    x: 0.5, y: 1.22, w: 9.0, h: 0,
    line: { color: C.gold, width: 1.0 },
  });
}

// Screenshot placeholder area
function addScreenshotArea(slide, x, y, w, h, label) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: C.lightBg, transparency: 30 },
    line: { color: C.border, width: 1.5, dashType: "dash" },
    shadow: mkShadow(),
  });
  slide.addText(label || "📷 插入游戏截图", {
    x, y, w, h,
    fontSize: 10, fontFace: "Calibri", color: C.border, align: "center", valign: "middle",
  });
}

// ─── Helper: make a slide with light background and title bar ───
function makeContentSlide(chapter, title) {
  const slide = pres.addSlide();
  slide.background = { color: C.lightBg };
  addTitleBar(slide, chapter, title);
  return slide;
}

// ─── Helper: add content card (white rectangle with shadow) ───
function addCard(slide, x, y, w, h) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: C.whiteCard },
    shadow: mkCardShadow(),
  });
}

// ─── Helper: body text ───
function addBodyText(slide, text, x, y, w, h, opts = {}) {
  slide.addText(text, {
    x, y, w, h,
    fontSize: 13, fontFace: "Calibri", color: C.darkText,
    lineSpacingMultiple: 1.3, valign: "top", margin: 0,
    ...opts,
  });
}

// ─── Helper: table with dark header and alternating rows ───
function addStyledTable(slide, rows, x, y, w, colW, opts = {}) {
  const headerRow = rows[0].map(cell => ({
    text: typeof cell === "string" ? cell : cell.text,
    options: {
      fill: { color: C.tableHead },
      color: C.gold,
      bold: true,
      fontSize: 11,
      fontFace: "Calibri",
      align: "center",
      valign: "middle",
      border: { pt: 0.5, color: C.tableHead },
    },
  }));
  const dataRows = rows.slice(1).map((row, ri) =>
    row.map((cell, ci) => ({
      text: typeof cell === "string" ? cell : cell.text,
      options: {
        fill: { color: ri % 2 === 0 ? C.tableAlt : C.whiteCard },
        color: C.darkText,
        fontSize: typeof cell === "object" && cell.fontSize ? cell.fontSize : 10.5,
        fontFace: "Calibri",
        align: typeof cell === "object" && cell.align ? cell.align : (ci === 0 ? "left" : "left"),
        valign: "middle",
        border: { pt: 0.3, color: "E0DCD3" },
        ...(typeof cell === "object" && cell.bold ? { bold: true } : {}),
      },
    }))
  );
  slide.addTable([headerRow, ...dataRows], {
    x, y, w,
    colW: colW || Array(rows[0].length).fill(w / rows[0].length),
    border: { pt: 0 },
    rowH: [0.35, ...Array(rows.length - 1).fill(0.32)],
    ...opts,
  });
}

function fmt(text, opts = {}) {
  return { text, ...opts };
}

// ═══════════════════════════════════════════
// SLIDE 1 — Cover (Dark)
// ═══════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.darkBg };

  // Gold accent line at top
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: C.gold },
  });

  // Main title
  slide.addText("黑暗之魂3", {
    x: 0.8, y: 1.0, w: 8.4, h: 0.7,
    fontSize: 24, fontFace: "Georgia", color: C.gold,
    charSpacing: 6, margin: 0,
  });
  slide.addText("洛斯里克高墙 关卡拆解①", {
    x: 0.8, y: 1.65, w: 8.4, h: 0.8,
    fontSize: 38, fontFace: "Georgia", color: C.lightText, bold: true, margin: 0,
  });
  slide.addText("高 墙 前 期", {
    x: 0.8, y: 2.5, w: 8.4, h: 0.7,
    fontSize: 28, fontFace: "Georgia", color: C.deepGold, charSpacing: 12, margin: 0,
  });

  // Gold separator
  slide.addShape(pres.shapes.LINE, {
    x: 0.8, y: 3.4, w: 2.5, h: 0,
    line: { color: C.gold, width: 1.5 },
  });

  // Subtitle / core thesis
  slide.addText([
    { text: "核心论点：", options: { bold: true, color: C.gold, fontSize: 14 } },
    { text: "高墙是玩家的「新手保姆」——\n通过POI兴趣点系统、光影引导、教学式战斗编排、\n偷袭时机控制，在玩家无意识中完成游戏基础语法的教学。", options: { fontSize: 13 } },
  ], {
    x: 0.8, y: 3.6, w: 8.0, h: 1.0,
    fontFace: "Calibri", color: C.lightText, lineSpacingMultiple: 1.5, margin: 0,
  });

  // Source
  slide.addText("来源：Bilibili · Ymagine 「宫崎英俊十年前的设计水平？」2026-01-04", {
    x: 0.8, y: 4.9, w: 8.4, h: 0.4,
    fontSize: 9.5, fontFace: "Calibri", color: "6A6868", margin: 0,
  });

  // Gold bottom line
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.565, w: 10, h: 0.06,
    fill: { color: C.gold },
  });
}

// ═══════════════════════════════════════════
// SLIDE 2 — Core Thesis (Dark)
// ═══════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.darkBg };

  // Top gold line
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: C.gold },
  });

  // Gold square + label
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 0.32, w: 0.22, h: 0.22,
    fill: { color: C.gold },
  });
  slide.addText("核心论点", {
    x: 0.82, y: 0.3, w: 3, h: 0.28,
    fontSize: 10, fontFace: "Calibri", color: C.gold, bold: true, charSpacing: 3, valign: "middle", margin: 0,
  });

  // Title
  slide.addText("高墙：玩家的「新手保姆」", {
    x: 0.5, y: 0.68, w: 9.0, h: 0.55,
    fontSize: 30, fontFace: "Georgia", color: C.lightText, bold: true, margin: 0,
  });
  slide.addShape(pres.shapes.LINE, {
    x: 0.5, y: 1.28, w: 9.0, h: 0,
    line: { color: C.gold, width: 1.0 },
  });

  // Left column: core argument card
  addCard(slide, 0.5, 1.5, 5.2, 1.8);
  slide.addText([
    { text: "「新手保姆」的含义\n\n", options: { bold: true, fontSize: 16, fontFace: "Georgia", color: C.darkText, breakLine: true } },
    { text: "在玩家接触的第一个大型地图中，FromSoftware 通过精心编排的空间、敌人、光影和路线，在玩家 ", options: { fontSize: 12.5 } },
    { text: "无意识中", options: { bold: true, fontSize: 12.5, color: C.gold } },
    { text: " 完成以下教学：", options: { fontSize: 12.5 } },
  ], {
    x: 0.7, y: 1.6, w: 4.8, h: 1.6,
    fontFace: "Calibri", color: C.darkText, lineSpacingMultiple: 1.35, margin: [8, 8, 4, 4],
  });

  // Right column: 3 key learnings in cards
  const learnings = [
    { icon: "⚔️", title: "基础战斗语法", desc: "一对一 → 一对多 → 强敌 → 机制敌" },
    { icon: "🔍", title: "探索习惯培养", desc: "隐藏支路 + 拾取物奖励循环" },
    { icon: "💀", title: "世界观认知", desc: "「危机四伏的世界」+「散布奖励的世界」" },
  ];
  learnings.forEach((l, i) => {
    const ly = 1.5 + i * 1.1;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 6.0, y: ly, w: 3.5, h: 0.95,
      fill: { color: C.darkCard },
      shadow: mkShadow(),
    });
    slide.addText(l.icon, {
      x: 6.1, y: ly + 0.1, w: 0.5, h: 0.75,
      fontSize: 18, align: "center", valign: "middle", margin: 0,
    });
    slide.addText([
      { text: l.title, options: { bold: true, fontSize: 13, breakLine: true } },
      { text: l.desc, options: { fontSize: 10, color: "AAA8A0" } },
    ], {
      x: 6.6, y: ly + 0.1, w: 2.8, h: 0.75,
      fontFace: "Calibri", color: C.lightText, lineSpacingMultiple: 1.3, valign: "middle", margin: 0,
    });
  });

  // Bottom: scope
  slide.addText("第一期范围：初始之塔 → 龙石塔 → 火龙塔 → 高墙边塔（篝火）     第二期：高墙深处 → 复杂度跃升", {
    x: 0.5, y: 4.7, w: 9.0, h: 0.5,
    fontSize: 11, fontFace: "Calibri", color: "6A6868", margin: 0,
  });
  slide.addShape(pres.shapes.LINE, {
    x: 0.5, y: 4.55, w: 9.0, h: 0,
    line: { color: "3A3A3E", width: 0.5 },
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.565, w: 10, h: 0.06,
    fill: { color: C.gold },
  });
}

// ═══════════════════════════════════════════
// SLIDE 3 — Design Goals (Light)
// ═══════════════════════════════════════════
{
  const slide = makeContentSlide("教学设计", "高墙的设计目的");
  slide.background = { color: C.lightBg };

  // Intro text
  addBodyText(slide, "作为玩家接触的第一个大型地图，高墙承载着明确的「新手教学」使命：", 0.5, 1.38, 5.5, 0.45, { fontSize: 11.5 });

  // Table: 5 design goals
  addStyledTable(slide, [
    [{ text: "设计目标", bold: true, fontSize: 10.5 }, { text: "实现策略", bold: true, fontSize: 10.5 }],
    ["难度调低", "大部分一对一战斗、区块单一出入口、纵深最多三层"],
    ["世界观展开", "场景叙事（龙尸、战火痕迹）、远景字幕"],
    ["引入魂系设计", "逐渐引入单向捷径、偷袭、宝箱怪"],
    ["培养探索习惯", "隐藏支路 + 拾取物奖励循环"],
    ["建立游戏底层认知", "「危机四伏的世界」+「散布奖励的世界」"],
  ], 0.5, 1.95, 5.5, [1.8, 3.7], { rowH: [0.30, 0.25, 0.25, 0.25, 0.25, 0.25] });

  // Screenshot placeholder
  addScreenshotArea(slide, 6.3, 1.38, 3.3, 3.5, "📷 高墙远景全景图\n（初始塔大门推开第一幕）");

  // Bottom note
  addBodyText(slide, "💡 每个设计目标都通过具体的关卡编排手段实现，而非依靠文字教程。", 0.5, 4.95, 5.5, 0.3,
    { fontSize: 9.5, color: C.deepGold, italic: true });
}

// ═══════════════════════════════════════════
// SLIDE 4 — Map Overview (Light)
// ═══════════════════════════════════════════
{
  const slide = makeContentSlide("地图结构", "地图总览：环状动线与纵向结构");

  // Left: Flow diagram as styled boxes
  const boxH = 0.55;
  const boxW = 1.7;
  const startY = 1.55;
  const midX = 1.35;

  // Route boxes
  const towers = [
    { label: "初始之塔", desc: "起点/篝火", x: midX },
    { label: "龙石塔", desc: "教学区", x: midX },
    { label: "火龙塔", desc: "高潮区", x: midX },
    { label: "高墙边塔", desc: "本期终点", x: midX, highlight: true },
  ];

  towers.forEach((t, i) => {
    const y = startY + i * 0.85;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: t.x, y, w: boxW, h: boxH,
      fill: { color: t.highlight ? C.gold : C.whiteCard },
      shadow: mkShadow(),
    });
    slide.addText([
      { text: t.label, options: { bold: true, fontSize: 12, color: t.highlight ? C.lightText : C.darkText, breakLine: true } },
      { text: t.desc, options: { fontSize: 9, color: t.highlight ? C.darkText : C.lightMuted } },
    ], {
      x: t.x, y, w: boxW, h: boxH,
      fontFace: "Calibri", align: "center", valign: "middle", margin: 0,
    });

    // Arrow between boxes
    if (i < towers.length - 1) {
      slide.addText("↓", {
        x: t.x, y: y + boxH, w: boxW, h: 0.25,
        fontSize: 14, align: "center", color: C.gold, fontFace: "Calibri", margin: 0,
      });
    }
  });

  // Return path arrow (curved back)
  slide.addShape(pres.shapes.LINE, {
    x: midX + boxW, y: startY + 2.55, w: 1.2, h: 0,
    line: { color: C.deepGold, width: 1.5, dashType: "dash" },
  });
  slide.addText("返程捷径电梯 ↺", {
    x: midX + boxW + 0.1, y: startY + 2.4, w: 2.0, h: 0.4,
    fontSize: 9, fontFace: "Calibri", color: C.deepGold, italic: true, margin: 0,
  });

  // Right column: Key characteristics
  addCard(slide, 4.8, 1.45, 4.7, 3.7);

  // Vertical structure info
  slide.addText("纵向结构", {
    x: 5.0, y: 1.55, w: 4.3, h: 0.35,
    fontSize: 16, fontFace: "Georgia", color: C.darkText, bold: true, margin: 0,
  });

  const vertPoints = [
    "推图路线自上而下，逐渐前往高墙深处",
    "区块之间由单一出入口相连（前期低复杂度）",
    "同一区块最多三层结构",
    "上下连通路径少、复杂度低 → 适配新手",
  ];
  vertPoints.forEach((p, i) => {
    slide.addText([
      { text: `${i + 1}.  `, options: { bold: true, color: C.gold, fontSize: 12 } },
      { text: p, options: { fontSize: 11.5 } },
    ], {
      x: 5.0, y: 1.95 + i * 0.55, w: 4.3, h: 0.55,
      fontFace: "Calibri", color: C.darkText, lineSpacingMultiple: 1.2, margin: 0,
    });
  });

  // Galaxyvania connection
  slide.addText([
    { text: "🎮 银河城关联：", options: { bold: true, fontSize: 11.5, color: C.deepGold } },
    { text: "水平动线呈环状，与2D银河城游戏同源。玩家在不知不觉中绕圈，捷径开通时柳暗花明之感极强。", options: { fontSize: 11 } },
  ], {
    x: 5.0, y: 4.25, w: 4.3, h: 0.75,
    fontFace: "Calibri", color: C.darkText, lineSpacingMultiple: 1.35, margin: 0,
  });
}

// ═══════════════════════════════════════════
// SLIDE 5 — Difficulty Curve (Light)
// ═══════════════════════════════════════════
{
  const slide = makeContentSlide("难度设计", "难度曲线：起承转合");

  // Table: 4 stages
  addStyledTable(slide, [
    ["阶段", "特点", "玩家状态"],
    [{ text: "起", bold: true }, "简单战斗、低密度", "学习基本操作"],
    [{ text: "承", bold: true }, "难度递进、引入新敌怪", "应用所学"],
    [{ text: "转", bold: true }, "火龙演出 / 洛骑强敌 / 宝箱怪", "情绪激化、节奏变奏"],
    [{ text: "合", bold: true }, "捷径 / 篝火 / NPC", "平复休整"],
  ], 0.5, 1.5, 5.5, [1.0, 2.5, 2.0]);

  // Key quote
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.7, w: 5.5, h: 1.15,
    fill: { color: C.darkBg },
  });
  slide.addText([
    { text: "「", options: { fontSize: 26, fontFace: "Georgia", color: C.gold } },
    { text: "当玩家开始对当前节奏感到厌倦时，就提供捷径或新篝火，使玩家得以休整后面对更大挑战。", options: { fontSize: 11 } },
    { text: " 」", options: { fontSize: 26, fontFace: "Georgia", color: C.gold } },
  ], {
    x: 0.65, y: 3.75, w: 5.2, h: 1.05,
    fontFace: "Calibri", color: C.lightText, lineSpacingMultiple: 1.4, valign: "middle", margin: 0,
  });

  // Screenshot area
  addScreenshotArea(slide, 6.3, 1.45, 3.3, 3.7, "📷 难度曲线示意图\n各区块敌人数/种类对比");

  // Flow rhythm annotation
  addBodyText(slide, "💡 心流设计：起→承→转→合 的节奏变化，通过敌人数/种类/强度的梯度变化精确控制。", 0.5, 4.95, 5.5, 0.3,
    { fontSize: 9.5, color: C.deepGold, italic: true });
}

// ═══════════════════════════════════════════
// SLIDE 6 — Initial Tower: POI System (Light)
// ═══════════════════════════════════════════
{
  const slide = makeContentSlide("区块① 初始之塔", "POI 兴趣点系统 — 玩家的第一印象");

  // POI concept card
  addCard(slide, 0.5, 1.4, 5.5, 1.0);
  slide.addText([
    { text: "POI（Point of Interest，兴趣点）：", options: { bold: true, fontSize: 13, color: C.gold, breakLine: true } },
    { text: "视觉上特异的点吸引玩家注意力，建立关卡推进的预期。推开初始塔大门的第一幕，设计者做了精密的视觉信息编排。", options: { fontSize: 11.5 } },
  ], {
    x: 0.65, y: 1.47, w: 5.2, h: 0.85,
    fontFace: "Calibri", color: C.darkText, lineSpacingMultiple: 1.35, margin: 0,
  });

  // Table: 4 design decisions
  addStyledTable(slide, [
    [{ text: "设计决策", bold: true }, { text: "目的", bold: true }],
    ["墙体不延伸到下楼楼梯\n保留两个前向延伸的侧墙", "留出更大的观景视野"],
    ["近处可见篝火", "提供安全锚点"],
    ["篝火附近的火把光源", "指引前进方向"],
    ["远处发出幽蓝光的舞娘城楼", "建立关卡推进的长期预期"],
  ], 0.5, 2.6, 5.5, [2.3, 3.2]);

  // Route control note
  addBodyText(slide, [
    { text: "路线控制：", options: { bold: true, fontSize: 11.5, color: C.deepGold } },
    { text: "右侧通路被椅子挡住入口、火把藏柱后 —— 这是返程路，难度显著高于正路。不封死玩家自由，但用难度和单向门温和劝退。", options: { fontSize: 11 } },
  ], 0.5, 4.6, 5.5, 0.65);

  // Screenshot
  addScreenshotArea(slide, 6.3, 1.4, 3.3, 3.7, "📷 初始之塔大门推开第一幕\n远景: 舞娘城楼蓝光 + 塔楼群");
}

// ═══════════════════════════════════════════
// SLIDE 7 — Dragon Stone Tower ①: Teaching Combat (Light)
// ═══════════════════════════════════════════
{
  const slide = makeContentSlide("区块② 龙石塔①", "教学式战斗 — 第一幕信息编排");

  // Three-point layout
  const items = [
    { pos: "中间", icon: "⬆️", desc: "延伸的道路汇聚于前进地点", color: C.gold },
    { pos: "左侧", icon: "⬅️", desc: "高亮白光的拾取物", color: "7AAD7A" },
    { pos: "右侧", icon: "➡️", desc: "静止画面中唯一运动的敌怪\n（最高优先级信息）", color: C.redAccent },
  ];

  items.forEach((item, i) => {
    const y = 1.45 + i * 0.85;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 5.5, h: 0.72,
      fill: { color: C.whiteCard },
      shadow: mkShadow(),
    });
    // Accent bar
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 0.07, h: 0.72,
      fill: { color: item.color },
    });
    slide.addText(item.icon, {
      x: 0.7, y, w: 0.5, h: 0.72,
      fontSize: 18, align: "center", valign: "middle", margin: 0,
    });
    slide.addText([
      { text: item.pos, options: { bold: true, fontSize: 12.5, breakLine: true } },
      { text: item.desc, options: { fontSize: 10.5 } },
    ], {
      x: 1.2, y, w: 4.6, h: 0.72,
      fontFace: "Calibri", color: C.darkText, lineSpacingMultiple: 1.25, valign: "middle", margin: 0,
    });
  });

  // Lantern guy teaching
  slide.addText("提灯哥 — 机制教学范本", {
    x: 0.5, y: 3.95, w: 5.5, h: 0.35,
    fontSize: 15, fontFace: "Georgia", color: C.darkText, bold: true, margin: 0,
  });
  const lanternPoints = [
    "1. 行为设计：左右张望、大声呼唤、扑腾引伴、高举提灯示意",
    "2. 时机编排：玩家初见观察犹豫时，身旁小怪很快被引来 → 意识到「必须马上击杀」",
  ];
  lanternPoints.forEach((p, i) => {
    addBodyText(slide, p, 0.5, 4.3 + i * 0.3, 5.5, 0.3, { fontSize: 10.5 });
  });

  // Screenshot
  addScreenshotArea(slide, 6.3, 1.4, 3.3, 3.5, "📷 龙石塔入口第一幕\n左:拾取物 中:道路 右:运动敌怪");
}

// ═══════════════════════════════════════════
// SLIDE 8 — Dragon Stone Tower ②: Teaching Loop (Light)
// ═══════════════════════════════════════════
{
  const slide = makeContentSlide("区块② 龙石塔②", "教学闭环：观察 → 学习 → 实践 → 奖励");

  // Flow diagram: teaching loop
  const loopSteps = ["观察\n敌人行为", "理解\n机制", "实践\n应用", "奖励\n逐个击破", "难度递进\n检验成果"];
  const loopY = 1.60;
  const loopStartX = 0.6;
  const stepW = 0.95;
  const arrowW = 0.22;

  loopSteps.forEach((step, i) => {
    const sx = loopStartX + i * (stepW + arrowW);
    const isReward = i === 3;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: sx, y: loopY, w: stepW, h: 0.7,
      fill: { color: isReward ? C.gold : (i === 4 ? C.darkBg : C.whiteCard) },
      shadow: mkShadow(),
    });
    slide.addText(step, {
      x: sx, y: loopY, w: stepW, h: 0.7,
      fontSize: 10, fontFace: "Calibri",
      color: (isReward || i === 4) ? C.lightText : C.darkText,
      bold: i === 0 || i === 4, align: "center", valign: "middle", margin: 0,
    });
    // Arrow
    if (i < loopSteps.length - 1) {
      slide.addText("→", {
        x: sx + stepW, y: loopY, w: arrowW, h: 0.7,
        fontSize: 16, align: "center", valign: "middle",
        color: C.gold, fontFace: "Calibri", margin: 0,
      });
    }
  });

  // Two scenarios (branch)
  slide.addText("二楼实践场景", {
    x: 0.5, y: 2.55, w: 5.5, h: 0.3,
    fontSize: 13, fontFace: "Georgia", color: C.darkText, bold: true, margin: 0,
  });

  // Success branch
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 2.9, w: 2.6, h: 1.15,
    fill: { color: C.whiteCard },
    shadow: mkShadow(),
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 2.9, w: 2.6, h: 0.06,
    fill: { color: C.gold },
  });
  slide.addText([
    { text: "✅ 速杀提灯哥\n", options: { bold: true, fontSize: 12, color: C.gold, breakLine: true } },
    { text: "→ 敌怪不醒\n→ 逐个击破\n→ 获得奖励", options: { fontSize: 10.5 } },
  ], {
    x: 0.6, y: 3.0, w: 2.4, h: 0.95,
    fontFace: "Calibri", color: C.darkText, lineSpacingMultiple: 1.4, margin: 0,
  });

  // Failure branch
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 3.4, y: 2.9, w: 2.6, h: 1.15,
    fill: { color: C.darkBg },
    shadow: mkShadow(),
  });
  slide.addText([
    { text: "❌ 没速杀\n", options: { bold: true, fontSize: 12, color: C.redAccent, breakLine: true } },
    { text: "→ 一打四\n→ 火焰壶哥偷袭\n→ 受到惩罚", options: { fontSize: 10.5 } },
  ], {
    x: 3.5, y: 3.0, w: 2.4, h: 0.95,
    fontFace: "Calibri", color: C.lightText, lineSpacingMultiple: 1.4, margin: 0,
  });

  // Ambush philosophy
  slide.addText("偷袭时机哲学", {
    x: 0.5, y: 4.25, w: 5.5, h: 0.3,
    fontSize: 13, fontFace: "Georgia", color: C.darkText, bold: true, margin: 0,
  });
  addBodyText(slide, [
    { text: "上楼后「前狼假寐」陷阱 —— 玩家刚经历学习战斗和奖励，", options: { fontSize: 10.5 } },
    { text: "处于放松警惕的状态", options: { fontSize: 10.5, bold: true, color: C.redAccent } },
    { text: "。此时偷袭最容易成功、最能留下深刻印象。反直觉设计 → 奠定玩家对游戏底层性质的认知。", options: { fontSize: 10.5 } },
  ], 0.5, 4.55, 5.5, 0.55);

  // Screenshot
  addScreenshotArea(slide, 6.3, 1.4, 3.3, 3.7, "📷 二楼「前狼假寐」偷袭场景\n被龙遮挡视野的三个休息敌怪");
}

// ═══════════════════════════════════════════
// SLIDE 9 — Tower Interior: Light & Shadow (Light)
// ═══════════════════════════════════════════
{
  const slide = makeContentSlide("区块③ 塔内", "光影引导 — 追光源的实锤发现");

  // Key discovery card
  addCard(slide, 0.5, 1.4, 5.5, 1.2);
  slide.addText([
    { text: "🔦 追光源（已实锤）\n", options: { bold: true, fontSize: 14, fontFace: "Georgia", color: C.darkText, breakLine: true } },
    { text: "「起初我还以为是不是恰好环境光照到这里，但是我在解包的过程中看到了这个——他们真的刻意在这里放了一个追光源。", options: { fontSize: 11, italic: true, breakLine: true } },
    { text: "这是故意的还是不小心？", options: { fontSize: 11, bold: true, italic: true, breakLine: true } },
    { text: "是故意的。」", options: { fontSize: 13, bold: true, color: C.gold } },
  ], {
    x: 0.65, y: 1.47, w: 5.2, h: 1.05,
    fontFace: "Calibri", color: C.darkText, lineSpacingMultiple: 1.35, margin: 0,
  });

  // Table: light/shadow techniques
  addStyledTable(slide, [
    [{ text: "手法", bold: true }, { text: "实现", bold: true }],
    ["保护色偷袭", "持刀小怪=场景保护色；持灯小怪=故意明显\n→ 击杀提灯小怪后玩家放松 → 被偷袭"],
    ["拾取物引导", "高处拾取物激发探索欲 → 玩家回到上层寻找路径"],
    ["追光源⭐", "楼梯口透射极其明显的亮斑 → 解包证实是刻意放置"],
  ], 0.5, 2.8, 5.5, [1.5, 4.0]);

  // Rhythm control
  addBodyText(slide, [
    { text: "💡 节奏调节：", options: { bold: true, fontSize: 11, color: C.deepGold } },
    { text: "塔内第一印象是昏暗——与户外探索形成强烈反差 → 玩家更需要集中注意力观察环境 → 调节关卡节奏。", options: { fontSize: 10.5 } },
  ], 0.5, 4.45, 5.5, 0.45);

  // Sealed door note
  addBodyText(slide, [
    { text: "🚪 被封死的门：", options: { bold: true, fontSize: 10, color: C.deepGold } },
    { text: "龙石塔与火龙塔之间堵死的门（非单向门/墙壁）→ 三种推断：空间连通感 / 叙事铺垫 / 减少建模成本", options: { fontSize: 9.5 } },
  ], 0.5, 4.95, 5.5, 0.35);

  // Screenshot
  addScreenshotArea(slide, 6.3, 1.4, 3.3, 3.7, "📷 塔内楼梯口追光源亮斑\n室内昏暗与户外光明的对比");
}

// ═══════════════════════════════════════════
// SLIDE 10 — Fire Dragon Tower ①: Route Control (Light)
// ═══════════════════════════════════════════
{
  const slide = makeContentSlide("区块④ 火龙塔①", "路线控制：光影 + 安全本能");

  // Route decision diagram
  addCard(slide, 0.5, 1.4, 5.5, 1.2);

  // Two routes
  slide.addText("路径分岔处的设计", {
    x: 0.65, y: 1.47, w: 5.2, h: 0.3,
    fontSize: 13, fontFace: "Georgia", color: C.darkText, bold: true, margin: 0,
  });

  // Left route (target)
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 1.85, w: 2.4, h: 0.6,
    fill: { color: C.gold },
  });
  slide.addText([
    { text: "⬆️ 向上（阴影路）", options: { bold: true, fontSize: 11, breakLine: true } },
    { text: "遮挡处阴影 → 设计者希望玩家走这里", options: { fontSize: 9.5 } },
  ], {
    x: 0.75, y: 1.85, w: 2.3, h: 0.6,
    fontFace: "Calibri", color: C.darkText, align: "center", valign: "middle", margin: 0,
  });

  // Right route (deterrent)
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 3.3, y: 1.85, w: 2.6, h: 0.6,
    fill: { color: C.redAccent },
  });
  slide.addText([
    { text: "➡️ 水平直行（光亮路）", options: { bold: true, fontSize: 11, breakLine: true } },
    { text: "光亮、路尽头有火把 → 堆了很多怪", options: { fontSize: 9.5 } },
  ], {
    x: 3.35, y: 1.85, w: 2.5, h: 0.6,
    fontFace: "Calibri", color: C.lightText, align: "center", valign: "middle", margin: 0,
  });

  // Conclusion
  addBodyText(slide, "玩家可能忽视光影，但绝不可能忽视自己的狗命 → 自觉走左边 ✅", 0.5, 2.65, 5.5, 0.3,
    { fontSize: 10.5, bold: true });

  // Dragon debut
  addCard(slide, 0.5, 3.05, 5.5, 2.15);
  slide.addText("火龙登场 — 心流的第一个高潮", {
    x: 0.65, y: 3.1, w: 5.2, h: 0.28,
    fontSize: 14, fontFace: "Georgia", color: C.darkText, bold: true, margin: 0,
  });
  slide.addText([
    { text: "「在经历前面的多场战斗之后，玩家的新鲜感已经逐渐丧失。因此在这里引入视听效果都极为震撼的历代传统火龙演出，", options: { fontSize: 10.5, breakLine: true } },
    { text: "使得玩家的心流进入高潮，关卡再次变奏。」", options: { fontSize: 10.5, bold: true } },
  ], {
    x: 0.65, y: 3.42, w: 5.2, h: 0.48,
    fontFace: "Calibri", color: C.darkText, lineSpacingMultiple: 1.35, margin: 0,
  });

  // Dragon details table
  addStyledTable(slide, [
    [{ text: "细节", bold: true }, { text: "设计意图", bold: true }],
    ["火龙之前先有龙尸", "铺垫，不让火龙的出现「平白无故」"],
    ["火龙喷火烧死楼上小怪", "引导玩家学习「龙的火焰可以用于清怪」"],
    ["楼上地板烫脚 / 楼下不会", "降低楼下推进难度"],
  ], 0.5, 4.0, 5.5, [1.8, 3.7], { rowH: [0.28, 0.22, 0.22, 0.22] });

  // Screenshot
  addScreenshotArea(slide, 6.3, 1.4, 3.3, 3.5, "📷 火龙喷火场景\n光影分岔路口 + 火龙演出");
}

// ═══════════════════════════════════════════
// SLIDE 11 — Fire Dragon Tower ②: Puzzle & Strong Enemy (Light)
// ═══════════════════════════════════════════
{
  const slide = makeContentSlide("区块④ 火龙塔②", "非强制锁钥解谜 + 强敌 + 宝箱怪");

  // Lock & key puzzle flow
  addCard(slide, 0.5, 1.4, 5.5, 1.3);
  slide.addText("🔑 非强制性锁钥解谜（首次引入）", {
    x: 0.65, y: 1.47, w: 5.2, h: 0.3,
    fontSize: 13, fontFace: "Georgia", color: C.darkText, bold: true, margin: 0,
  });

  const puzzleFlow = ["正面关卡\n不通", "走支路\n（极短）", "学习解锁\n方法", "利用火龙\n喷火", "破解谜题\n推进正路"];
  puzzleFlow.forEach((step, i) => {
    const sx = 0.6 + i * 1.05;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: sx, y: 1.85, w: 0.9, h: 0.65,
      fill: { color: i === puzzleFlow.length - 1 ? C.gold : C.whiteCard },
      shadow: mkShadow(),
    });
    slide.addText(step, {
      x: sx, y: 1.85, w: 0.9, h: 0.65,
      fontSize: 8.5, fontFace: "Calibri",
      color: i === puzzleFlow.length - 1 ? C.lightText : C.darkText,
      bold: i === puzzleFlow.length - 1, align: "center", valign: "middle", margin: 0,
    });
    if (i < puzzleFlow.length - 1) {
      slide.addText("→", {
        x: sx + 0.85, y: 1.95, w: 0.25, h: 0.5,
        fontSize: 10, color: C.gold, valign: "middle", margin: 0,
      });
    }
  });

  // Lothric Knight card
  addCard(slide, 0.5, 2.8, 5.5, 1.6);
  slide.addText([{ text: "⚔️ 洛斯里克剑骑士 — 区块小Boss\n", options: { bold: true, fontSize: 13, fontFace: "Georgia", color: C.darkText, breakLine: true } },
    { text: "如何告诉玩家「这是个强敌」？", options: { fontSize: 10.5 } },
  ], {
    x: 0.65, y: 2.85, w: 5.2, h: 0.45,
    fontFace: "Calibri", color: C.darkText, lineSpacingMultiple: 1.3, margin: 0,
  });
  addStyledTable(slide, [
    ["手法", "实现"],
    ["缓步登场", "体现敌怪的从容与威胁"],
    ["装束更改", "凸显形象气质的差异"],
    ["简化画面", "拆掉门框上的火把 → 视线重心集中到敌人身上"],
  ], 0.5, 3.35, 5.5, [1.5, 4.0], { rowH: [0.28, 0.22, 0.22, 0.22] });

  // Mimic + one-way door
  addBodyText(slide, [
    { text: "📦 宝箱怪时机：", options: { bold: true, fontSize: 10, color: C.deepGold } },
    { text: "玩家刚经历骑士激战/躲过火龙 → 放松时刻 → 插入宝箱怪 → 激发情绪", options: { fontSize: 9.5 } },
  ], 0.5, 4.55, 2.7, 0.3);
  addBodyText(slide, [
    { text: "🚪 第一个单向门：", options: { bold: true, fontSize: 10, color: C.deepGold } },
    { text: "设计出来就是为了让玩家双向都触发一遍", options: { fontSize: 9.5 } },
  ], 3.3, 4.55, 2.7, 0.3);

  // Screenshot
  addScreenshotArea(slide, 6.3, 1.4, 3.3, 3.5, "📷 洛骑缓步登场场景\n单向门 + 宝箱怪位置");
}

// ═══════════════════════════════════════════
// SLIDE 12 — High Wall Edge Tower: Multi-layer Guidance (Light)
// ═══════════════════════════════════════════
{
  const slide = makeContentSlide("区块⑤ 高墙边塔", "多层引导的精密编排 — 「最精彩的一段」");

  // Guidance chain flow
  addCard(slide, 0.5, 1.4, 5.5, 2.3);

  const chainSteps = [
    { step: "1", text: "进门 → 右侧高亮拾取物\n（优先向右）" },
    { step: "2", text: "透光门框 + 火把\n（自然映入眼帘 → 诱导出门）" },
    { step: "3", text: "木板尽头 → 向下看到\n二层门框 + 地板破洞" },
    { step: "4", text: "暗示塔有更深层次\n→ 拉开空间层次" },
  ];

  chainSteps.forEach((c, i) => {
    const sy = 1.47 + i * 0.52;
    // Step number circle
    slide.addShape(pres.shapes.OVAL, {
      x: 0.65, y: sy + 0.06, w: 0.32, h: 0.32,
      fill: { color: C.gold },
    });
    slide.addText(c.step, {
      x: 0.65, y: sy + 0.06, w: 0.32, h: 0.32,
      fontSize: 12, fontFace: "Calibri", color: C.darkText, bold: true, align: "center", valign: "middle", margin: 0,
    });
    slide.addText(c.text, {
      x: 1.1, y: sy, w: 4.7, h: 0.48,
      fontSize: 11, fontFace: "Calibri", color: C.darkText, lineSpacingMultiple: 1.25, valign: "middle", margin: 0,
    });
    // Connector line
    if (i < chainSteps.length - 1) {
      slide.addShape(pres.shapes.LINE, {
        x: 0.81, y: sy + 0.42, w: 0, h: 0.1,
        line: { color: C.gold, width: 1.0, dashType: "dash" },
      });
    }
  });

  // Firebomb theory card
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.85, w: 5.5, h: 1.3,
    fill: { color: C.darkBg },
    shadow: mkCardShadow(),
  });
  slide.addText([
    { text: "🔥 洪七公理论：关键道具火焰壶\n", options: { bold: true, fontSize: 13, fontFace: "Georgia", color: C.gold, breakLine: true } },
    { text: "毒蛇七步内必有解药 —— 火焰壶不仅可以引爆塔中各处的火药桶，还可以对付后续的人之脓。", options: { fontSize: 11, breakLine: true } },
    { text: "道具的给予与即将面临的挑战精确匹配。", options: { fontSize: 11, breakLine: true } },
    { text: "\n「这一段极其精彩——玩家接受了大量场景信息，获取了关键道具，但是一切都发生得如此自然。」", options: { fontSize: 10.5, italic: true } },
  ], {
    x: 0.65, y: 3.9, w: 5.2, h: 1.2,
    fontFace: "Calibri", color: C.lightText, lineSpacingMultiple: 1.3, margin: 0,
  });

  // Screenshot
  addScreenshotArea(slide, 6.3, 1.4, 3.3, 3.5, "📷 高墙边塔进门第一幕\n透光门框 + 地板破洞");
}

// ═══════════════════════════════════════════
// SLIDE 13 — Core Theory ①: POI + Teaching (Light)
// ═══════════════════════════════════════════
{
  const slide = makeContentSlide("核心理论①", "POI 兴趣点系统 + 教学式战斗编排");

  // POI system table
  slide.addText("1. POI 兴趣点系统", {
    x: 0.5, y: 1.38, w: 5.5, h: 0.28,
    fontSize: 14, fontFace: "Georgia", color: C.darkText, bold: true, margin: 0,
  });
  addStyledTable(slide, [
    [{ text: "POI 类型", bold: true }, { text: "示例", bold: true }, { text: "作用", bold: true }],
    ["光源", "篝火、火把、追光源", "近程导航"],
    ["远景", "舞娘城楼蓝光、塔楼群", "建立长期预期"],
    ["运动物体", "唯一移动的敌怪", "最高优先级注意力"],
    ["拾取物", "高亮白光", "激发探索欲"],
  ], 0.5, 1.72, 5.5, [1.3, 2.2, 2.0], { rowH: [0.30, 0.25, 0.25, 0.25, 0.25] });

  // Teaching combat system
  slide.addText("2. 教学式战斗编排体系", {
    x: 0.5, y: 3.10, w: 5.5, h: 0.28,
    fontSize: 14, fontFace: "Georgia", color: C.darkText, bold: true, margin: 0,
  });
  addStyledTable(slide, [
    [{ text: "教学点", bold: true }, { text: "教学方式", bold: true }, { text: "检验方式", bold: true }],
    ["基础战斗", "一对一简单敌人", "—"],
    ["提灯哥机制", "行为动画 + 引怪演示", "第二只提灯哥 + 三个敌怪"],
    ["偷袭警惕", "「前狼假寐」陷阱", "后续流程的隐藏敌怪"],
    ["火龙机制", "喷火烧死楼上小怪", "利用喷火通过楼下"],
    ["锁钥解谜", "非强制性支路", "后续流程复用"],
  ], 0.5, 3.44, 5.5, [1.2, 2.1, 2.2], { rowH: [0.28, 0.22, 0.22, 0.22, 0.22, 0.22] });

  // Citation
  addBodyText(slide, "💡 和塞尔达·旷野之息的 POI 系统同源——用视觉上特异的点吸引玩家注意力，建立关卡推进的预期。", 0.5, 5.0, 5.5, 0.28,
    { fontSize: 9.5, color: C.deepGold, italic: true });

  // Screenshot
  addScreenshotArea(slide, 6.3, 1.4, 3.3, 3.7, "📷 POI 系统全景\n远景 + 光源 + 拾取物 + 运动敌怪");
}

// ═══════════════════════════════════════════
// SLIDE 14 — Core Theory ②: Light Language + Ambush (Light)
// ═══════════════════════════════════════════
{
  const slide = makeContentSlide("核心理论②", "光影引导语言 + 偷袭时机哲学");

  // Light language
  slide.addText("3. 光影作为核心引导语言", {
    x: 0.5, y: 1.4, w: 5.5, h: 0.3,
    fontSize: 15, fontFace: "Georgia", color: C.darkText, bold: true, margin: 0,
  });

  const lightPoints = [
    { label: "追光源⭐", desc: "解包实锤——刻意在楼梯口放置追光源制造亮斑" },
    { label: "明暗对比", desc: "出口总是更亮、正路总是有光源" },
    { label: "火把系统", desc: "火把标记前进方向、柱子遮挡火把劝阻返程" },
    { label: "保护色", desc: "室内暗处敌怪与场景同色 → 没有提灯的敌怪更容易偷袭" },
  ];
  lightPoints.forEach((p, i) => {
    const sy = 1.8 + i * 0.42;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: sy, w: 5.5, h: 0.36,
      fill: { color: C.whiteCard },
      shadow: mkShadow(),
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: sy, w: 0.06, h: 0.36,
      fill: { color: C.gold },
    });
    slide.addText([
      { text: p.label, options: { bold: true, fontSize: 11, color: C.darkText } },
      { text: "  " + p.desc, options: { fontSize: 10.5 } },
    ], {
      x: 0.65, y: sy, w: 5.25, h: 0.36,
      fontFace: "Calibri", color: C.darkText, valign: "middle", margin: 0,
    });
  });

  // Ambush philosophy
  slide.addText("4. 偷袭的时机哲学", {
    x: 0.5, y: 3.55, w: 5.5, h: 0.3,
    fontSize: 15, fontFace: "Georgia", color: C.darkText, bold: true, margin: 0,
  });
  addStyledTable(slide, [
    [{ text: "偷袭位置", bold: true }, { text: "前置状态", bold: true }, { text: "设计意图", bold: true }],
    ["龙石塔上层", "刚完成学习→奖励循环", "放松警惕 → 建立「随时有偷袭」的认知"],
    ["塔内暗处", "刚击杀显眼的提灯小怪", "再次放松 → 构建暗处=危险的联想"],
  ], 0.5, 3.9, 5.5, [1.5, 1.8, 2.2], { rowH: [0.30, 0.25, 0.25] });

  // Summary insight
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.75, w: 5.5, h: 0.5,
    fill: { color: C.darkBg },
  });
  slide.addText("每次偷袭都精确对准玩家心理防御最低的时刻 —— 不是随机放置，而是计算过的节奏控制。", {
    x: 0.65, y: 4.78, w: 5.2, h: 0.44,
    fontSize: 11, fontFace: "Calibri", color: C.lightText, valign: "middle", margin: 0,
  });

  // Screenshot
  addScreenshotArea(slide, 6.3, 1.4, 3.3, 3.7, "📷 光影对比全景\n明暗交界 + 追光源 + 保护色敌怪");
}

// ═══════════════════════════════════════════
// SLIDE 15 — Design Techniques Reference (Light, full-width)
// ═══════════════════════════════════════════
{
  const slide = makeContentSlide("设计速查", "设计手法速查表");
  slide.background = { color: C.lightBg };

  // Big reference table — full width
  const tableData = [
    [{ text: "类别", bold: true, fontSize: 10 }, { text: "手法", bold: true, fontSize: 10 }, { text: "出现位置", bold: true, fontSize: 10 }],
    [{ text: "视觉引导", bold: true, fontSize: 9 }, "POI 兴趣点（光源/远景/运动物体/拾取物）", "初始之塔"],
    [{ text: "", fontSize: 9 }, "追光源（解包实锤）⭐", "龙石塔楼梯口"],
    [{ text: "", fontSize: 9 }, "明暗对比（出口=亮、正路=光源）", "各处"],
    [{ text: "", fontSize: 9 }, "火把标记 + 柱子遮挡", "初始之塔"],
    [{ text: "敌人引导", bold: true, fontSize: 9 }, "唯一运动的敌怪 = 最高优先级信息", "龙石塔入口"],
    [{ text: "", fontSize: 9 }, "提灯哥行为动画教学", "龙石塔"],
    [{ text: "", fontSize: 9 }, "火龙喷火烧怪（教玩家利用环境）", "火龙塔"],
    [{ text: "", fontSize: 9 }, "强敌缓步登场 + 简化画面", "火龙塔（洛骑）"],
    [{ text: "空间引导", bold: true, fontSize: 9 }, "破洞预览（暗示深层）", "高墙边塔"],
    [{ text: "", fontSize: 9 }, "可见不可及（高处拾取物）", "龙石塔室内"],
    [{ text: "", fontSize: 9 }, "椅子挡路 + 火把遮挡（劝阻返程）", "初始之塔"],
    [{ text: "", fontSize: 9 }, "跳板（路径多样性）", "龙石塔室内"],
    [{ text: "教学闭环", bold: true, fontSize: 9 }, "观察→学习→实践→奖励", "龙石塔（提灯哥×2）"],
    [{ text: "", fontSize: 9 }, "非强制性锁钥解谜", "火龙塔"],
    [{ text: "", fontSize: 9 }, "洪七公理论（道具匹配挑战）", "高墙边塔（火焰壶）"],
    [{ text: "心理节奏", bold: true, fontSize: 9 }, "偷袭时机 = 心理防御最低点", "龙石塔上层、室内"],
    [{ text: "", fontSize: 9 }, "火龙演出 → 心流高潮", "火龙塔"],
    [{ text: "", fontSize: 9 }, "宝箱怪 → 放松时刻的突袭", "火龙塔室内"],
    [{ text: "", fontSize: 9 }, "起承转合难度曲线", "全局"],
    [{ text: "路线控制", bold: true, fontSize: 9 }, "单向门（双向触发）", "火龙塔"],
    [{ text: "", fontSize: 9 }, "堵死的门（空间连通感）", "龙石塔↔火龙塔"],
    [{ text: "", fontSize: 9 }, "支路不能回头（有得有失）", "各处隐藏支路"],
  ];

  // Build table with category row styling
  const headerRow = tableData[0].map(cell => ({
    text: cell.text,
    options: {
      fill: { color: C.tableHead },
      color: C.gold,
      bold: true,
      fontSize: cell.fontSize || 10.5,
      fontFace: "Calibri",
      align: "center",
      valign: "middle",
      border: { pt: 0.5, color: C.tableHead },
    },
  }));

  const dataRows = tableData.slice(1).map((row, ri) =>
    row.map((cell, ci) => {
      const c = typeof cell === "string" ? { text: cell } : cell;
      const isCategoryLabel = ci === 0 && c.bold;
      return {
        text: c.text,
        options: {
          fill: { color: isCategoryLabel ? C.tableHead : (Math.floor(ri / 4) % 2 === 0 ? C.tableAlt : C.whiteCard) },
          color: isCategoryLabel ? C.gold : C.darkText,
          fontSize: c.fontSize || 8,
          fontFace: "Calibri",
          align: ci === 0 ? "center" : "left",
          valign: "middle",
          border: { pt: 0.3, color: "E0DCD3" },
          bold: isCategoryLabel,
        },
      };
    })
  );

  slide.addTable([headerRow, ...dataRows], {
    x: 0.3, y: 1.30, w: 9.4,
    colW: [1.3, 4.3, 3.8],
    border: { pt: 0 },
    rowH: [0.26, ...Array(tableData.length - 1).fill(0.165)],
  });
}

// ═══════════════════════════════════════════
// SLIDE 16 — Summary & Preview (Dark)
// ═══════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.darkBg };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: C.gold },
  });

  // Gold square + label
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 0.32, w: 0.22, h: 0.22,
    fill: { color: C.gold },
  });
  slide.addText("总结与预告", {
    x: 0.82, y: 0.3, w: 3, h: 0.28,
    fontSize: 10, fontFace: "Calibri", color: C.gold, bold: true, charSpacing: 3, valign: "middle", margin: 0,
  });

  slide.addText("Part 1 关键收获", {
    x: 0.5, y: 0.68, w: 9.0, h: 0.55,
    fontSize: 28, fontFace: "Georgia", color: C.lightText, bold: true, margin: 0,
  });
  slide.addShape(pres.shapes.LINE, {
    x: 0.5, y: 1.28, w: 9.0, h: 0,
    line: { color: C.gold, width: 1.0 },
  });

  // Left column: key takeaways
  const takeaways = [
    { num: "01", title: "POI 兴趣点系统", desc: "光源、远景、运动物体、拾取物\n系统性引导玩家注意力和预期" },
    { num: "02", title: "教学式战斗编排", desc: "观察→学习→实践→奖励的完整闭环\n每一场战斗都是教学关卡" },
    { num: "03", title: "光影作为引导语言", desc: "追光源（解包实锤）、明暗对比\n火把系统、保护色——都是刻意设计" },
    { num: "04", title: "偷袭时机哲学", desc: "对准心理防御最低点\n建立「随时有偷袭」的底层认知" },
    { num: "05", title: "有得有失的支路", desc: "隐藏支路不做视觉处理\n奖励与风险成正比" },
  ];

  takeaways.forEach((t, i) => {
    const ty = 1.42 + i * 0.65;
    // Number
    slide.addText(t.num, {
      x: 0.5, y: ty, w: 0.65, h: 0.5,
      fontSize: 18, fontFace: "Georgia", color: C.gold, bold: true, valign: "middle", margin: 0,
    });
    // Content
    slide.addText([
      { text: t.title, options: { bold: true, fontSize: 12, breakLine: true } },
      { text: t.desc, options: { fontSize: 9.5, color: "AAA8A0" } },
    ], {
      x: 1.2, y: ty, w: 4.0, h: 0.5,
      fontFace: "Calibri", color: C.lightText, lineSpacingMultiple: 1.25, valign: "middle", margin: 0,
    });
  });

  // Right column: Part 2 teaser
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.8, y: 1.5, w: 3.7, h: 3.6,
    fill: { color: C.darkCard },
    shadow: mkCardShadow(),
  });
  slide.addText("Part 2 预告", {
    x: 6.0, y: 1.6, w: 3.3, h: 0.4,
    fontSize: 16, fontFace: "Georgia", color: C.gold, bold: true, margin: 0,
  });
  slide.addText([
    { text: "高墙深处\n\n", options: { bold: true, fontSize: 14, breakLine: true } },
    { text: "在 Part 1 建立的前期框架基础上，\n复杂度大幅提升：\n\n", options: { fontSize: 11, breakLine: true } },
    { text: "▸ 多路线选择\n▸ 多层结构\n▸ 多敌人配置\n▸ 心流节奏控制\n\n", options: { fontSize: 11, breakLine: true } },
    { text: "两期共同构成完整的\n洛斯里克高墙关卡设计全景。", options: { fontSize: 11, italic: true } },
  ], {
    x: 6.0, y: 2.05, w: 3.3, h: 2.9,
    fontFace: "Calibri", color: C.lightText, lineSpacingMultiple: 1.35, margin: 0,
  });

  // Bottom source
  slide.addText("来源：Bilibili · Ymagine 「宫崎英俊十年前的设计水平？」2026-01-04    |    完整笔记：Wiki/tech-game-level-design/ds3-lothric-high-wall-1.md", {
    x: 0.5, y: 4.8, w: 9.0, h: 0.4,
    fontSize: 9, fontFace: "Calibri", color: "6A6868", margin: 0,
  });
  slide.addShape(pres.shapes.LINE, {
    x: 0.5, y: 4.68, w: 9.0, h: 0,
    line: { color: "3A3A3E", width: 0.5 },
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.565, w: 10, h: 0.06,
    fill: { color: C.gold },
  });
}

// ─── Write Output ───
const outPath = "/Users/isaachsiadocs/Library/CloudStorage/OneDrive-共享的库-onedrive/Private/个人知识库/DS3_Lothric_High_Wall_1.pptx";
pres.writeFile({ fileName: outPath })
  .then(() => console.log("✅ PPTX created: " + outPath))
  .catch(err => console.error("❌ Error:", err));
