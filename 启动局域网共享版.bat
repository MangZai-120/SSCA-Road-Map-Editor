@echo off
chcp 65001 >nul
cd /d "%~dp0"
title SSCA思路编辑器 - 局域网共享版

echo ========================================
echo   SSCA思路编辑器 - 局域网共享版
echo ========================================
echo.
echo 正在启动服务...

:: 检查 node 是否安装
where node >nul 2>nul
if errorlevel 1 (
  echo [错误] 未检测到 Node.js，请先安装: https://nodejs.org
  echo.
  pause
  exit /b 1
)

echo.
echo 服务启动后，把屏幕上显示的 http://... 地址发给同学即可。
echo 同学用浏览器打开就能用，无需安装任何东西。
echo.
echo 首次使用若同学打不开，请以管理员身份运行本脚本（会自动添加防火墙规则）。
echo ------------------------------------------------------
echo.

node server.js
pause
