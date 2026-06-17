#!/usr/bin/env python3
"""
抓取清枫 B站 动态下的评论区 —— 只保留清枫本人的评论和清枫回复过的评论
去重方式：评论区整个重建，不用担心重复追加

用法:
    python fetch_comments.py                    # 处理最近2天的动态（默认）
    python fetch_comments.py --days 3           # 指定天数
    python fetch_comments.py --all              # 处理全部
"""

import os
import re
import json
import time
import hashlib
import urllib.parse
import requests
from pathlib import Path
from datetime import datetime, timezone, timedelta

# ============================================================
BLOGGER_MID = "1420210197"
BLOGGER_NAME = "青枫浦上Q"
SCRIPT_DIR = Path(__file__).resolve().parent
RAW_DIR = SCRIPT_DIR.parent / "Raw"

FULL_COOKIE = (
    "enable_web_push=DISABLE; "
    "enable_feed_channel=ENABLE; "
    "buvid_fp=8e5df3c36755fe4503e374bd8c41f2a2; "
    "header_theme_version=OPEN; "
    "theme-tip-show=SHOWED; "
    "theme-avatar-tip-show=SHOWED; "
    "CURRENT_QUALITY=0; "
    "DedeUserID=1946575; "
    "DedeUserID__ckMd5=48bf96f4ad2edc18; "
    "buvid3=538AAE58-0AE6-B74C-6D0D-55EF7963C90949209infoc; "
    "b_nut=1755951549; "
    "_uuid=F310E5691-910D8-9322-DA96-C45DC2C8DED249248infoc; "
    "buvid4=AF6EA88B-3538-7A5A-AE17-B3D6E60D29D300732-024082307-eOG0/tQF1hv9igYzmzfbag%3D%3D; "
    "hit-dyn-v2=1; "
    "rpdid=|(umu)YJkmYR0J'u~l)ml~lkR; "
    "LIVE_BUVID=AUTO9217606232442323; "
    "PVID=1; "
    "home_feed_column=5; "
    "SESSDATA=afbd4f08%2C1797083348%2C61d70%2A62CjCIcGUdtCjkeS-YkstqSXFm"
    "tJ0ln35QGIUYSC1Py6HnsQL4DUKNAuf2DqzF9DsPKCoSVnhzNTJkOUFWM0ZEeTZhSzZRZm"
    "d1TjBmNDZQTl94SlMxajJORjNtWlVPZExEZUpYdUk5Z2FMWXVfemNySTBRTFc4VlE4S2p"
    "LR25ZR1ZmN0JUMEp2aGh3IIEC; "
    "bili_jct=3b0df5d2331aa2f84a7fd8b8e3b199f8; "
    "bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9."
    "eyJleHAiOjE3ODE2MTU0NDYsImlhdCI6MTc4MTM1NjE4NiwicGx0IjotMX0."
    "7lkrW7NoNRslqq8StAFQ91-su_1gpMPuhW7FJL-7IGc; "
    "bili_ticket_expires=1781615386; "
    "bp_t_offset_1946575=1213956065079590912; "
    "CURRENT_FNVAL=2000; "
    "sid=fv1vc0hg; "
    "browser_resolution=1997-1316; "
    "b_lsid=F5F06846_19ECB8B07CE"
)

REPLY_MAIN_API = "https://api.bilibili.com/x/v2/reply/wbi/main"
REPLY_SUB_API = "https://api.bilibili.com/x/v2/reply/reply"
OPUS_URL = "https://www.bilibili.com/opus"
CST = timezone(timedelta(hours=8))

MIXIN_KEY_ENC_TAB = [
    46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35,
    27, 43, 5, 49, 33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13,
    37, 48, 7, 16, 24, 55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4,
    22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34, 44, 52,
]

# 风控保护：每次API调用间隔（秒）
API_DELAY = 1.5
# 文件之间间隔（秒）
FILE_DELAY = 3.0
# 每次运行最多处理的文件数
MAX_FILES = 10

_wbi_keys = None


