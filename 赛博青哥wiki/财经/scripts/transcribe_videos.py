#!/usr/bin/env python3
"""
B站视频转录工具
下载博主充电视频 → 提取音频 → whisper 语音转文字 → 生成 markdown

用法:
    python transcribe_videos.py                    # 转录全部视频
    python transcribe_videos.py --dry-run           # 仅列出视频，不转录
    python transcribe_videos.py --id 123456789      # 只转录指定动态ID

前置条件:
    pip install faster-whisper yt-dlp
    ffmpeg 已安装并加入 PATH

首次运行会自动下载 whisper 模型 (~1.5GB small 模型)
"""

import os
import sys
import json
import re
import time
import subprocess
import tempfile
import shutil
from pathlib import Path
from datetime import datetime, timezone, timedelta

# ============================================================
# 配置
# ============================================================
BLOGGER_MID = "1420210197"
BLOGGER_NAME = "青枫浦上Q"
SCRIPT_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = SCRIPT_DIR.parent / "Raw"
# 项目本地目录（模型 + 音频缓存）
PROJECT_DATA_DIR = SCRIPT_DIR.parent / "data_cache"
WHISPER_MODEL_DIR = PROJECT_DATA_DIR / "whisper_models"
AUDIO_DIR = PROJECT_DATA_DIR / "audio_cache"

# 确保目录存在
WHISPER_MODEL_DIR.mkdir(parents=True, exist_ok=True)
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

# 设置 faster-whisper 从本地读模型
os.environ["HF_HOME"] = str(WHISPER_MODEL_DIR)
os.environ["XDG_CACHE_HOME"] = str(PROJECT_DATA_DIR)

# Cookie (用于下载充电视频)
FULL_COOKIE = (
    "buvid3=2C3921C2-7C6F-AD2F-77A1-689DD9A88CCA46237infoc; "
    "buvid4=9DD11754-3E3B-448F-B2E7-4C254F56A74146857-026062222-"
    "zP59jf59IXTYj3xO8d0X8Q%3D%3D; "
    "buvid_fp=5bc48ab86ba91f23303f81ad53ce4afb; "
    "_uuid=D1BF655E-1C95-DCB8-1C32-AFE686A510A3346191infoc; "
    "b_nut=1782138646; "
    "home_feed_column=4; "
    "browser_resolution=907-769; "
    "SESSDATA=2bc6b4cc%2C1797690690%2Ce2ac2%2A61CjCMDSpMkz1Rzq70a"
    "EDLxzoBo5fizPFT1SmxPzHB91kxVwQVvV1EpSp1HpUe-XmYo-sSVjV2cVFMV"
    "UotR3NQQlRETmdkMlI4T0tyX29Od1YtejhVdzBjbG9IYWVhMF9ZSGpkS3Nn"
    "ZDJiYmpVbjFEa2pKRC1lbUl5NXdSQUFFZlJ1NjR0VmRvYmdRIIEC; "
    "bili_jct=762edfe29f50dc7153a9f695db98df5b; "
    "DedeUserID=1946575; "
    "DedeUserID__ckMd5=48bf96f4ad2edc18; "
    "sid=7axln5ii; "
    "CURRENT_FNVAL=2000; "
    "CURRENT_QUALITY=0; "
    "theme-tip-show=SHOWED; "
    "theme-avatar-tip-show=SHOWED; "
    "hit-dyn-v2=1; "
    "bsource=search_bing; "
    "rpdid=|(umu)YYY)|u0J'u~)kkkYu)u; "
    "b_lsid=2114181A_19F7AB04FA6"
)

# Whisper 模型: tiny / base / small / medium / large
# small: 1.5GB, 速度快, 中文准确度高, 推荐
# medium: 3GB, 更准确但更慢
WHISPER_MODEL = "small"

# 是否保留临时音频文件 (调试用)
KEEP_AUDIO = False

CST = timezone(timedelta(hours=8))

# ============================================================
# 工具函数
# ============================================================

