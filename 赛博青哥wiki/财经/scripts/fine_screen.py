#!/usr/bin/env python3
"""
脚本2：精筛 + 博主标的池跟踪 + 布林线扫描 + 网宿科技每日做T建议
"""
import os, csv, time, urllib.request
from datetime import datetime

try:
    from mootdx.quotes import Quotes
except ImportError:
    print("请先安装: pip install mootdx"); exit(1)
try:
    from stockstats import StockDataFrame
except ImportError:
    print("请先安装: pip install stockstats"); exit(1)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
from datetime import date
COARSE_CSV = os.path.join(BASE_DIR, "Wiki", "数据", f"{date.today().strftime('%Y%m%d')}-粗筛结果.csv")
FINE_CSV = os.path.join(BASE_DIR, "Wiki", "数据", "精筛候选.csv")
TRACKING_MD = os.path.join(BASE_DIR, "Wiki", "数据", "博主标的池日报.md")

BLOGGER_STOCKS = {
    "三环集团": "300408", "顺络电子": "002138", "利和兴": "301013", "洁美科技": "002859", "博迁新材": "605376", "国瓷材料": "300285", "风华高科": "000636", "昀冢科技": "688260", "钧崴电子": "301458", "商络电子": "300975", "盈方微": "000670", "云汉芯城": "301213", "深圳华强": "000062", "鼎通科技": "688668", "奕东电子": "301123", "意华股份": "002897", "江海股份": "002484", "泓淋电力": "301439", "太辰光": "300570", "胜宏科技": "300476", "鹏鼎控股": "002938", "生益科技": "600183", "中钨高新": "000657", "欧科亿": "688308", "南亚新材": "688519", "潞安环能": "601699", "山西焦煤": "000983", "中国神华": "601088", "陕西煤业": "601225", "中煤能源": "601898", "淮北矿业": "600985", "平煤股份": "601666", "醋化股份": "603968", "金禾实业": "002597", "巨化股份": "600160", "中仑新材": "301565", "圣泉集团": "605589", "中国建筑": "601668", "中国铁建": "601186", "中国中铁": "601390", "中国交建": "601800", "中国中冶": "601618", "上海建工": "600170", "隧道股份": "600820", "安徽建工": "600502", "国检集团": "603060", "建科股份": "301115", "深圳瑞捷": "300977", "金螳螂": "002081", "亚厦股份": "002375", "视觉中国": "000681", "易点天下": "301171", "协鑫能科": "002015", "豫能控股": "001896"
}

client = Quotes.factory(market='std', server=('110.41.147.114', 7709), bestip=False)

def get_kline(code, days=60):
    market = 1 if code.startswith(("6","9")) else 0
    try:
        k = client.bars(symbol=code, market=market, category=4, offset=days)
        return k if k is not None and len(k) >= 25 else None
    except:
        return None

def compute_bollinger_position(klines):
    if klines is None or len(klines) < 25: return {}
    try:
        import pandas as pd
        df = klines.rename(columns={'vol': 'volume'})
        sdf = StockDataFrame.retype(df)
        close = sdf["close"]
        std20 = close.rolling(20).std()
        dev = std20.rolling(5).mean().iloc[-1]
        mid_20 = close.rolling(20).mean().iloc[-1]
        price = close.iloc[-1]
        top_track = mid_20 + 3 * dev
        track2 = mid_20 + 1 * dev
        track5 = mid_20 - 2 * dev
        bot_track = mid_20 - 3 * dev
        bandwidth = (top_track - bot_track) / mid_20
        bw_series = ((close.rolling(20).mean() + 3 * std20.rolling(5).mean()) - 
                     (close.rolling(20).mean() - 3 * std20.rolling(5).mean())) / close.rolling(20).mean()
        bw_min_20 = bw_series.rolling(20).min().iloc[-1]
        is_converging = bandwidth <= bw_min_20 * 1.05
        if price >= top_track: zone = "顶轨以上"
        elif price >= track2: zone = "二轨~顶轨"
        elif price >= mid_20: zone = "中轨~二轨"
        elif price >= mid_20 - 1 * dev: zone = "四轨~中轨"
        elif price >= track5: zone = "五轨~四轨"
        else: zone = "底轨~五轨"
        recent_high = close.iloc[-10:].max(); recent_low = close.iloc[-10:].min()
        had_surge = (recent_high / recent_low - 1) > 0.15
        at_track2 = abs(price - track2) / track2 < 0.03
        n_pattern = had_surge and at_track2
        return {"price": round(price, 2), "mid": round(mid_20, 2), "track2": round(track2, 2),
                "track5": round(track5, 2), "top": round(top_track, 2), "bot": round(bot_track, 2),
                "zone": zone, "bandwidth_pct": round(bandwidth * 100, 1),
                "converging": is_converging, "n_pattern": n_pattern,
                "signal": ("🔴 破顶轨-离场" if price >= top_track else
                          "🟡 N字二轨候选" if n_pattern else
                          "🟢 收敛形态" if is_converging else
                          "🔵 底轨附近-关注" if price <= track5 else "⚪ 正常")}
    except Exception as e:
        return {"error": str(e)}