def build_session():
    s = requests.Session()
    for item in FULL_COOKIE.split("; "):
        if "=" in item:
            k, _, v = item.partition("=")
            if k and v:
                s.cookies.set(k.strip(), v.strip(), domain=".bilibili.com")
    s.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml,application/json,*/*",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Referer": f"https://space.bilibili.com/{BLOGGER_MID}/dynamic",
    })
    return s


def get_wbi_keys(session):
    global _wbi_keys
    if _wbi_keys:
        return _wbi_keys
    resp = session.get("https://api.bilibili.com/x/web-interface/nav", timeout=15)
    data = resp.json().get("data", {})
    wbi = data.get("wbi_img", {})
    img = wbi.get("img_url", "")
    sub = wbi.get("sub_url", "")
    if not img or not sub:
        _wbi_keys = ("7cd084941338484aae1ad9425b840f56", "4932c24c6d8e4dfe9a5c8e3c3d5e9f12")
        return _wbi_keys
    img_key = img.rsplit("/", 1)[-1].split(".")[0]
    sub_key = sub.rsplit("/", 1)[-1].split(".")[0]
    _wbi_keys = (img_key, sub_key)
    return _wbi_keys


def wbi_sign(session, params: dict) -> dict:
    img_key, sub_key = get_wbi_keys(session)
    mixed = img_key + sub_key
    mixed_key = [ord(mixed[i]) for i in MIXIN_KEY_ENC_TAB if i < len(mixed)]
    params["wts"] = int(time.time())
    sorted_items = sorted(params.items())
    query_str = urllib.parse.urlencode(sorted_items)
    sign_str = query_str + "".join(chr(c) for c in mixed_key[:32])
    params["w_rid"] = hashlib.md5(sign_str.encode()).hexdigest()
    return params


def api_get(session, url: str, params: dict, timeout: int = 15) -> dict:
    params = wbi_sign(session, params)
    resp = session.get(url, params=params, timeout=timeout)
    if resp.status_code != 200:
        return {"code": -1, "message": f"HTTP {resp.status_code}"}
    try:
        return resp.json()
    except:
        return {"code": -1, "message": "JSON parse error"}


def get_rid_str(session, dynamic_id: str) -> str | None:
    try:
        resp = session.get(f"{OPUS_URL}/{dynamic_id}", timeout=15)
        if resp.status_code != 200:
            return None
        match = re.search(
            r'window\.__INITIAL_STATE__\s*=\s*(\{.*?\});\s*\(function',
            resp.text, re.DOTALL
        )
        if not match:
            return None
        state = json.loads(match.group(1))
        basic = state.get("detail", {}).get("basic", {})
        return basic.get("rid_str") or basic.get("comment_id_str")
    except Exception:
        return None


def extract_dynamic_id(filepath: Path) -> str | None:
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            text = f.read()
        m = re.search(r'动态ID:\s*(\d+)', text)
        return m.group(1) if m else None
    except:
        return None


def fetch_main_comments(session, rid_str: str) -> list[dict]:
    all_comments = []
    page = 0
    while page < 10:
        page += 1
        data = api_get(session, REPLY_MAIN_API, {
            "type": 11, "oid": rid_str, "mode": 3, "pn": page, "ps": 20,
        })
        if data.get("code") != 0:
            break
        replies = data.get("data", {}).get("replies", [])
        if not replies:
            break
        for r in replies:
            all_comments.append({
                "rpid": r["rpid"],
                "mid": str(r["mid"]),
                "uname": r["member"]["uname"],
                "content": r["content"]["message"],
                "ctime": r["ctime"],
                "rcount": r.get("rcount", 0),
                "like": r.get("like", 0),
            })
        time.sleep(API_DELAY)
        if len(replies) < 20:
            break
    return all_comments


def fetch_sub_replies(session, rid_str: str, root_rpid: int) -> list[dict]:
    all_replies = []
    page = 0
    while page < 5:
        page += 1
        data = api_get(session, REPLY_SUB_API, {
            "type": 11, "oid": rid_str, "root": root_rpid, "pn": page, "ps": 20,
        })
        if data.get("code") != 0:
            break
        replies = data.get("data", {}).get("replies", [])
        if not replies:
            break
        for r in replies:
            all_replies.append({
                "rpid": r["rpid"],
                "mid": str(r["mid"]),
                "uname": r["member"]["uname"],
                "content": r["content"]["message"],
                "ctime": r["ctime"],
            })
        time.sleep(API_DELAY)
        if len(replies) < 20:
            break
    return all_replies


def filter_blogger_related(comments, session, rid_str: str) -> list[dict]:
    result = []
    seen = set()

    for c in comments:
        # 清枫本人的一级评论
        if c["mid"] == BLOGGER_MID:
            key = str(c["rpid"])
            if key not in seen:
                seen.add(key)
                result.append({
                    "type": "清枫评论",
                    "uname": c["uname"],
                    "content": c["content"],
                    "ctime": c["ctime"],
                    "rpid": c["rpid"],
                    "like": c["like"],
                })
            continue

        # 清枫回复过的评论
        if c["rcount"] > 0:
            sub_replies = fetch_sub_replies(session, rid_str, c["rpid"])
            for sr in sub_replies:
                if sr["mid"] == BLOGGER_MID:
                    key = f"{c['rpid']}_{sr['rpid']}"
                    if key not in seen:
                        seen.add(key)
                        result.append({
                            "type": "清枫回复",
                            "uname": c["uname"],
                            "content": c["content"],
                            "ctime": c["ctime"],
                            "rpid": c["rpid"],
                            "reply_uname": sr["uname"],
                            "reply_content": sr["content"],
                            "reply_ctime": sr["ctime"],
                            "reply_rpid": sr["rpid"],
                        })
                    break

    return result


def format_comment_md(comment: dict) -> str:
    dt = datetime.fromtimestamp(comment["ctime"], tz=CST).strftime("%m-%d %H:%M")
    if comment["type"] == "清枫评论":
        return f"### 🗣️ 清枫 {dt}\n\n> {comment['content']}\n"
    reply_dt = datetime.fromtimestamp(comment["reply_ctime"], tz=CST).strftime("%m-%d %H:%M")
    return (
        f"### 💬 粉丝问 · 清枫答 {reply_dt}\n\n"
        f"**粉丝（{comment['uname']} {dt}）**：{comment['content']}\n\n"
        f"**清枫回复**：{comment['reply_content']}\n"
    )


def process_file(session, filepath: Path) -> int:
    dynamic_id = extract_dynamic_id(filepath)
    if not dynamic_id:
        return 0

    label = filepath.stem[:45]
    print(f"  [{label}...]", end=" ", flush=True)

    rid_str = get_rid_str(session, dynamic_id)
    if not rid_str:
        rid_str = dynamic_id

    comments = fetch_main_comments(session, rid_str)
    if not comments:
        print(f"无评论")
        return 0

    related = filter_blogger_related(comments, session, rid_str)
    if not related:
        print(f"无清枫相关评论")
        return 0

    # 去重（同一会话内）
    unique = {}
    for item in related:
        key = str(item["rpid"])
        if item.get("reply_rpid"):
            key += f"_{item['reply_rpid']}"
        unique[key] = item

    # 读取文件，移除旧评论区，重建
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # 删除旧的评论区段落
    comment_start = content.find("\n## 评论区\n")
    if comment_start != -1:
        marker_after = content.find("<!-- synced_comments:", comment_start)
        if marker_after > 0:
            content = content[:comment_start] + content[marker_after:]
        else:
            content = content[:comment_start]

    # 删除旧的 synced marker（在任何位置）
    content = re.sub(r'\n*<!-- synced_comments:.*?-->\n*', '\n', content)

    # 生成评论 MD
    md_parts = [format_comment_md(item) for item in unique.values()]
    comment_ids = sorted(set(
        [str(item["rpid"]) for item in unique.values()] +
        [str(item["reply_rpid"]) for item in unique.values() if item.get("reply_rpid")]
    ), key=int)

    marker_line = f"<!-- synced_comments: {' '.join(comment_ids)} -->"

    if md_parts:
        new_content = content.rstrip() + "\n\n---\n\n## 评论区\n\n" + "\n---\n\n".join(md_parts) + "\n\n" + marker_line + "\n"
    else:
        new_content = content.rstrip() + "\n\n" + marker_line + "\n"

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"{len(unique)} 条评论")
    for item in unique.values():
        dt = datetime.fromtimestamp(item["ctime"], tz=CST).strftime("%m-%d %H:%M")
        preview = item["content"][:60].replace("\n", " ")
        print(f"    [{item['type']}] {dt} | {preview}...")

    return len(unique)


def main():
    import sys
    days = 2
    process_all = False

    args = sys.argv[1:]
    i = 0
    while i < len(args):
        if args[i] == "--days" and i + 1 < len(args):
            days = int(args[i + 1])
            i += 2
        elif args[i] == "--all":
            process_all = True
            i += 1
        else:
            i += 1

    print("=" * 60)
    print(f"  {BLOGGER_NAME} B站评论区抓取 v4")
    print(f"  API间隔: {API_DELAY}s | 文件间隔: {FILE_DELAY}s | 最多: {MAX_FILES}个文件")
    print("=" * 60)

    session = build_session()

    try:
        nav = session.get("https://api.bilibili.com/x/web-interface/nav", timeout=10).json()
        if nav["code"] != 0:
            print(f"[FAIL] 登录失败: {nav.get('message', '未知')}")
            return
        print(f"[OK] 已登录: {nav['data']['uname']}")
    except Exception as e:
        print(f"[FAIL] 网络异常: {e}")
        return

    get_wbi_keys(session)

    md_files = sorted(RAW_DIR.glob("*.md"), key=os.path.getmtime, reverse=True)

    if not process_all:
        cutoff = datetime.now(CST) - timedelta(days=days)
        md_files = [f for f in md_files
                    if datetime.fromtimestamp(os.path.getmtime(f), tz=CST) >= cutoff]

    # 限制每次处理数量
    if len(md_files) > MAX_FILES:
        print(f"\n文件过多({len(md_files)}个)，只处理最近 {MAX_FILES} 个")
        md_files = md_files[:MAX_FILES]

    desc = "全部" if process_all else f"最近 {days} 天"
    print(f"\n处理 {len(md_files)} 个文件（{desc}）\n")

    total_new = 0
    files_with_new = 0

    for filepath in md_files:
        try:
            n = process_file(session, filepath)
            if n > 0:
                total_new += n
                files_with_new += 1
        except Exception as e:
            print(f"  [ERR] {type(e).__name__}: {e}")
        time.sleep(FILE_DELAY)

    print(f"\n[完成] {files_with_new} 个文件新增 {total_new} 条评论")


if __name__ == "__main__":
    main()
