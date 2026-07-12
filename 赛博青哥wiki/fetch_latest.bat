@echo off
chcp 65001 >nul
cd /d "D:\OneDrive\Private\个人知识库\赛博青哥wiki"
python 财经\scriptsetch_blogger.py
python 财经\scriptsetch_comments.py --days 2
echo Done.
pause