def get_finance_data(code):
    market = 1 if code.startswith(("6","9")) else 0
    try:
        df = client.finance(symbol=code, market=market)
        if df is not None and len(df) > 0:
            row = df.iloc[-1]
            jlr = float(row.get("jinglirun", 0) or 0)
            jzc = float(row.get("jingzichan", 1) or 1)
            zysr = float(row.get("zhuyingshouru", 0) or 0)
            zylr = float(row.get("zhuyinglirun", 0) or 0)
            return {"roe": round(jlr/jzc*100,1) if jzc>0 else 0,
                    "gross_margin": round(zylr/zysr*100,1) if zysr>0 else 0,
                    "net_margin": round(jlr/zysr*100,1) if zysr>0 else 0,
                    "revenue": round(zysr/1e8,1), "net_profit": round(jlr/1e8,1)}
    except: pass
    return {}

def fine_screen(stocks):
    passed = []
    for i, s in enumerate(stocks):
        code = s.get("code", ""); 
        if not code: continue
        fin = get_finance_data(code)
        if not fin: continue
        if fin.get("roe",0) < 10 or fin.get("gross_margin",0) < 20: continue
        pe = s.get("pe_ttm", 0); g = fin.get("roe", 15)
        s["roe"] = fin["roe"]; s["gross_margin"] = fin["gross_margin"]
        s["net_margin"] = fin["net_margin"]; s["revenue_yi"] = fin["revenue"]
        s["net_profit_yi"] = fin["net_profit"]; s["peg"] = round(pe/g,1) if g>0 else 999
        passed.append(s)
        if (i+1)%50 == 0: print(f"  Screened {i+1}/{len(stocks)}...")
        time.sleep(0.2)
    return passed

def track_blogger_stocks():
    lines = ["# 博主标的池日报", f"\n> 更新时间：{datetime.now().strftime('%Y-%m-%d %H:%M')}\n"]
    lines.append("| 标的 | 代码 | 价格 | PE | PB | 布林线位置 | 信号 |")
    lines.append("|------|------|------|-----|-----|-----------|------|")
    for name, code in BLOGGER_STOCKS.items():
        try:
            prefixed = f"sh{code}" if code.startswith(("6","9")) else f"sz{code}"
            url = f"https://qt.gtimg.cn/q={prefixed}"
            req = urllib.request.Request(url); req.add_header("User-Agent", "Mozilla/5.0")
            resp = urllib.request.urlopen(req, timeout=10)
            data = resp.read().decode("gbk", errors="ignore")
            vals = data.split('"')[1].split("~") if '"' in data else []
            if len(vals) < 53: lines.append(f"| {name} | {code} | — | — | — | — | 无数据 |"); continue
            price = float(vals[3] or 0); pe = float(vals[39] or 0); pb = float(vals[46] or 0)
            kl = get_kline(code); boll = compute_bollinger_position(kl) if kl is not None else {}
            lines.append(f"| {name} | {code} | {price:.2f} | {pe:.1f} | {pb:.2f} | {boll.get('zone','—')} | {boll.get('signal','—')} |")
        except Exception as e: lines.append(f"| {name} | {code} | — | — | — | — | {e} |")
        time.sleep(0.2)
    return "\n".join(lines)

