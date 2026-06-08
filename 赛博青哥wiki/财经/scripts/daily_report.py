#!/usr/bin/env python3
"""
脚本3：每日市场状态日报
拉取北向资金、强势股/题材归因、概念板块排名，输出市场状态。
输出：Wiki/数据/YYYYMMDD-市场状态日报.md
"""
import os
import json
import time
import urllib.request
from datetime import datetime

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "Wiki", "数据")

def fetch_json(url, headers=None, timeout=15):
    req = urllib.request.Request(url)
    req.add_header("User-Agent", "Mozilla/5.0")
    if headers:
        for k, v in headers.items():
            req.add_header(k, v)
    try:
        resp = urllib.request.urlopen(req, timeout=timeout)
        return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        return {"error": str(e)}

def get_northbound_flow():
    url = "https://qt.gtimg.cn/q=ff_hsgt"
    req = urllib.request.Request(url)
    req.add_header("User-Agent", "Mozilla/5.0")
    try:
        resp = urllib.request.urlopen(req, timeout=10)
        data = resp.read().decode("gbk", errors="ignore")
        return "数据已获取（腾讯财经）" if len(data) > 100 else "数据异常"
    except:
        return "接口暂不可用"

def get_hot_stocks():
    url2 = "https://finance.pae.baidu.com/vapi/v1/hotrank?market=ab&type=day&pagenum=1&pagesize=20"
    try:
        req = urllib.request.Request(url2)
        req.add_header("User-Agent", "Mozilla/5.0")
        req.add_header("Referer", "https://gushitong.baidu.com/")
        resp = urllib.request.urlopen(req, timeout=10)
        data = json.loads(resp.read().decode("utf-8"))
        if data.get("ResultCode") in ["0", 0, 0]:
            items = data.get("Result", {}).get("list", [])[:15]
            return [{"name": item.get("stockName", ""), "code": item.get("stockCode", ""),
                     "change": item.get("changePct", ""), "reason": item.get("hotReason", "")[:30]}
                    for item in items]
    except Exception as e:
        return [{"error": str(e)}]
    return []

def get_sector_ranking():
    url = "https://finance.pae.baidu.com/vapi/v1/boardrank?boardtype=concept&pagenum=1&pagesize=10"
    try:
        req = urllib.request.Request(url)
        req.add_header("User-Agent", "Mozilla/5.0")
        req.add_header("Referer", "https://gushitong.baidu.com/")
        resp = urllib.request.urlopen(req, timeout=10)
        data = json.loads(resp.read().decode("utf-8"))
        if data.get("ResultCode") in ["0", 0, 0]:
            items = data.get("Result", {}).get("list", [])[:10]
            return [{"name": item.get("boardName", ""), "change": item.get("changePct", ""),
                     "leader": item.get("leadStockName", "")}
                    for item in items]
    except:
        pass
    return []

def generate_report():
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    lines = [
        "# 市场状态日报",
        f"\n> 更新时间：{now}\n",
        "## 北向资金",
        f"状态：{get_northbound_flow()}\n",
        "## 今日强势股 / 题材归因",
    ]

    hot = get_hot_stocks()
    if hot:
        lines.append("| 标的 | 代码 | 涨跌幅 | 题材 |")
        lines.append("|------|------|--------|------|")
        for h in hot[:10]:
            lines.append(f"| {h.get('name','')} | {h.get('code','')} | {h.get('change','')}% | {h.get('reason','')} |")
    else:
        lines.append("暂未获取到数据\n")

    lines.append("\n## 概念板块排名")
    sectors = get_sector_ranking()
    if sectors:
        lines.append("| 板块 | 涨跌幅 | 领涨股 |")
        lines.append("|------|--------|--------|")
        for s in sectors:
            lines.append(f"| {s.get('name','')} | {s.get('change','')}% | {s.get('leader','')} |")
    else:
        lines.append("暂未获取到数据\n")

    lines.append("\n## 博主框架视角\n")
    lines.append("*请结合精筛结果和标的池日报综合判断。*")
    lines.append("\n- [[博主决策时间线]]")
    lines.append("- [[标的总览]]")
    lines.append("- [精筛候选](精筛候选.csv)")

    return "\n".join(lines)

def main():
    print("[1/2] Fetching market data...")
    report = generate_report()

    print("[2/2] Writing report...")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    today_str = datetime.now().strftime("%Y%m%d")
    output_file = os.path.join(OUTPUT_DIR, f"{today_str}-市场状态日报.md")

    with open(output_file, "w", encoding="utf-8") as f:
        f.write(report)
    print(f"  Written to {output_file}")
    print("Done.")

if __name__ == "__main__":
    main()
