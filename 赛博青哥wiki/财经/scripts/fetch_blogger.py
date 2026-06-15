#!/usr/bin/env python3
"""抓取B站UP主「青枫浦上Q」充电专属内容"""

import requests, json, re, time, sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

BLOGGER_MID = "1420210197"
BLOGGER_NAME = "青枫浦上Q"
SCRIPT_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = SCRIPT_DIR.parent / "Raw"

FULL_COOKIE = (
    "buvid3=538AAE58-0AE6-B74C-6D0D-55EF7963C90949209infoc; "
    "buvid4=AF6EA88B-3538-7A5A-AE17-B3D6E60D29D300732-024082307-eOG0/tQF1hv9igYzmzfbag%3D%3D; "
    "buvid_fp=8e5df3c36755fe4503e374bd8c41f2a2; "
    "_uuid=F310E5691-910D8-9322-DA96-C45DC2C8DED249248infoc; "
    "b_nut=1755951549; "
    "home_feed_column=5; "
    "browser_resolution=1997-1316; "
    "SESSDATA=8fc22bdd%2C1795826963%2Cc0dea%2A61CjBLmcrvuCoOLMP9nSzP6Z"
    "XIejwY5ex2lpLbmVwkANmZ8m4UVB5VOMHEGra1Jxk9t2ISVmxXV3ZJM2tJYjFpTjU1N2"
    "xDRkp2TmFLWHdrcVZ5WW4wX2gyUGY0d09OTk4xcmFJQm9rT0hZN195anBrYnJmWGxpaF"
    "dDaG9kNXVvVHNwODNCVlZ3dmdBIIEC; "
    "bili_jct=1cc1f8a2eda58e3352a7d5e617604a4e; "
    "DedeUserID=1946575; "
    "DedeUserID__ckMd5=48bf96f4ad2edc18; "
    "sid=5bvydf4r; "
    "CURRENT_FNVAL=4048; "
    "b_lsid=0582ABDB_19EA7C106B0"
)

SPACE_DYNAMIC_API = "https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space"
CST = timezone(timedelta(hours=8))


def build_session():
    s = requests.Session()
    for item in FULL_COOKIE.split("; "):
        if "=" in item:
            k, _, v = item.partition("=")
            if k and v: s.cookies.set(k.strip(), v.strip(), domain=".bilibili.com")
    s.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Origin": "https://space.bilibili.com",
        "Referer": f"https://space.bilibili.com/{BLOGGER_MID}/dynamic",
    })
    return s


def extract_basic_info(item):
    modules = item.get("modules", {})
    author = modules.get("module_author", {})
    dynamic = modules.get("module_dynamic", {})
    major = dynamic.get("major") or {}

    pub_ts = int(author.get("pub_ts", 0) or 0)
    dy_id = item.get("id_str", str(item.get("id", "")))
    major_type = major.get("type", "")

    title = ""; preview = ""
    if major_type == "MAJOR_TYPE_OPUS":
        opus = major.get("opus", {})
        title = opus.get("title", "")
        s = opus.get("summary", {})
        preview = s.get("text", "") if isinstance(s, dict) else str(s)
    elif major_type == "MAJOR_TYPE_ARCHIVE":
        a = major.get("archive", {})
        title = a.get("title", ""); preview = a.get("desc", "") or a.get("dynamic", "")

    full_text = preview
    jump_opus_id = ""
    if major_type == "MAJOR_TYPE_OPUS":
        opus = major.get("opus", {})
        jump_opus_id = opus.get("jump_url", "")
        if jump_opus_id:
            jump_opus_id = jump_opus_id.split("/")[-1] if "/" in jump_opus_id else jump_opus_id

    return {"dy_id": dy_id, "pub_ts": pub_ts, "major_type": major_type,
            "title": title, "preview": preview, "full_text": full_text, "jump_opus_id": jump_opus_id}


def fetch_opus_detail(session, jump_opus_id):
    if not jump_opus_id: return ""
    try:
        url = f"https://api.bilibili.com/x/polymer/web-dynamic/v1/opus/detail?jump_opus_id={jump_opus_id}"
        r = session.get(url, timeout=15)
        data = r.json()
        item = data.get("data", {}).get("item", {})
        if not item: return ""
        modules = item.get("modules", {})
        content_module = modules.get("module_content", {})
        desc = content_module.get("desc", {})
        return desc.get("text", "")
    except Exception:
        return ""