def generate_zuot_tips():
    """生成网宿科技每日做T建议"""
    code = '300017'; name = '网宿科技'
    url = f'https://qt.gtimg.cn/q=sz{code}'
    req = urllib.request.Request(url); req.add_header('User-Agent', 'Mozilla/5.0')
    resp = urllib.request.urlopen(req, timeout=10)
    data = resp.read().decode('gbk', errors='ignore')
    vals = data.split('"')[1].split('~') if '"' in data else []
    if len(vals) < 53: return f'\n---\n## {name} 做T策略\n\n数据获取失败\n'
    price = float(vals[3] or 0); change = float(vals[32] or 0); turnover = float(vals[38] or 0)
    kl = get_kline(code, 60)
    if kl is None: return f'\n---\n## {name} 做T策略\n\nK线数据获取失败\n'
    b = compute_bollinger_position(kl)
    if not b: return f'\n---\n## {name} 做T策略\n\n布林线计算失败\n'
    mid = b['mid']; t2 = b['track2']; t4 = 2*mid - t2 if mid > 0 and t2 > 0 else mid*0.95
    bw = b['bandwidth_pct']; zone = b['zone']; conv = b['converging']
    lines = [f'\n---\n## {name} 每日做T策略\n']
    lines.append(f'> 现价 {price:.2f} | 涨跌 {change:+.1f}% | 换手 {turnover:.1f}%\n')
    lines.append(f'| 指标 | 数值 |'); lines.append(f'|------|------|')
    lines.append(f'| 中轨(20MA) | {mid:.2f} |'); lines.append(f'| 二轨(+1DEV) | {t2:.2f} |')
    lines.append(f'| 四轨(-1DEV) | {t4:.2f} |'); lines.append(f'| 带宽 | {bw:.1f}% |')
    lines.append(f'| 当前位置 | {zone} |'); lines.append('')
    lines.append('### 今日策略')
    if price > t2 and t2 > 0:
        lines.append('🟢 **适合做T出（早卖午接）**')
        lines.append(f'- 价格在二轨({t2:.2f})以上，处于卖点区间'); lines.append('- 网宿股性：冲高回落频率高（16/90天），上影均值1.7%')
        lines.append('- **开盘后若缩量冲高 → 卖出1/4仓位 → 等回落接回**'); lines.append('- 若开盘直接下跌 → 不做T')
    elif price < t4 and t4 > 0:
        lines.append('🔵 **适合做T进（早买午抛）**')
        lines.append(f'- 价格在四轨({t4:.2f})以下，处于买点区间'); lines.append('- 网宿股性：探底回升需放量配合（9/90天）')
        lines.append('- **开盘后若放量下探+下影明显 → 买入1/4仓位 → 反弹卖出**'); lines.append('- 若缩量下跌 → 不做T')
    elif conv:
        lines.append('🟡 **收敛中，不适合做T**'); lines.append(f'- 带宽({bw:.1f}%)收窄，波动空间不够')
    else:
        lines.append('⚪ **不适合做T**'); lines.append('- 价格在中轨~二轨之间，区间太窄'); lines.append('- 按博主框架：产业逻辑标的，持仓不动')
    lines.append(''); lines.append('### 股性提醒')
    lines.append('- 这只票**早卖午接**优于早买午抛（冲高回落是探底回升的 1.8 倍）')
    lines.append('- 大涨必须放量（94% 大涨日伴随放量），缩量日不期待突破')
    lines.append('- 连涨/连跌最多 6 天，第 4 天警惕反转'); lines.append('- 单次做T不超过持仓的 1/4')
    return '\n'.join(lines)

def main():
    if not os.path.exists(COARSE_CSV):
        print(f"请先运行 coarse_screen.py"); return
    stocks = []
    with open(COARSE_CSV, "r", encoding="utf-8-sig") as f:
        for row in csv.DictReader(f):
            row["pe_ttm"] = float(row.get("pe_ttm",0)); row["roe"]=0; row["gross_margin"]=0
            row["revenue_yoy"]=0; row["peg"]=0; stocks.append(row)
    print(f"[1/3] Fine screening {len(stocks)} candidates...")
    passed = fine_screen(stocks); print(f"  Passed: {len(passed)}")
    passed.sort(key=lambda x: x.get("peg",999))
    with open(FINE_CSV, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=["code","name","price","pe_ttm","pb","roe","gross_margin","net_margin","revenue_yi","net_profit_yi","peg","mcap_yi"])
        w.writeheader()
        for s in passed: w.writerow({k:s.get(k,"") for k in ["code","name","price","pe_ttm","pb","roe","gross_margin","net_margin","revenue_yi","net_profit_yi","peg","mcap_yi"]})
    print(f"  Written to {FINE_CSV}")
    print("[2/3] Tracking blogger stock pool...")
    md = track_blogger_stocks()
    os.makedirs(os.path.dirname(TRACKING_MD), exist_ok=True)
    with open(TRACKING_MD, "w", encoding="utf-8") as f: f.write(md)
    print(f"  Written to {TRACKING_MD}")
    print("[+] 网宿科技 做T建议...")
    tips = generate_zuot_tips()
    with open(TRACKING_MD, "a", encoding="utf-8") as f: f.write(tips)
    print("  Appended.")
    print("[3/3] Done.")

if __name__ == "__main__":
    main()
