"""测试脚本：验证 B站详情 API 是否能获取完整正文"""
import requests
import json
import time
from datetime import datetime, timezone, timedelta

CST = timezone(timedelta(hours=8))

FULL_COOKIE = (
    "buvid3=7B36AD4F-0560-79FB-094D-9E06CF0E002524709infoc; "
    "b_nut=1778164324; "
    "_uuid=F110EB3BD-79DD-6C84-7DCC-1759FE10EE4C323877infoc; "
    "buvid_fp=b95a1b4c253f2a3554a2dd4133b95595; "
    "buvid4=149C3D4A-88F3-EBD8-1CCE-F3CC3B52040826257-026050722-BOuc+wvORwUICZlG0OQidA%3D%3D; "
    "rpdid=|(k~Rkmkm~~)0J'u~~)l|lR)J; "
    "DedeUserID=394017627; "
    "DedeUserID__ckMd5=108d937a6940cb3d; "
    "bili_jct=7fd2089d1f79660d69b2de2fcf61410f; "
    "sid=7t8j56qr; "
    "b_lsid=ED05D6FB_19E81B5670C; "
    "bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9."
    "eyJleHAiOjE3ODA1MzQxNjEsImlhdCI6MTc4MDI3NDkwMSwicGx0IjotMX0."
    "GODIr77Gqg6Jkmu91MD5z_1b7de33YZucAhO_l6iPhM; "
    "bili_ticket_expires=1780534101; "
    "SESSDATA=8fc22bdd%2C1795826963%2Cc0dea%2A61CjBLmcrvuCoOLMP9nSzP6Z"
    "XIejwY5ex2lpLbmVwkANmZ8m4UVB5VOMHEGra1Jxk9t2ISVmxXV3ZJM2tJYjFpTjU1N2"
    "xDRkp2TmFLWHdrcVZ5WW4wX2gyUGY0d09OTk4xcmFJQm9rT0hZN195anBrYnJmWGxpaF"
    "dDaG9kNXVvVHNwODNCVlZ3dmdBIIEC; "
    "CURRENT_QUALITY=120; "
    "CURRENT_FNVAL=4048; "
    "hit-dyn-v2=1; "
    "home_feed_column=5; "
    "browser_resolution=1432-734; "
    "bp_t_offset_394017627=1207404131124248576; "
    "__at_once=16441723693632697656"
)

BLOGGER_MID = "1420210197"
SPACE_DYNAMIC_API = "https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space"
DYNAMIC_DETAIL_API = "https://api.bilibili.com/x/polymer/web-dynamic/v1/detail"


def build_session():
    s = requests.Session()
    for item in FULL_COOKIE.split("; "):
        if "=" in item:
            key, _, value = item.partition("=")
            if key and value:
                s.cookies.set(key.strip(), value.strip(), domain=".bilibili.com")
    s.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Origin": "https://space.bilibili.com",
        "Referer": f"https://space.bilibili.com/{BLOGGER_MID}/dynamic",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
    })
    return s


def extract_text_from_opus(opus):
    """从 OPUS 提取文本，优先使用 paragraphs（完整正文）"""
    parts = []

    title = opus.get("title", "")
    if title:
        parts.append(title)

    # 优先：paragraphs（详情 API 返回完整正文在这里）
    paragraphs = opus.get("paragraphs", [])
    if paragraphs:
        for p in paragraphs:
            para_text = p.get("text", "")
            if para_text:
                parts.append(para_text)
            # 也检查 content 列表（富文本）
            content_list = p.get("content", [])
            if isinstance(content_list, list):
                for node in content_list:
                    if isinstance(node, dict):
                        node_text = node.get("text", "")
                        if node_text:
                            parts[-1] = parts[-1] + node_text if parts else node_text

    # 兜底：summary
    if not parts or all(len(p) < 100 for p in parts[1:]):
        summary = opus.get("summary", {})
        if isinstance(summary, dict):
            s_text = summary.get("text", "")
            if s_text:
                if parts:
                    parts.append(s_text)
                else:
                    parts.append(s_text)

    return "\n\n".join(parts) if parts else ""


