const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaFire, FaMapSigns, FaLightbulb, FaHeartbeat, FaCube,
  FaChessRook, FaSkull, FaDungeon, FaRoute, FaBookOpen,
  FaArrowRight, FaStar, FaEye, FaExclamationTriangle,
  FaCheckCircle, FaChessKnight, FaCrosshairs, FaLayerGroup
} = require("react-icons/fa");

// --- Icon helpers ---
function renderIconSvg(Icon, color = "#000000", size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(Icon, { color, size: String(size) })
  );
}

async function iconToBase64(Icon, color, size = 256) {
  const svg = renderIconSvg(Icon, color, size);
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

// --- Color Palette (Bonfire & Ember) ---
const C = {
  bg:       "12121F",   // deep void
  bgCard:   "1E1E33",   // card surface
  bgCard2:  "252540",   // alt card
  gold:     "C8A96E",   // bonfire gold (accent)
  goldDim:  "8B7848",   // muted gold
  ember:    "D4731A",   // ember orange
  emberDim: "8B4513",   // saddle brown
  text:     "E8E0D5",   // warm parchment
  textDim:  "9A9488",   // muted text
  textDark: "6B6560",   // very muted
  white:    "FFFFFF",
  red:      "C0392B",   // danger accent
  green:    "27AE60",   // positive
};

// --- Shared helpers ---
const makeShadow = () => ({ type: "outer", color: "000000", blur: 8, offset: 3, angle: 135, opacity: 0.4 });

// --- Main ---
async function build() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Ymagine (Bilibili) / Wiki Notes";
  pres.title = "黑暗之魂3 洛斯里克高墙 关卡拆解② — 高墙深处";

  // --- Inner helpers ---
  function card(slide, x, y, w, h, opts = {}) {
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w, h,
      fill: { color: opts.fill || C.bgCard },
      shadow: makeShadow(),
      ...(opts.shapeOpts || {})
    });
  }

  function addTitleBar(slide, title, subtitle) {
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 0.35, w: 0.06, h: 0.45, fill: { color: C.gold } });
    slide.addText(title, {
      x: 0.85, y: 0.3, w: 8.5, h: 0.55,
      fontSize: 32, fontFace: "Arial Black", color: C.gold,
      bold: true, margin: 0
    });
    if (subtitle) {
      slide.addText(subtitle, {
        x: 0.85, y: 0.85, w: 8.5, h: 0.35,
        fontSize: 13, fontFace: "Arial", color: C.textDim, margin: 0
      });
    }
  }

  // Preload icons
  const icons = {
    fire:     await iconToBase64(FaFire, "#" + C.ember),
    map:      await iconToBase64(FaMapSigns, "#" + C.gold),
    light:    await iconToBase64(FaLightbulb, "#" + C.gold),
    heart:    await iconToBase64(FaHeartbeat, "#" + C.ember),
    cube:     await iconToBase64(FaCube, "#" + C.gold),
    rook:     await iconToBase64(FaChessRook, "#" + C.gold),
    skull:    await iconToBase64(FaSkull, "#" + C.red),
    dungeon:  await iconToBase64(FaDungeon, "#" + C.gold),
    route:    await iconToBase64(FaRoute, "#" + C.gold),
    book:     await iconToBase64(FaBookOpen, "#" + C.gold),
    arrow:    await iconToBase64(FaArrowRight, "#" + C.gold),
    star:     await iconToBase64(FaStar, "#" + C.gold),
    eye:      await iconToBase64(FaEye, "#" + C.gold),
    warning:  await iconToBase64(FaExclamationTriangle, "#" + C.ember),
    check:    await iconToBase64(FaCheckCircle, "#" + C.green),
    knight:   await iconToBase64(FaChessKnight, "#" + C.gold),
    crosshair:await iconToBase64(FaCrosshairs, "#" + C.ember),
    layer:    await iconToBase64(FaLayerGroup, "#" + C.gold),
  };

  // ==================== SLIDE 1: TITLE ====================
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    // Large decorative bonfire glow
    s.addShape(pres.shapes.OVAL, {
      x: 4.2, y: 1.2, w: 1.6, h: 1.6,
      fill: { color: C.ember, transparency: 85 }
    });
    s.addImage({ data: icons.fire, x: 4.55, y: 1.55, w: 0.9, h: 0.9 });
    // Title
    s.addText("黑暗之魂Ⅲ 关卡拆解", {
      x: 0.8, y: 2.8, w: 8.4, h: 0.8,
      fontSize: 42, fontFace: "Arial Black", color: C.gold,
      bold: true, align: "center", margin: 0
    });
    s.addText("洛斯里克的高墙 ② — 高墙深处", {
      x: 0.8, y: 3.5, w: 8.4, h: 0.6,
      fontSize: 26, fontFace: "Arial", color: C.text,
      align: "center", margin: 0
    });
    // Subtitle line
    s.addShape(pres.shapes.RECTANGLE, {
      x: 3.5, y: 4.25, w: 3, h: 0.015, fill: { color: C.goldDim }
    });
    s.addText("「会呼吸的关卡」—— 心流理论 × 空间引导 × 心理操控", {
      x: 0.8, y: 4.45, w: 8.4, h: 0.45,
      fontSize: 14, fontFace: "Arial", color: C.textDim,
      align: "center", italic: true, margin: 0
    });
    s.addText("来源：Ymagine (Bilibili) · 2026", {
      x: 0.8, y: 5.05, w: 8.4, h: 0.35,
      fontSize: 11, fontFace: "Arial", color: C.textDark,
      align: "center", margin: 0
    });
  }

  // ==================== SLIDE 2: OVERVIEW / 目录 ====================
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addTitleBar(s, "课程概览", "COURSE OVERVIEW");

    const sections = [
      { icon: icons.rook,   title: "1. 高墙边塔",     desc: "朝向控制 · 光照引导 · 破洞预览" },
      { icon: icons.skull,  title: "2. 人脓屋顶",     desc: "动态引导 · 多路线选择 · 俯瞰预览" },
      { icon: icons.dungeon,title: "3. 餐厅 / 武器库", desc: "空间升级 · 多敌人配置 · 有得有失" },
      { icon: icons.knight, title: "4. 肥仔广场",     desc: "空间锚点 · 注意力操控 · 风险回报" },
      { icon: icons.route,  title: "5. 返程捷径",     desc: "心理操控 · 战前准备 · 柳暗花明" },
      { icon: icons.heart,  title: "核心理论",         desc: "心流节奏 · 3D 银河城空间连通性" },
    ];

    sections.forEach((sec, i) => {
      const row = Math.floor(i / 2);
      const col = i % 2;
      const x = 0.7 + col * 4.5;
      const y = 1.45 + row * 1.2;
      // Card background
      card(s, x, y, 4.2, 1.05);
      // Left accent
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: 0.06, h: 1.05, fill: { color: i < 5 ? C.gold : C.ember }
      });
      // Icon
      s.addImage({ data: sec.icon, x: x + 0.3, y: y + 0.22, w: 0.48, h: 0.48 });
      // Title
      s.addText(sec.title, {
        x: x + 0.95, y: y + 0.12, w: 3.0, h: 0.4,
        fontSize: 16, fontFace: "Arial", color: C.gold, bold: true, margin: 0
      });
      // Desc
      s.addText(sec.desc, {
        x: x + 0.95, y: y + 0.55, w: 3.0, h: 0.35,
        fontSize: 11, fontFace: "Arial", color: C.textDim, margin: 0
      });
    });
  }

  // ==================== SLIDE 3: CORE THESIS ====================
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addTitleBar(s, "核心论点", "CORE THESIS");

    // Large quote card
    card(s, 0.7, 1.55, 8.6, 2.2);
    s.addImage({ data: icons.fire, x: 1.0, y: 1.8, w: 0.6, h: 0.6 });
    s.addText("魂系关卡是「会呼吸」的", {
      x: 1.8, y: 1.7, w: 7.0, h: 0.7,
      fontSize: 30, fontFace: "Arial Black", color: C.gold, bold: true, margin: 0
    });
    s.addText("通过难度递进、节奏控制和空间引导，让玩家体验如呼吸般一张一弛。", {
      x: 1.8, y: 2.45, w: 7.0, h: 0.55,
      fontSize: 16, fontFace: "Arial", color: C.text, margin: 0
    });
    s.addText("一紧一松，张弛有度，难度循序渐进 —— 完全符合心流理论（Flow Theory）", {
      x: 1.8, y: 3.0, w: 7.0, h: 0.4,
      fontSize: 12, fontFace: "Arial", color: C.textDim, italic: true, margin: 0
    });

    // Three pillars
    const pillars = [
      { icon: icons.eye,   title: "空间引导",  desc: "光照、破洞、俯瞰\n构建三维空间认知" },
      { icon: icons.crosshair, title: "战斗节奏", desc: "偷袭、陷阱、强敌\n张弛交替推进" },
      { icon: icons.heart, title: "心理操控",   desc: "方向模糊、最后一吓\n放大捷径的惊艳感" },
    ];
    pillars.forEach((p, i) => {
      const x = 0.7 + i * 3.0;
      card(s, x, 4.05, 2.7, 1.3);
      s.addImage({ data: p.icon, x: x + 1.0, y: 4.18, w: 0.4, h: 0.4 });
      s.addText(p.title, {
        x: x + 0.15, y: 4.62, w: 2.4, h: 0.35,
        fontSize: 15, fontFace: "Arial", color: C.gold, bold: true, align: "center", margin: 0
      });
      s.addText(p.desc, {
        x: x + 0.15, y: 4.95, w: 2.4, h: 0.3,
        fontSize: 10, fontFace: "Arial", color: C.textDim, align: "center", margin: 0
      });
    });
  }

  // ==================== SLIDE 4: 高墙边塔 ====================
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addTitleBar(s, "区块 1：高墙边塔", "HIGH WALL SIDE TOWER — 篝火、朝向与破洞");

    // Left: key techniques as cards
    const techs = [
      { title: "篝火处朝向控制", desc: "正对楼梯，背对隐藏物品 → 自然向前探索" },
      { title: "光照路径引导", desc: "光线入射处 = 下楼楼梯；门框给光源 → 主次分明" },
      { title: "破洞预览", desc: "反复从不同角度看到地板破洞 → 激发探索深层的好奇心" },
      { title: "方向感模糊", desc: "塔内绕行 + 出门时方向逆转 → 为捷径「柳暗花明」伏笔" },
    ];
    techs.forEach((t, i) => {
      const y = 1.55 + i * 0.95;
      card(s, 0.6, y, 5.3, 0.82);
      s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y, w: 0.06, h: 0.82, fill: { color: C.gold } });
      s.addText(t.title, {
        x: 0.85, y: y + 0.08, w: 4.8, h: 0.3,
        fontSize: 14, fontFace: "Arial", color: C.gold, bold: true, margin: 0
      });
      s.addText(t.desc, {
        x: 0.85, y: y + 0.42, w: 4.8, h: 0.3,
        fontSize: 11, fontFace: "Arial", color: C.textDim, margin: 0
      });
    });

    // Right: highlight box
    card(s, 6.2, 1.55, 3.5, 3.2);
    s.addImage({ data: icons.light, x: 7.55, y: 1.75, w: 0.45, h: 0.45 });
    s.addText("关键洞察", {
      x: 6.45, y: 2.3, w: 3.0, h: 0.35,
      fontSize: 16, fontFace: "Arial", color: C.gold, bold: true, align: "center", margin: 0
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 7.2, y: 2.7, w: 1.6, h: 0.015, fill: { color: C.goldDim } });
    s.addText([
      { text: "物品放置不是随机的", options: { breakLine: true, bold: true, fontSize: 12, color: C.ember } },
      { text: "", options: { breakLine: true, fontSize: 6 } },
      { text: "「视野盲区那么多，", options: { breakLine: true, fontSize: 11 } },
      { text: "  偏在这里藏」", options: { breakLine: true, fontSize: 11 } },
      { text: "", options: { breakLine: true, fontSize: 6 } },
      { text: "每一处物品都服务于", options: { breakLine: true, fontSize: 11 } },
      { text: "引导或奖励的意图", options: { fontSize: 11 } },
    ], {
      x: 6.45, y: 2.85, w: 3.0, h: 1.6,
      fontFace: "Arial", color: C.textDim, align: "center", margin: 0
    });

    // Bottom tag
    s.addText("手法：敌人引导移动 · 半通不通的门 · NPC 监牢记忆点 · 骑士背影暗示可避战", {
      x: 0.6, y: 5.1, w: 8.8, h: 0.3,
      fontSize: 10, fontFace: "Arial", color: C.textDark, align: "center", margin: 0
    });
  }

  // ==================== SLIDE 5: 人脓屋顶 ====================
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addTitleBar(s, "区块 2：人脓屋顶", "PUS OF MAN ROOFTOP — 动态引导与多路线选择");

    // Top: dynamic guidance highlight
    card(s, 0.6, 1.5, 8.8, 1.3);
    s.addImage({ data: icons.skull, x: 0.85, y: 1.65, w: 0.45, h: 0.45 });
    s.addText("宝石结晶虫 — 动态引导的典范", {
      x: 1.45, y: 1.6, w: 5.0, h: 0.35,
      fontSize: 18, fontFace: "Arial", color: C.gold, bold: true, margin: 0
    });
    s.addText("虫子会动 → 玩家要追 → 追逐路线 = 设计者预设的前进方向。\n虫子贴房檐跑 → 玩家不知不觉被引到下楼的楼梯前。", {
      x: 1.45, y: 1.98, w: 7.6, h: 0.7,
      fontSize: 13, fontFace: "Arial", color: C.text, margin: 0
    });

    // Three route cards
    const routes = [
      { num: "①", title: "跳板直落广场", desc: "快速路线\n二次经过时的选择", color: C.green },
      { num: "②", title: "清怪 → 爬梯下广场", desc: "设计者期望的初见路线\n弩手引导至此", color: C.gold },
      { num: "③", title: "进门框 → 战枪骑士", desc: "弩手逼迫回头\n处理后再探索", color: C.red },
    ];
    routes.forEach((r, i) => {
      const x = 0.6 + i * 3.05;
      card(s, x, 3.1, 2.8, 1.6);
      // Number circle
      s.addShape(pres.shapes.OVAL, { x: x + 1.1, y: 3.2, w: 0.5, h: 0.5, fill: { color: r.color } });
      s.addText(r.num, {
        x: x + 1.1, y: 3.2, w: 0.5, h: 0.5,
        fontSize: 20, fontFace: "Arial", color: C.white, bold: true, align: "center", valign: "middle", margin: 0
      });
      s.addText(r.title, {
        x: x + 0.15, y: 3.82, w: 2.5, h: 0.35,
        fontSize: 13, fontFace: "Arial", color: C.gold, bold: true, align: "center", margin: 0
      });
      s.addText(r.desc, {
        x: x + 0.15, y: 4.18, w: 2.5, h: 0.45,
        fontSize: 10, fontFace: "Arial", color: C.textDim, align: "center", margin: 0
      });
    });

    // Bottom insight
    card(s, 0.6, 4.95, 8.8, 0.5);
    s.addText("💡 俯瞰预览：垃圾拾取物的真正作用 → 让玩家站到特定位置向下看 → 建立对广场的探索预期", {
      x: 0.8, y: 5.0, w: 8.4, h: 0.4,
      fontSize: 11, fontFace: "Arial", color: C.textDim, margin: 0
    });
  }

  // ==================== SLIDE 6: 餐厅/武器库 ====================
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addTitleBar(s, "区块 3：餐厅 / 武器库", "DINING HALL — 空间升级与多敌人配置");

    // Left: spatial upgrade
    card(s, 0.6, 1.5, 4.2, 2.5);
    s.addText("空间升级：餐厅 = 龙石塔的全面升级版", {
      x: 0.8, y: 1.6, w: 3.8, h: 0.35,
      fontSize: 15, fontFace: "Arial", color: C.gold, bold: true, margin: 0
    });
    const upgrades = [
      "三层结构（vs 龙石塔的简单纵深）",
      "「可见不可及」引导探索支路",
      "怪物数量增多 → 要求逐个击破",
      "新增多种偷袭方式",
    ];
    s.addText(upgrades.map((u, i) => ({
      text: u,
      options: { bullet: true, breakLine: i < upgrades.length - 1, fontSize: 12, color: C.text }
    })), {
      x: 0.8, y: 2.1, w: 3.8, h: 1.7,
      fontFace: "Arial", paraSpaceAfter: 6, margin: 0
    });

    // Right: multi-enemy design
    card(s, 5.1, 1.5, 4.3, 2.5);
    s.addText("多敌人关卡设计（二层广场）", {
      x: 5.3, y: 1.6, w: 3.9, h: 0.35,
      fontSize: 15, fontFace: "Arial", color: C.gold, bold: true, margin: 0
    });
    const enemies = [
      { label: "狗", desc: "距下楼点最近 → 优先击杀" },
      { label: "斧头哥 ×3", desc: "行进时机错开 → 逐个击破" },
      { label: "火药桶", desc: "紧邻怪物巡逻路径 → 可利用引爆" },
      { label: "奖励", desc: "元素碎片 + 小偷监牢钥匙" },
    ];
    enemies.forEach((en, i) => {
      const ey = 2.1 + i * 0.44;
      s.addText(en.label, {
        x: 5.3, y: ey, w: 1.2, h: 0.35,
        fontSize: 11, fontFace: "Arial", color: C.ember, bold: true, margin: 0
      });
      s.addText(en.desc, {
        x: 6.5, y: ey, w: 2.7, h: 0.35,
        fontSize: 11, fontFace: "Arial", color: C.textDim, margin: 0
      });
    });

    // Bottom: philosophy
    card(s, 0.6, 4.2, 8.8, 1.2);
    s.addText("「有得有失」哲学", {
      x: 0.85, y: 4.28, w: 4.0, h: 0.3,
      fontSize: 16, fontFace: "Arial", color: C.gold, bold: true, margin: 0
    });
    s.addText([
      { text: "支路尽头有奖励（亚斯特拉直剑），但不能回头 → 只能直接往下跳 → 大概率一对多。", options: { breakLine: true, fontSize: 12, color: C.text } },
      { text: "但提供缓和机制：高亮火药桶 + 下落攻击机会 → 简化为可控的一对二。", options: { fontSize: 12, color: C.text } },
      { text: "奖励与风险成正比。", options: { fontSize: 12, color: C.ember, italic: true } },
    ], {
      x: 0.85, y: 4.62, w: 8.3, h: 0.7,
      fontFace: "Arial", margin: 0
    });
  }

  // ==================== SLIDE 7: 肥仔广场 ====================
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addTitleBar(s, "区块 4：肥仔广场", "WINGED KNIGHT PLAZA — 空间锚点与注意力操控");

    // Three cards
    const cards_data = [
      {
        icon: icons.cube, title: "空间锚点",
        desc: "反复让玩家从不同角度看到广场\n→ 形成空间认知",
        highlight: "「刚才在另一边看到的阳台」"
      },
      {
        icon: icons.skull, title: "强敌威慑",
        desc: "羽翼骑士沉重脚步 + 巨大身形\n→ 暗示潜行绕路",
        highlight: "骑士尸体 + 战火诉说城墙的过去"
      },
      {
        icon: icons.eye, title: "注意力操控",
        desc: "大胃袋吸引注意力\n→ 忽略背后藏的敌怪和物品",
        highlight: "「极大动作掩饰小动作」\n—— 刘谦魔术同理"
      },
    ];
    cards_data.forEach((cd, i) => {
      const x = 0.6 + i * 3.15;
      card(s, x, 1.5, 2.9, 2.3);
      s.addImage({ data: cd.icon, x: x + 1.1, y: 1.65, w: 0.45, h: 0.45 });
      s.addText(cd.title, {
        x: x + 0.15, y: 2.2, w: 2.6, h: 0.35,
        fontSize: 16, fontFace: "Arial", color: C.gold, bold: true, align: "center", margin: 0
      });
      s.addText(cd.desc, {
        x: x + 0.15, y: 2.6, w: 2.6, h: 0.65,
        fontSize: 11, fontFace: "Arial", color: C.textDim, align: "center", margin: 0
      });
      s.addShape(pres.shapes.RECTANGLE, { x: x + 0.4, y: 3.3, w: 2.1, h: 0.01, fill: { color: C.goldDim } });
      s.addText(cd.highlight, {
        x: x + 0.15, y: 3.4, w: 2.6, h: 0.35,
        fontSize: 10, fontFace: "Arial", color: C.textDark, align: "center", italic: true, margin: 0
      });
    });

    // Bottom: risk/reward
    card(s, 0.6, 4.1, 8.8, 1.3);
    s.addText("风险 / 奖励结构", {
      x: 0.85, y: 4.2, w: 4.0, h: 0.35,
      fontSize: 16, fontFace: "Arial", color: C.gold, bold: true, margin: 0
    });
    s.addText([
      { text: "潜行绕路", options: { bold: true, color: C.green, fontSize: 13 } },
      { text: "  →  无伤通过但放弃光点", options: { breakLine: true, color: C.textDim, fontSize: 13 } },
      { text: "拾取光点", options: { bold: true, color: C.ember, fontSize: 13 } },
      { text: "  →  必须与肥仔正面冲突 → 奖励是 ", options: { color: C.textDim, fontSize: 13 } },
      { text: "两个余火", options: { bold: true, color: C.gold, fontSize: 13 } },
    ], {
      x: 0.85, y: 4.6, w: 8.3, h: 0.55,
      fontFace: "Arial", margin: 0
    });
    s.addText("过渡性场景：衔接人脓屋顶、餐厅、高墙底层 — 设计精巧的「中间地带」", {
      x: 0.6, y: 5.1, w: 8.8, h: 0.3,
      fontSize: 10, fontFace: "Arial", color: C.textDark, align: "center", margin: 0
    });
  }

  // ==================== SLIDE 8: 返程捷径 ====================
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addTitleBar(s, "区块 5：返程捷径", "RETURN PATH — 心理操控的巅峰");

    // Flow chain
    const steps = [
      "弓箭手\n引路", "上楼看到\n门框+火把", "捡到反复\n看见的拾取物", "带灯小怪\n最后一吓", "坐电梯\n解锁捷径"
    ];
    steps.forEach((st, i) => {
      const x = 0.45 + i * 1.95;
      // Step card
      card(s, x, 1.55, 1.65, 1.1);
      s.addText(st, {
        x, y: 1.55, w: 1.65, h: 0.8,
        fontSize: 12, fontFace: "Arial", color: C.text, align: "center", valign: "middle", margin: 0
      });
      // Step number
      s.addShape(pres.shapes.OVAL, { x: x + 0.6, y: 2.35, w: 0.4, h: 0.4, fill: { color: C.gold } });
      s.addText(String(i + 1), {
        x: x + 0.6, y: 2.35, w: 0.4, h: 0.4,
        fontSize: 14, fontFace: "Arial", color: C.bg, bold: true, align: "center", valign: "middle", margin: 0
      });
      // Arrow (except last)
      if (i < 4) {
        s.addImage({ data: icons.arrow, x: x + 1.75, y: 2.4, w: 0.2, h: 0.2 });
      }
    });

    // Quote
    card(s, 0.6, 3.2, 8.8, 1.35);
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 3.2, w: 0.06, h: 1.35, fill: { color: C.ember } });
    s.addText("「将欲夺之，必固与之」", {
      x: 0.95, y: 3.3, w: 8.2, h: 0.45,
      fontSize: 22, fontFace: "Arial Black", color: C.gold, bold: true, margin: 0
    });
    s.addText([
      { text: "要让你体会解锁捷径的惊艳，必须先让你经历可控的绝望。", options: { breakLine: true, fontSize: 13, color: C.text } },
      { text: "这是魂与类魂的区别：一个是心理的掌握，一个是纯粹的恶意。", options: { fontSize: 13, color: C.textDim, italic: true } },
    ], {
      x: 0.95, y: 3.78, w: 8.2, h: 0.6,
      fontFace: "Arial", margin: 0
    });

    // Pre-boss checklist
    card(s, 0.6, 4.75, 8.8, 0.6);
    s.addText("战前准备清单：", {
      x: 0.85, y: 4.8, w: 1.8, h: 0.25,
      fontSize: 13, fontFace: "Arial", color: C.gold, bold: true, margin: 0
    });
    const items = ["多把可选武器", "两个锻造石（恰好可强化）", "黄金松脂（武器附魔）", "绿花草（提高精力恢复）"];
    s.addText(items.map((it, i) => ({
      text: it,
      options: { bullet: true, breakLine: i < items.length - 1, fontSize: 10, color: C.textDim }
    })), {
      x: 2.5, y: 4.8, w: 6.6, h: 0.45,
      fontFace: "Arial", paraSpaceAfter: 2, margin: 0
    });
    s.addText("「这一切的一切，都是在为接下来的精彩好戏做准备。」", {
      x: 0.6, y: 5.2, w: 8.8, h: 0.25,
      fontSize: 9, fontFace: "Arial", color: C.textDark, align: "right", italic: true, margin: 0
    });
  }

  // ==================== SLIDE 9: 心流节奏 ====================
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addTitleBar(s, "核心理论①：会呼吸的关卡", "FLOW THEORY — 心流节奏");

    // Flow visualization
    const flowStages = [
      { label: "战斗学习", state: "进入状态", color: C.green },
      { label: "难度递进", state: "循序渐进", color: C.gold },
      { label: "陷阱变奏", state: "提高警惕", color: C.ember },
      { label: "NPC/返程", state: "平复心情", color: C.goldDim },
      { label: "人脓激化", state: "情绪激活", color: C.red },
      { label: "探索平复", state: "给机会平复", color: C.goldDim },
      { label: "战斗偷袭", state: "再次收紧", color: C.ember },
    ];
    flowStages.forEach((fs, i) => {
      const x = 0.45 + i * 1.33;
      card(s, x, 1.55, 1.15, 1.85);
      // State circle
      s.addShape(pres.shapes.OVAL, {
        x: x + 0.25, y: 1.7, w: 0.55, h: 0.55,
        fill: { color: fs.color }
      });
      s.addText(String(i + 1), {
        x: x + 0.25, y: 1.7, w: 0.55, h: 0.55,
        fontSize: 16, fontFace: "Arial", color: C.white, bold: true, align: "center", valign: "middle", margin: 0
      });
      s.addText(fs.label, {
        x: x + 0.05, y: 2.38, w: 1.05, h: 0.3,
        fontSize: 11, fontFace: "Arial", color: C.text, bold: true, align: "center", margin: 0
      });
      s.addText(fs.state, {
        x: x + 0.05, y: 2.68, w: 1.05, h: 0.3,
        fontSize: 9, fontFace: "Arial", color: C.textDim, align: "center", margin: 0
      });
      // Wave indicator
      const isTense = [0, 1, 2, 4, 6].includes(i);
      s.addText(isTense ? "🔥" : "💨", {
        x: x + 0.05, y: 2.98, w: 1.05, h: 0.3,
        fontSize: 14, align: "center", margin: 0
      });
    });

    // Rhythm description
    card(s, 0.6, 3.7, 4.2, 1.75);
    s.addText("心流节奏", {
      x: 0.85, y: 3.8, w: 3.8, h: 0.35,
      fontSize: 16, fontFace: "Arial", color: C.gold, bold: true, margin: 0
    });
    s.addText("学习战斗 → 难度递进 → 陷阱变奏 → NPC/返程平复\n→ 人脓演出激化 → 探索平复 → 战斗偷袭再激化", {
      x: 0.85, y: 4.2, w: 3.8, h: 0.6,
      fontSize: 11, fontFace: "Arial", color: C.text, margin: 0
    });
    s.addText("一紧一松，张弛有度 — 完全符合游戏设计的 Flow Theory", {
      x: 0.85, y: 4.85, w: 3.8, h: 0.35,
      fontSize: 11, fontFace: "Arial", color: C.ember, italic: true, margin: 0
    });

    // Right: Flow Theory explanation
    card(s, 5.1, 3.7, 4.3, 1.75);
    s.addText("Flow Theory 关键要素", {
      x: 5.3, y: 3.8, w: 3.9, h: 0.35,
      fontSize: 16, fontFace: "Arial", color: C.gold, bold: true, margin: 0
    });
    const flowPoints = [
      "挑战与技能平衡：难度循序渐进",
      "清晰目标：光照/敌人/物品持续引导",
      "即时反馈：偷袭、陷阱、战斗结果",
      "控制感：玩家始终有选择权（多路线）",
      "专注：高强度战斗 + 探索 = 沉浸",
    ];
    s.addText(flowPoints.map((p, i) => ({
      text: p,
      options: { bullet: true, breakLine: i < flowPoints.length - 1, fontSize: 10, color: C.textDim }
    })), {
      x: 5.3, y: 4.2, w: 3.9, h: 1.1,
      fontFace: "Arial", paraSpaceAfter: 4, margin: 0
    });
  }

  // ==================== SLIDE 10: 3D 银河城 ====================
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addTitleBar(s, "核心理论②：3D 恶魔城", "3D METROIDVANIA — 空间连通性");

    // Left: concept
    card(s, 0.6, 1.5, 4.5, 2.5);
    s.addImage({ data: icons.cube, x: 0.85, y: 1.65, w: 0.45, h: 0.45 });
    s.addText("2D 银河城 → 3D 魂系", {
      x: 1.45, y: 1.65, w: 3.4, h: 0.35,
      fontSize: 16, fontFace: "Arial", color: C.gold, bold: true, margin: 0
    });
    s.addText([
      { text: "魂的地图是将房间与区块在三维世界进行排列堆叠，路线设计思路与 2D 银河城相通——通过地图设计引导玩家探索和战斗。", options: { breakLine: true, fontSize: 12, color: C.text } },
      { text: "", options: { breakLine: true, fontSize: 6 } },
      { text: "核心手法：", options: { breakLine: true, fontSize: 13, bold: true, color: C.gold } },
      { text: "• 单向门 → 强制回头探索", options: { breakLine: true, fontSize: 11, color: C.textDim } },
      { text: "• 跳板/捷径 → 二次经过的路线多样性", options: { breakLine: true, fontSize: 11, color: C.textDim } },
      { text: "• 电梯 → 连通高低差，制造惊艳感", options: { breakLine: true, fontSize: 11, color: C.textDim } },
      { text: "• 可见不可及 → 激发探索欲", options: { fontSize: 11, color: C.textDim } },
    ], {
      x: 0.85, y: 2.1, w: 4.0, h: 1.8,
      fontFace: "Arial", paraSpaceAfter: 3, margin: 0
    });

    // Right: direction confusion
    card(s, 5.4, 1.5, 4.0, 2.5);
    s.addText("方向感模糊的底层逻辑", {
      x: 5.6, y: 1.6, w: 3.6, h: 0.35,
      fontSize: 16, fontFace: "Arial", color: C.gold, bold: true, margin: 0
    });
    const logic = [
      "玩家走在地面上 → 世界是「平面」的",
      "但设计时世界是三维的",
      "玩家只知道「从这个房间出去是什么房间」",
      "很少构建真实的空间联系",
      "高强度战斗 + 探索 → 方向感被系统性模糊",
      "捷径开通时 → 发现兜了一大圈回到原点",
    ];
    s.addText(logic.map((l, i) => ({
      text: l,
      options: { bullet: true, breakLine: i < logic.length - 1, fontSize: 10, color: C.textDim }
    })), {
      x: 5.6, y: 2.05, w: 3.6, h: 1.8,
      fontFace: "Arial", paraSpaceAfter: 4, margin: 0
    });

    // Bottom: big takeaway
    card(s, 0.6, 4.25, 8.8, 1.15);
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 4.25, w: 0.06, h: 1.15, fill: { color: C.ember } });
    s.addText("捷径的惊艳感从何而来？", {
      x: 0.95, y: 4.35, w: 4.0, h: 0.35,
      fontSize: 18, fontFace: "Arial", color: C.gold, bold: true, margin: 0
    });
    s.addText("先系统性模糊方向 → 让玩家失去空间定位 → 捷径打开时瞬间恢复认知 → 惊艳感极其强烈", {
      x: 0.95, y: 4.73, w: 8.2, h: 0.55,
      fontSize: 13, fontFace: "Arial", color: C.text, margin: 0
    });
  }

  // ==================== SLIDE 11: 设计手法速查 ====================
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addTitleBar(s, "设计手法速查表", "DESIGN TECHNIQUES CHEAT SHEET");

    const categories = [
      {
        title: "视觉引导", color: C.gold,
        items: ["光照/光源定向", "火把标记门框", "拾取物白点引导", "追光源（解包证实）"]
      },
      {
        title: "敌人引导", color: C.ember,
        items: ["敌人背影暗示可避战", "弩手逼迫回头发掘路线", "宝石结晶虫追逐引导", "强敌身形暗示潜行"]
      },
      {
        title: "空间引导", color: C.gold,
        items: ["破洞预览（多次看到）", "俯瞰预览（建立预期）", "反复看到广场（锚点）", "可见不可及（激发探索）"]
      },
      {
        title: "心理节奏", color: C.red,
        items: ["偷袭 → 提高警惕", "陷阱 → 改变节奏", "最后一吓 → 放大惊艳", "战前装备 → 信心建设"]
      },
    ];

    categories.forEach((cat, ci) => {
      const x = 0.45 + ci * 2.35;
      card(s, x, 1.5, 2.15, 3.1);
      // Category header
      s.addShape(pres.shapes.RECTANGLE, { x, y: 1.5, w: 2.15, h: 0.5, fill: { color: cat.color } });
      s.addText(cat.title, {
        x, y: 1.5, w: 2.15, h: 0.5,
        fontSize: 14, fontFace: "Arial", color: C.bg, bold: true, align: "center", valign: "middle", margin: 0
      });
      // Items
      cat.items.forEach((item, ii) => {
        s.addText(item, {
          x: x + 0.12, y: 2.15 + ii * 0.55, w: 1.91, h: 0.45,
          fontSize: 10, fontFace: "Arial", color: C.textDim, margin: 0
        });
        if (ii < cat.items.length - 1) {
          s.addShape(pres.shapes.RECTANGLE, {
            x: x + 0.2, y: 2.58 + ii * 0.55, w: 1.75, h: 0.005, fill: { color: C.bgCard2 }
          });
        }
      });
    });

    // Bottom: route control
    card(s, 0.45, 4.85, 9.1, 0.6);
    s.addText("路线控制手法：", {
      x: 0.7, y: 4.9, w: 1.5, h: 0.25,
      fontSize: 12, fontFace: "Arial", color: C.gold, bold: true, margin: 0
    });
    s.addText("单向门（强制回头探索）  ·  跳板捷径（二次经过的路线多样性）  ·  有得有失（支路不能回头）  ·  电梯/梯子（垂直连通）", {
      x: 2.2, y: 4.9, w: 7.1, h: 0.25,
      fontSize: 10, fontFace: "Arial", color: C.textDim, margin: 0
    });
    s.addText("弓箭手指向捷径", {
      x: 0.7, y: 5.17, w: 1.5, h: 0.2,
      fontSize: 9, fontFace: "Arial", color: C.textDark, margin: 0
    });
  }

  // ==================== SLIDE 12: 总结 ====================
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };

    // Top decorative
    s.addImage({ data: icons.fire, x: 4.55, y: 0.35, w: 0.7, h: 0.7 });

    s.addText("总结：伟大关卡设计的 DNA", {
      x: 0.8, y: 1.2, w: 8.4, h: 0.6,
      fontSize: 32, fontFace: "Arial Black", color: C.gold, bold: true, align: "center", margin: 0
    });

    // Three summary columns
    const summaries = [
      {
        icon: icons.map, title: "空间是语言",
        points: [
          "光照、破洞、门框 — 一切视觉元素都是设计师的\"词汇\"",
          "俯瞰预览 + 空间锚点 → 构建玩家内心地图",
          "3D 银河城：房间堆叠 + 捷径连通 = 惊艳的空间叙事",
        ]
      },
      {
        icon: icons.heart, title: "节奏是呼吸",
        points: [
          "战斗(紧) → 探索(松) → 偷袭(紧) → NPC(松)",
          "心流理论：难度与技能平衡，持续引导",
          "陷阱、偷袭、强敌 — 控制节奏的\"标点符号\"",
        ]
      },
      {
        icon: icons.light, title: "选择是尊重",
        points: [
          "多路线 = 玩家的代理感（Agency）",
          "有得有失：风险与奖励成正比",
          "潜行 or 战斗？跳板 or 绕路？选择权永远在玩家手中",
        ]
      },
    ];

    summaries.forEach((sm, i) => {
      const x = 0.5 + i * 3.15;
      card(s, x, 2.1, 2.9, 2.6);
      s.addImage({ data: sm.icon, x: x + 1.1, y: 2.25, w: 0.45, h: 0.45 });
      s.addText(sm.title, {
        x: x + 0.15, y: 2.8, w: 2.6, h: 0.35,
        fontSize: 16, fontFace: "Arial", color: C.gold, bold: true, align: "center", margin: 0
      });
      s.addShape(pres.shapes.RECTANGLE, { x: x + 0.5, y: 3.2, w: 1.9, h: 0.01, fill: { color: C.goldDim } });
      s.addText(sm.points.map((p, pi) => ({
        text: p,
        options: { bullet: true, breakLine: pi < sm.points.length - 1, fontSize: 10, color: C.textDim }
      })), {
        x: x + 0.2, y: 3.3, w: 2.5, h: 1.2,
        fontFace: "Arial", paraSpaceAfter: 5, margin: 0
      });
    });

    // Closing quote
    s.addShape(pres.shapes.RECTANGLE, { x: 3.5, y: 5.0, w: 3, h: 0.015, fill: { color: C.goldDim } });
    s.addText("「这不是关卡，这是一首用空间写成的诗。」", {
      x: 0.8, y: 5.15, w: 8.4, h: 0.35,
      fontSize: 13, fontFace: "Arial", color: C.textDim, align: "center", italic: true, margin: 0
    });
  }

  // --- Write ---
  const outPath = "/Users/isaachsiadocs/Library/CloudStorage/OneDrive-共享的库-onedrive/Private/个人知识库/黑暗之魂3_关卡拆解②_高墙深处.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("PPTX written to: " + outPath);
}

build().catch(err => { console.error(err); process.exit(1); });
