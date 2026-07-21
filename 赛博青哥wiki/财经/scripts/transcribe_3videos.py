#!/usr/bin/env python3
"""
一键转录清枫最新三篇视频（07-16 ~ 07-19）
用法: python transcribe_3videos.py

前置: pip install faster-whisper yt-dlp
     ffmpeg 已安装
"""
import os, sys, re, json, time, subprocess, shutil
from pathlib import Path
from datetime import datetime, timezone, timedelta

CST = timezone(timedelta(hours=8))
SCRIPT_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = SCRIPT_DIR / "Raw"
AUDIO_DIR = SCRIPT_DIR / "data_cache" / "audio_cache"
MODEL = "small"   # tiny/base/small/medium/large

os.makedirs(AUDIO_DIR, exist_ok=True)

FULL_COOKIE = (
    "buvid3=2C3921C2-7C6F-AD2F-77A1-689DD9A88CCA46237infoc; "
    "buvid4=9DD11754-3E3B-448F-B2E7-4C254F56A74146857-026062222-zP59jf59IXTYj3xO8d0X8Q%3D%3D; "
    "buvid_fp=5bc48ab86ba91f23303f81ad53ce4afb; "
    "_uuid=D1BF655E-1C95-DCB8-1C32-AFE686A510A3346191infoc; "
    "b_nut=1782138646; "
    "SESSDATA=2bc6b4cc%2C1797690690%2Ce2ac2%2A61CjCMDSpMkz1Rzq70aEDLxzoBo5fizPFT1SmxPzHB91kxVwQVvV1EpSp1HpUe-XmYo-sSVjV2cVFMVUotR3NQQlRETmdkMlI4T0tyX29Od1YtejhVdzBjbG9IYWVhMF9ZSGpkS3NnZDJiYmpVbjFEa2pKRC1lbUl5NXdSQUFFZlJ1NjR0VmRvYmdRIIEC; "
    "bili_jct=762edfe29f50dc7153a9f695db98df5b; "
    "DedeUserID=1946575; "
    "sid=7axln5ii; "
    "CURRENT_FNVAL=2000"
)

VIDEOS = [
    ("BV14vK56TEQ8", "26-07-16", "那只是糟糕的一天，不是糟糕的一生。"),
    ("BV1BnKr6aE67", "26-07-19", "风未停雨未歇（周复盘）"),
    ("BV1c2Kv6nEzw", "26-07-19", "强趋势股交易（1）"),
]

def check_deps():
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        print("❌ 找不到 ffmpeg，请先安装: brew install ffmpeg")
        return False
    print(f"✅ ffmpeg: {ffmpeg}")
    try:
        from faster_whisper import WhisperModel
        print("✅ faster-whisper")
        return True
    except ImportError:
        print("❌ faster-whisper 未安装，运行: pip install faster-whisper")
        return False

def download(bvid, title):
    url = f"https://www.bilibili.com/video/{bvid}"
    out = AUDIO_DIR / f"{bvid}.wav"
    if out.exists():
        mb = out.stat().st_size / 1024 / 1024
        print(f"  ⏭ 已存在 ({mb:.0f}MB)")
        return out

    cookies_file = AUDIO_DIR / "cookies.txt"
    with open(cookies_file, "w") as f:
        f.write("# Netscape HTTP Cookie File\n\n")
        for item in FULL_COOKIE.split("; "):
            if "=" in item:
                k, _, v = item.partition("=")
                f.write(f".bilibili.com\tTRUE\t/\tFALSE\t1795826963\t{k}\t{v}\n")

    print(f"  ⏳ 下载中...", end=" ", flush=True)
    result = subprocess.run([
        sys.executable, "-m", "yt_dlp", url,
        "-x", "--audio-format", "wav", "--audio-quality", "0",
        "-o", str(out), "--cookies", str(cookies_file),
        "--no-playlist", "--extractor-retries", "3", "--retries", "3",
    ], capture_output=True, text=True, timeout=600)
    if result.returncode != 0:
        print(f"❌\n{result.stderr[-300:]}")
        return None
    mb = out.stat().st_size / 1024 / 1024
    print(f"✅ {mb:.0f}MB")
    return out

def transcribe(bvid, audio_path):
    from faster_whisper import WhisperModel
    model = WhisperModel(MODEL, device="cpu", compute_type="int8")
    print(f"  ⏳ 转录中...", end=" ", flush=True)
    segments, info = model.transcribe(str(audio_path), language="zh", beam_size=5, vad_filter=True)
    text = ""
    for seg in segments:
        m, s = divmod(int(seg.start), 60)
        text += f"[{m:02d}:{s:02d}] {seg.text.strip()}\n"
    print(f"✅ {len(text)} 字")
    return text

def save(bvid, date_str, title, transcript):
    safe = re.sub(r'[<>"/\\|?*:]', '', title)[:50]
    fname = OUTPUT_DIR / f"视频：{date_str}：{safe}（转录）.md"
    if fname.exists():
        print(f"  ⏭ 已存在")
        return True
    content = f"# {date_str} 视频转录\n\n> {title}\n\n## 完整转录\n\n{transcript}\n\n---\n*BV: {bvid}*"
    with open(fname, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  💾 {fname.name}")
    return True

def main():
    print("=" * 55)
    print("  清枫视频转录工具")
    print("=" * 55)
    if not check_deps():
        sys.exit(1)

    for bvid, date_str, title in VIDEOS:
        fname = f"视频：{date_str}：{title[:30]}（转录）.md"
        if (OUTPUT_DIR / fname).exists():
            print(f"\n[{bvid}] {title} → 已转录，跳过")
            continue
        print(f"\n{'─'*50}")
        print(f"[{bvid}] {title}")
        audio = download(bvid, title)
        if not audio:
            continue
        text = transcribe(bvid, audio)
        if text:
            save(bvid, date_str, title, text)

    print(f"\n{'='*55}")
    print("  完成！转录文件保存在 Raw/ 目录")
    print(f"{'='*55}")

if __name__ == "__main__":
    main()