def find_ffmpeg():
    """自动查找 ffmpeg"""
    # 1. 检查 PATH
    path = shutil.which("ffmpeg")
    if path: return path

    # 2. winget 安装位置
    import glob as g
    base = os.path.expandvars(r"%LOCALAPPDATA%\Microsoft\WinGet\Packages")
    for pattern in [
        rf"{base}\Gyan.FFmpeg_*\*\bin\ffmpeg.exe",
        rf"{base}\Gyan.FFmpeg_*\ffmpeg.exe",
    ]:
        for match in g.glob(pattern):
            if os.path.exists(match):
                return match

    # 3. 常见位置
    for candidate in [
        r"C:\ffmpeg\bin\ffmpeg.exe",
        r"C:\Program Files\ffmpeg\bin\ffmpeg.exe",
    ]:
        if os.path.exists(candidate):
            return candidate

    return None


def check_dependencies():
    """检查 ffmpeg 和 faster-whisper 是否可用"""
    ffmpeg_path = find_ffmpeg()
    if not ffmpeg_path:
        print("[FAIL] 找不到 ffmpeg!")
        print("  安装: winget install Gyan.FFmpeg 或 https://ffmpeg.org/download.html")
        return False

    # 确保 ffmpeg 所在目录在 PATH 中
    ffmpeg_dir = os.path.dirname(ffmpeg_path)
    if ffmpeg_dir not in os.environ.get("PATH", ""):
        os.environ["PATH"] = ffmpeg_dir + os.pathsep + os.environ.get("PATH", "")

    print(f"[OK] ffmpeg: {ffmpeg_path}")

    # 检查 faster-whisper
    try:
        from faster_whisper import WhisperModel
        print("[OK] faster-whisper 已安装")
        return True
    except ImportError:
        print("[FAIL] faster-whisper 未安装, 运行: pip install faster-whisper")
        return False


def get_video_list():
    """从 fetch_blogger.py 抓取结果中提取视频类型的动态 ID"""
    import requests

    s = requests.Session()
    for item in FULL_COOKIE.split("; "):
        if "=" in item:
            k, _, v = item.partition("=")
            if k and v: s.cookies.set(k.strip(), v.strip(), domain=".bilibili.com")
    s.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": f"https://space.bilibili.com/{BLOGGER_MID}/dynamic",
    })

    videos = []
    offset = ""
    page = 0

    print("正在获取视频列表...")
    while page < 30:
        page += 1
        resp = s.get(
            "https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space",
            params={"host_mid": BLOGGER_MID, "offset": offset, "features": "itemOpusStyle"},
            timeout=30
        )
        data = resp.json()
        if data["code"] != 0: break

        items = data.get("data", {}).get("items")
        if not items: break

        for item in items:
            modules = item.get("modules", {})
            major = modules.get("module_dynamic", {}).get("major")
            if not major or major.get("type") != "MAJOR_TYPE_ARCHIVE":
                continue

            archive = major.get("archive", {})
            author = modules.get("module_author", {})
            pub_ts = int(author.get("pub_ts", 0) or 0)

            videos.append({
                "dynamic_id": item.get("id_str", ""),
                "bvid": archive.get("bvid", ""),
                "title": archive.get("title", ""),
                "desc": archive.get("desc", ""),
                "duration_text": archive.get("duration_text", ""),
                "pub_ts": pub_ts,
                "cover": archive.get("cover", ""),
            })

        if not data.get("data", {}).get("has_more"): break
        offset = data["data"].get("offset", "")
        if not offset: break
        time.sleep(0.5)

    return videos


def download_audio(bvid, output_path):
    """用 yt-dlp 下载 B站视频的音频"""
    url = f"https://www.bilibili.com/video/{bvid}"

    # 写入 cookie 文件
    cookie_file = AUDIO_DIR / "cookies.txt"
    cookie_file.parent.mkdir(parents=True, exist_ok=True)
    with open(cookie_file, "w") as f:
        f.write("# Netscape HTTP Cookie File\n\n")
        for item in FULL_COOKIE.split("; "):
            if "=" in item:
                k, _, v = item.partition("=")
                f.write(f".bilibili.com\tTRUE\t/\tFALSE\t1795826963\t{k}\t{v}\n")

    # 找到 ffmpeg 路径
    ffmpeg_path = find_ffmpeg()
    ffmpeg_dir = os.path.dirname(ffmpeg_path) if ffmpeg_path else ""

    cmd = [
        "python", "-m", "yt_dlp", url,
        "-x", "--audio-format", "wav", "--audio-quality", "0",
        "-o", str(output_path),
        "--cookies", str(cookie_file),
        "--no-playlist",
        "--extractor-retries", "3", "--retries", "3",
    ]
    if ffmpeg_dir:
        cmd.extend(["--ffmpeg-location", ffmpeg_dir])

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
        if result.returncode != 0:
            print(f"    yt-dlp 错误: {result.stderr[-300:]}")
            return False
        return os.path.exists(output_path)
    except subprocess.TimeoutExpired:
        print("    下载超时")
        return False
    except Exception as e:
        print(f"    下载异常: {e}")
        return False


