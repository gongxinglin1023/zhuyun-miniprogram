# 珠韵东方 - 自动部署脚本 (Windows PowerShell)
# 使用方法：右键 -> 使用 PowerShell 运行
# 或命令行：powershell -File deploy.ps1

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  珠韵东方 - 小程序原型自动部署" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 GitHub Token
if (-not $env:GITHUB_TOKEN) {
    Write-Host "❌ 错误：未设置 GitHub Token" -ForegroundColor Red
    Write-Host ""
    Write-Host "请先设置环境变量：" -ForegroundColor Yellow
    Write-Host '  $env:GITHUB_TOKEN = "你的Token"' -ForegroundColor Green
    Write-Host ""
    Write-Host "或永久设置：" -ForegroundColor Yellow
    Write-Host '  [Environment]::SetEnvironmentVariable("GITHUB_TOKEN", "你的Token", "User")' -ForegroundColor Green
    Write-Host ""
    Write-Host "如何获取 Token：" -ForegroundColor Yellow
    Write-Host "  1. 打开 https://github.com/settings/tokens"
    Write-Host "  2. 点击 Generate new token (classic)"
    Write-Host "  3. 勾选 repo 权限"
    Write-Host "  4. 生成并复制 Token"
    Write-Host ""
    Read-Host "按回车键退出"
    exit 1
}

# 配置
$RepoUrl = "https://${env:GITHUB_TOKEN}@github.com/gongxinglin1023/zhuyun-miniprogram.git"
$Branch = "main"
$CommitMsg = "更新：$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

Write-Host "📦 准备部署文件..." -ForegroundColor Green

# 复制最新版本到 public 目录
Copy-Item -Force "miniprogram-v2.html" "public/index.html"
Copy-Item -Force "brand-config.json" "public/brand-config.json"
Copy-Item -Force "api-config.json" "public/api-config.json"

Write-Host "✅ 文件已准备" -ForegroundColor Green
Write-Host ""

# Git 操作
Write-Host "🔄 正在推送到 GitHub..." -ForegroundColor Yellow

# 初始化 Git 仓库（如果需要）
if (-not (Test-Path ".git")) {
    git init
    git remote add origin $RepoUrl
}

# 设置远程仓库（带 Token）
git remote set-url origin $RepoUrl

# 添加文件并提交
git add .
git commit -m $CommitMsg -q

# 推送到 GitHub
$pushResult = git push origin $Branch --force 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ 推送失败！" -ForegroundColor Red
    Write-Host ""
    Write-Host "可能原因：" -ForegroundColor Yellow
    Write-Host "  1. Token 已过期"
    Write-Host "  2. Token 权限不足（需要 repo 权限）"
    Write-Host "  3. 仓库不存在或无权访问"
    Write-Host ""
    Write-Host "错误信息：$pushResult" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

Write-Host ""
Write-Host "✅ 推送成功！" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 等待 Cloudflare Pages 自动部署（约1-2分钟）" -ForegroundColor Cyan
Write-Host ""
Write-Host "部署状态查询：" -ForegroundColor Yellow
Write-Host "  https://github.com/gongxinglin1023/zhuyun-miniprogram/actions"
Write-Host ""
Write-Host "访问地址：" -ForegroundColor Yellow
Write-Host "  https://zhuyun-miniprogram.pages.dev"
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan

# 自动打开浏览器查看
Start-Process "https://zhuyun-miniprogram.pages.dev"

Read-Host "按回车键退出"
