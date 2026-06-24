@echo off
chcp 65001 >nul
cd /d "%~dp0"
title SSCA思路编辑器
if not exist "node_modules\electron\dist\electron.exe" (
  echo [SSCA思路编辑器] 首次运行：正在安装运行环境（需要联网，仅此一次）...
  set "ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/"
  call npm install --registry=https://registry.npmmirror.com
  if errorlevel 1 (
    echo.
    echo 安装失败，可能是网络问题。请联网后重试，或在本目录手动执行: npm install
    pause
    exit /b 1
  )
)
call npm start