def get_first_two_dynamics(session):
    """获取最近2条动态的ID"""
    resp = session.get(SPACE_DYNAMIC_API, params={
        "host_mid": BLOGGER_MID,
        "features": "itemOpusStyle",
    })
    data = resp.json()
    if data["code"] != 0:
        print(f"列表API失败: {data}")
        return []

    items = data["data"]["items"][:2]
    result = []
    for item in items:
        modules = item["modules"]
        author = modules["module_author"]
        dynamic = modules["module_dynamic"]
        major = dynamic["major"]

        dy_id = item["id_str"]
        pub_ts = int(author.get("pub_ts", 0))
        major_type = major.get("type", "")

        # 列表版本文本
        list_text = ""
        if major_type == "MAJOR_TYPE_OPUS":
            opus = major["opus"]
            summary = opus.get("summary", {})
            list_text = summary.get("text", "") if isinstance(summary, dict) else str(summary)
            title = opus.get("title", "")
            # 检查 paragraphs
            p_count = len(opus.get("paragraphs", []))
        else:
            title = major.get(major_type.lower().replace("major_type_", ""), {}).get("title", "")
            p_count = 0

        result.append({
            "dynamic_id": dy_id,
            "pub_ts": pub_ts,
            "major_type": major_type,
            "title": title,
            "list_text_preview": list_text[:200],
            "list_text_len": len(list_text),
            "list_paragraphs": p_count,
        })

    return result


def fetch_detail(session, dy_id):
    """获取单条动态的完整详情"""
    resp = session.get(DYNAMIC_DETAIL_API, params={
        "timezone_offset": "-480",
        "id": dy_id,
        "features": "itemOpusStyle",
    })
    data = resp.json()
    if data["code"] != 0:
        return None

    item = data["data"]["item"]
    modules = item["modules"]
    dynamic = modules["module_dynamic"]
    major = dynamic["major"]

    if major["type"] == "MAJOR_TYPE_OPUS":
        opus = major["opus"]
        full_text = extract_text_from_opus(opus)
        p_count = len(opus.get("paragraphs", []))

        # 对比 summary 和 paragraphs
        summary = opus.get("summary", {})
        summary_text = summary.get("text", "") if isinstance(summary, dict) else ""

        return {
            "full_text": full_text,
            "full_len": len(full_text),
            "summary_len": len(summary_text),
            "paragraphs_count": p_count,
            "first_300_full": full_text[:300],
            "last_200_full": full_text[-200:] if len(full_text) > 200 else "",
        }
    else:
        return {
            "full_text": f"[类型: {major['type']}]",
            "full_len": 0,
            "summary_len": 0,
            "paragraphs_count": 0,
        }


def main():
    print("=" * 60)
    print("  测试: 验证 B站详情 API 完整正文获取")
    print("=" * 60)

    session = build_session()

    # 验证登录
    nav = session.get("https://api.bilibili.com/x/web-interface/nav").json()
    if nav["code"] != 0:
        print(f"登录失败: {nav}")
        return
    print(f"[OK] 已登录: {nav['data']['uname']}")

    # Step 1: 获取最近2条
    print("\n--- Step 1: 列表 API 获取最近2条 ---")
    items = get_first_two_dynamics(session)

    if not items:
        print("未获取到动态")
        return

    for i, item in enumerate(items):
        dt = datetime.fromtimestamp(item["pub_ts"], tz=CST).strftime("%Y-%m-%d %H:%M")
        print(f"\n动态 #{i+1}: {item['dynamic_id']}")
        print(f"  时间: {dt}")
        print(f"  类型: {item['major_type']}")
        print(f"  标题: {item['title'][:60]}")
        print(f"  列表版本文本长度: {item['list_text_len']} 字")
        print(f"  列表 paragraphs 数: {item['list_paragraphs']}")
        print(f"  列表预览: {item['list_text_preview'][:100]}...")

    # Step 2: 详情 API
    print("\n--- Step 2: 详情 API 获取完整正文 ---")

    for i, item in enumerate(items):
        dy_id = item["dynamic_id"]
        print(f"\n{'='*40}")
        print(f"详情 #{i+1}: {dy_id}")

        detail = fetch_detail(session, dy_id)
        if detail is None:
            print("  [FAIL] 详情获取失败")
            continue

        print(f"  paragraphs 数: {detail['paragraphs_count']}")
        print(f"  summary 长度: {detail['summary_len']} 字")
        print(f"  完整正文长度: {detail['full_len']} 字")

        if detail['full_len'] > detail['summary_len']:
            gain = detail['full_len'] - detail['summary_len']
            pct = gain / detail['summary_len'] * 100 if detail['summary_len'] else 0
            print(f"  >>> 详情比列表多 {gain} 字 (+{pct:.0f}%)")

        print(f"\n  正文开头: {detail['first_300_full']}...")
        if detail['last_200_full']:
            print(f"\n  正文结尾: ...{detail['last_200_full']}")

        time.sleep(0.5)

    print(f"\n{'=' * 60}")
    print("  测试完成")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