def fetch_list(session, from_date, to_date):
    items = []
    offset = ""
    for page in range(20):
        params = {"host_mid": BLOGGER_MID, "offset": offset}
        r = session.get(SPACE_DYNAMIC_API, params=params, timeout=15)
        if r.status_code != 200: break
        data = r.json()
        if data.get("code") != 0: break
        page_items = data.get("data", {}).get("items", [])
        if not page_items: break
        for item in page_items:
            info = extract_basic_info(item)
            if info["pub_ts"] == 0: continue
            item_date = datetime.fromtimestamp(info["pub_ts"], tz=CST).date()
            if item_date < from_date: return items
            if item_date <= to_date: items.append(info)
        has_more = data.get("data", {}).get("has_more", False)
        if not has_more: break
        offset = data.get("data", {}).get("offset", "")
        time.sleep(0.3)
    return items


def make_filename(info):
    pub_dt = datetime.fromtimestamp(info["pub_ts"], tz=CST)
    date_str = pub_dt.strftime("%y-%m-%d")
    title = info["title"] or info["preview"] or "无标题"
    title = title.replace("/", "-").replace("\\", "-").replace(":", "-")[:40]
    mtype = info["major_type"]
    if mtype == "MAJOR_TYPE_OPUS":
        prefix = "复盘" if "复盘" in title else "早盘" if "早盘" in title else "视频" if "视频" in title else "其他"
    elif mtype == "MAJOR_TYPE_ARCHIVE":
        prefix = "视频"
    else:
        prefix = "其他"
    return f"{prefix}：{date_str}：{title}.md"


def save_raw(fname, content):
    filepath = OUTPUT_DIR / fname
    if filepath.exists(): return False
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    return True


def main():
    print("=" * 60)
    print(f"  {BLOGGER_NAME} B站充电内容抓取 v3")
    print("=" * 60)

    session = build_session()
    r = session.get("https://api.bilibili.com/x/web-interface/nav", timeout=10)
    nav = r.json()
    uname = nav.get("data", {}).get("uname", "")
    if not nav.get("data", {}).get("isLogin", False):
        print(f"[FAIL] 登录失败: {nav.get('message', '账号未登录')}")
        return
    print(f"[OK] 已登录: {uname}")

    from_str = None
    force = False
    args = sys.argv[1:]
    i = 0
    while i < len(args):
        if args[i] == "--from" and i + 1 < len(args):
            from_str = args[i + 1]; i += 2
        elif args[i] == "--force":
            force = True; i += 1
        elif args[i] == "--comments":
            i += 1
        else:
            i += 1

    to_date = datetime.now(CST).date()
    if from_str:
        from_date = datetime.strptime(from_str, "%Y-%m-%d").date()
    else:
        from_date = to_date - timedelta(days=2)

    print(f"[*] 日期: {from_date} ~ {to_date}")

    items = fetch_list(session, from_date, to_date)
    if not items:
        print("  无新内容")
        return
    print(f"  [L1] 列表完成: {len(items)} 条")

    opus_items = [it for it in items if it["jump_opus_id"]]
    print(f"\n  Step 2: opus页面获取完整正文 ({len(opus_items)} 条)")
    saved_count = 0; skipped = 0
    for idx, info in enumerate(opus_items):
        pub_dt = datetime.fromtimestamp(info["pub_ts"], tz=CST)
        dt_str = pub_dt.strftime("%m-%d %H:%M")
        title = info["title"] or "无标题"
        print(f"  [{idx+1}/{len(opus_items)}] [{dt_str}] [{info['major_type']}] {title[:30]}...", end="", flush=True)
        full = fetch_opus_detail(session, info["jump_opus_id"])
        if full:
            info["full_text"] = full
            extra = f", +{len(full)}" if len(info['preview']) < len(full) else ""
            is_html = bool(re.search(r'<\w+', full))
            text_type = "富文本" if is_html else "纯文本"
            print(f" OK ({text_type}{extra})")
        else:
            info["full_text"] = info["preview"]
            print(f" FALLBACK ({len(info['preview'])}字)")
        time.sleep(0.5)

    for info in items:
        if not info["jump_opus_id"]:
            info["full_text"] = info["preview"]

    print()
    for info in items:
        fname = make_filename(info)
        pub_dt = datetime.fromtimestamp(info["pub_ts"], tz=CST)
        title = info["title"] or "无标题"
        dy_id = info["dy_id"]
        ft = info["full_text"]
        content = f"# {pub_dt.strftime('%Y-%m-%d')} {title[:20]}\n\n> {title}\n\n{ft}\n\n---\n*来源: B站 {BLOGGER_NAME} 充电专属内容 | 动态ID: {dy_id}*"
        if force or not (OUTPUT_DIR / fname).exists():
            if save_raw(fname, content):
                print(f"  [SAVE] {fname} ({len(ft)}字)")
                saved_count += 1
            else:
                skipped += 1
        else:
            skipped += 1

    print(f"\n[完成] 新保存 {saved_count} 篇, 跳过 {skipped} 篇 (已存在)")

if __name__ == "__main__":
    main()
