#!/bin/bash
# 珠韵东方 - 自动部署脚本
# 使用方法：双击运行或命令行执行 deploy.sh

echo "=========================================="
echo "  珠韵东方 - 小程序原型自动部署"
echo "=========================================="
echo ""

# 检查 GitHub Token
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ 错误：未设置 GitHub Token"
    echo ""
    echo "请先设置环境变量："
    echo '  Windows:  set GITHUB_TOKEN=你的Token'
    echo '  macOS/Linux:  export GITHUB_TOKEN=你的Token'
    echo ""
    echo "或者在 Windows PowerShell 中："
    echo '  $env:GITHUB_TOKEN="你的Token"'
    echo ""
    echo "如何获取 Token："
    echo "  1. 打开 https://github.com/settings/tokens"
    echo "  2. 点击 Generate new token (classic)"
    echo "  3. 勾选 repo 权限"
    echo "  4. 生成并复制 Token"
    echo ""
    read -p "按任意键退出..."
    exit 1
fi

# 配置
REPO_URL="https://${GITHUB_TOKEN}@github.com/gongxinglin1023/zhuyun-miniprogram.git"
BRANCH="main"
COMMIT_MSG="更新：$(date '+%Y-%m-%d %H:%M:%S')"

echo "📦 准备部署文件..."
echo ""

# 复制最新版本到 public 目录
cp miniprogram-v2.html public/index.html
cp brand-config.json public/brand-config.json
cp api-config.json public/api-config.json

echo "✅ 文件已准备"
echo ""

# Git 操作
echo "🔄 正在推送到 GitHub..."
git init
git remote remove origin 2>/dev/null
git remote add origin "$REPO_URL"
git checkout -b $BRANCH 2>/dev/null || git checkout $BRANCH
git add .
git commit -m "$COMMIT_MSG" 2>/dev/null

if git push origin $BRANCH --force 2>&1 | grep -q "error\|fatal"; then
    echo ""
    echo "❌ 推送失败！"
    echo ""
    echo "可能原因："
    echo "  1. Token 已过期"
    echo "  2. Token 权限不足（需要 repo 权限）"
    echo "  3. 仓库不存在或无权访问"
    echo ""
    read -p "按任意键退出..."
    exit 1
fi

echo ""
echo "✅ 推送成功！"
echo ""
echo "🌐 等待 Cloudflare Pages 自动部署（约1-2分钟）"
echo ""
echo "部署状态查询："
echo "  https://github.com/gongxinglin1023/zhuyun-miniprogram/actions"
echo ""
echo "访问地址："
echo "  https://zhuyun-miniprogram.pages.dev"
echo ""
echo "=========================================="
read -p "按任意键退出..."