def transcribe_audio(audio_path, model_name="small"):
    """用 faster-whisper 将音频转为文字"""
    from faster_whisper import WhisperModel

    print(f"    加载 whisper 模型 ({model_name})...")
    # CPU 模式: device="cpu", compute_type="int8"
    # GPU 模式 (NVIDIA): device="cuda", compute_type="float16"
    device = "cuda" if _has_cuda() else "cpu"
    compute_type = "float16" if device == "cuda" else "int8"

    model = WhisperModel(model_name, device=device, compute_type=compute_type,
                         download_root=str(WHISPER_MODEL_DIR))

    print(f"    转录中 (设备: {device})...")
    segments, info = model.transcribe(
        str(audio_path),
        language="zh",
        beam_size=5,
        vad_filter=True,
    )

    print(f"    检测语言: {info.language} (概率: {info.language_probability:.2f})")

    full_text = ""
    for segment in segments:
        timestamp = f"[{segment.start:.1f}s -> {segment.end:.1f}s]"
        full_text += f"{timestamp} {segment.text.strip()}\n"

    return full_text


def _has_cuda():
    """检测是否有 NVIDIA GPU"""
    try:
        import subprocess
        result = subprocess.run(
            ["nvidia-smi"], capture_output=True, text=True, timeout=5
        )
        return result.returncode == 0
    except Exception:
        return False


def generate_summary(transcript, video_info):
    """从转录文本生成 markdown 摘要"""
    lines = []
    dt = datetime.fromtimestamp(video_info["pub_ts"], tz=CST).strftime("%Y-%m-%d") if video_info["pub_ts"] else "???"

    lines.append(f"# {dt} 视频转录")
    lines.append("")
    lines.append(f"> {video_info['title']}")
    if video_info.get("duration_text"):
        lines.append(f"> 时长: {video_info['duration_text']}")
    lines.append("")

    lines.append("## 视频简介")
    lines.append("")
    lines.append(video_info.get("desc", "(无简介)"))
    lines.append("")

    lines.append("## 完整转录")
    lines.append("")
    lines.append(transcript)
    lines.append("")
    lines.append("---")
    lines.append(f"*来源: B站 {BLOGGER_NAME} 充电视频 | BV: {video_info['bvid']}*")

    return "\n".join(lines)


def download_video(video_info):
    """仅下载视频音频，返回音频文件路径"""
    bvid = video_info["bvid"]
    title = video_info["title"]

    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    audio_path = AUDIO_DIR / f"{bvid}.wav"

    if audio_path.exists():
        size_mb = audio_path.stat().st_size / 1024 / 1024
        print(f"    已存在 ({size_mb:.0f}MB)")
        return audio_path

    print(f"    下载中...")
    if not download_audio(bvid, str(audio_path)):
        print(f"    [FAIL] 下载失败")
        return None

    size_mb = audio_path.stat().st_size / 1024 / 1024
    print(f"    [OK] {size_mb:.0f}MB")
    return audio_path


def transcribe_video(video_info, audio_path):
    """转录单个视频: 语音转文字 → 保存 markdown"""
    bvid = video_info["bvid"]
    title = video_info["title"]
    dt = datetime.fromtimestamp(video_info["pub_ts"], tz=CST).strftime("%y-%m-%d") if video_info["pub_ts"] else "??-??-??"

    # 输出文件
    safe_title = re.sub(r'[<>"|?*:/\\]', '', title)[:50]
    output_file = OUTPUT_DIR / f"视频：{dt}：{safe_title}（转录）.md"

    if output_file.exists():
        print(f"    已存在, 跳过")
        return True

    try:
        print(f"    转录中...")
        transcript = transcribe_audio(str(audio_path), WHISPER_MODEL)
        print(f"    [OK] {len(transcript)} 字")

        print(f"    生成 markdown...")
        markdown = generate_summary(transcript, video_info)

        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(markdown)

        print(f"    [SAVED] {output_file.name}")
        return True

    except Exception as e:
        print(f"    [ERROR] {e}")
        return False


