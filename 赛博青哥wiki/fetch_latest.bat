@echo off
chcp 65001 >nul
cd /d D:\OneDrive\Private\个人知识库\赛博青哥wiki
echo ========================================
echo   1/2 拉取最新动态
echo ========================================
python 财经/scripts/fetch_blogger.py
echo.
echo ========================================
echo   2/2 拉取评论区
echo ========================================
python 财经/scripts/fetch_comments.py --days 2
echo.
echo [完成]
pause
