#!/usr/bin/env python3
"""
脚本1：全市场粗筛（每日15:30后运行）
用腾讯财经API批量拉全市场PE/PB/市值，按博主框架硬门槛粗筛。
输出：Wiki/数据/YYYYMMDD-粗筛结果.csv
"""
import urllib.request
import time
import csv
import os
from datetime import datetime

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "Wiki", "数据")

def tencent_quote_batch(codes):
    results = {}
    batch_size = 50
    for i in range(0, len(codes), batch_size):
        batch = codes[i:i+batch_size]
        prefixed = []
        for c in batch:
            c = c.strip()
            if c.startswith(("6", "9")): prefixed.append(f"sh{c}")
            elif c.startswith("8"): prefixed.append(f"bj{c}")
            else: prefixed.append(f"sz{c}")

        url = "https://qt.gtimg.cn/q=" + ",".join(prefixed)
        req = urllib.request.Request(url)
        req.add_header("User-Agent", "Mozilla/5.0")
        try:
            resp = urllib.request.urlopen(req, timeout=15)
            data = resp.read().decode("gbk", errors="ignore")
        except Exception as e:
            print(f"  [WARN] batch {i}-{i+batch_size} failed: {e}")
            continue

        for line in data.strip().split(";"):
            if not line.strip() or "=" not in line or '"' not in line:
                continue
            vals = line.split('"')[1].split("~") if '"' in line else []
            if len(vals) < 53:
                continue
            code = line.split("=")[0].split("_")[-1][2:]
            try:
                results[code] = {
                    "code": code,
                    "name": vals[1],
                    "price": float(vals[3]) if vals[3] else 0,
                    "change_pct": float(vals[32]) if vals[32] else 0,
                    "pe_ttm": float(vals[39]) if vals[39] else 0,
                    "pb": float(vals[46]) if vals[46] else 0,
                    "mcap_yi": float(vals[44]) if vals[44] else 0,
                }
            except (ValueError, IndexError):
                continue
        time.sleep(0.5)
    return results

def generate_code_list():
    codes = []
    for i in range(600000, 606000):
        codes.append(str(i))
    for i in range(688000, 690000):
        codes.append(str(i))
    for i in range(1, 5000):
        codes.append(f"{i:06d}")
    for i in range(300000, 302000):
        codes.append(str(i))
    return codes

def coarse_filter(quotes):
    passed = []
    for code, q in quotes.items():
        if q["price"] <= 0 or q["pe_ttm"] <= 0:
            continue
        if q["pb"] > 10:
            continue
        if q["mcap_yi"] < 50:
            continue
        if abs(q["change_pct"]) > 5:
            continue
        if q["pe_ttm"] > 200:
            continue
        passed.append(q)
    return passed

def main():
    print("[1/3] Generating code list...")
    codes = generate_code_list()
    print(f"  Total codes: {len(codes)}")

    print("[2/3] Fetching quotes (this will take 5-10 minutes)...")
    quotes = tencent_quote_batch(codes)
    print(f"  Got quotes for {len(quotes)} stocks")

    print("[3/3] Coarse filtering...")
    passed = coarse_filter(quotes)
    print(f"  Passed: {len(passed)} stocks")

    passed.sort(key=lambda x: x["pe_ttm"])

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    today_str = datetime.now().strftime("%Y%m%d")
    output_file = os.path.join(OUTPUT_DIR, f"{today_str}-粗筛结果.csv")

    with open(output_file, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=["code", "name", "price", "change_pct", "pe_ttm", "pb", "mcap_yi"])
        writer.writeheader()
        for q in passed:
            writer.writerow({
                "code": q.get("code", ""),
                "name": q["name"],
                "price": q["price"],
                "change_pct": q["change_pct"],
                "pe_ttm": q["pe_ttm"],
                "pb": q["pb"],
                "mcap_yi": q["mcap_yi"]
            })
    print(f"  Written to {output_file}")
    print("Done.")

if __name__ == "__main__":
    main()