def main():
    import argparse
    parser = argparse.ArgumentParser(description="B站视频转录工具 (两步法)")
    parser.add_argument("--dry-run", action="store_true", help="仅列出视频, 不下载不转录")
    parser.add_argument("--id", type=str, help="只处理指定动态ID")
    parser.add_argument("--from-date", type=str, default="2026-05-14",
                        help="起始日期 YYYY-MM-DD (默认: 2026-05-14)")
    parser.add_argument("--download-only", action="store_true", help="仅下载音频, 不转录")
    parser.add_argument("--transcribe-only", action="store_true", help="仅转录已有音频, 不下载")
    parser.add_argument("--model", type=str, default="small",
                        choices=["tiny", "base", "small", "medium", "large"],
                        help="Whisper 模型大小 (默认: small)")
    args = parser.parse_args()

    global WHISPER_MODEL
    WHISPER_MODEL = args.model

    print("=" * 60)
    print(f"  B站视频转录工具 v2 (两步法)")
    print(f"  模型: {WHISPER_MODEL}  |  设备: {'GPU' if _has_cuda() else 'CPU'}")
    print(f"  音频目录: {AUDIO_DIR}")
    print("=" * 60)

    if not check_dependencies():
        return

    # 获取视频列表
    videos = get_video_list()
    print(f"\n找到 {len(videos)} 个视频")

    # 日期过滤
    if args.from_date:
        from_ts = datetime.strptime(args.from_date, "%Y-%m-%d").replace(tzinfo=CST).timestamp()
        videos = [v for v in videos if v["pub_ts"] >= from_ts]
        print(f"过滤后 (>= {args.from_date}): {len(videos)} 个视频")

    if args.id:
        videos = [v for v in videos if v["dynamic_id"] == args.id]
        if not videos:
            print(f"未找到动态ID: {args.id}")
            return

    # 按时间排序
    videos.sort(key=lambda v: v["pub_ts"])

    # 列表展示
    print()
    for i, v in enumerate(videos):
        dt_str = datetime.fromtimestamp(v["pub_ts"], tz=CST).strftime("%Y-%m-%d") if v["pub_ts"] else "???"
        print(f"  [{i+1}] [{dt_str}] {v['title'][:50]} ({v.get('duration_text', '?')})")

    if args.dry_run:
        print(f"\n[DRY-RUN] 共 {len(videos)} 个")
        return

    # ========== Phase 1: 下载 ==========
    if not args.transcribe_only:
        print(f"\n{'=' * 50}")
        print(f"  Phase 1: 下载音频 → {AUDIO_DIR}")
        print(f"{'=' * 50}")

        for i, v in enumerate(videos):
            print(f"  [{i+1}/{len(videos)}] {v['title'][:50]}")
            v["_audio_path"] = download_video(v)
        print(f"\n  Phase 1 完成")

        if args.download_only:
            print(f"  音频已保存到 {AUDIO_DIR}")
            print(f"  之后运行: python transcribe_videos.py --transcribe-only --from-date {args.from_date}")
            return
    else:
        # transcribe-only: 从已有音频映射
        for v in videos:
            audio_path = AUDIO_DIR / f"{v['bvid']}.wav"
            if audio_path.exists():
                v["_audio_path"] = audio_path
            else:
                print(f"  [!] 缺少音频: {v['bvid']}.wav — {v['title'][:40]}")
                v["_audio_path"] = None

    # ========== Phase 2: 转录 ==========
    print(f"\n{'=' * 50}")
    print(f"  Phase 2: 语音转文字 (模型: {WHISPER_MODEL})")
    print(f"{'=' * 50}")

    success = 0
    fail = 0
    for i, v in enumerate(videos):
        print(f"\n  [{i+1}/{len(videos)}] {v['title'][:50]}")
        if v.get("_audio_path") and v["_audio_path"].exists():
            if transcribe_video(v, v["_audio_path"]):
                success += 1
            else:
                fail += 1
        else:
            print(f"    [SKIP] 无音频文件")
            fail += 1

    print(f"\n{'=' * 60}")
    print(f"  完成: 成功 {success}, 失败 {fail}")
    print(f"  音频保存在: {AUDIO_DIR}")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
