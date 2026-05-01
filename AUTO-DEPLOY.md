# 珠韵东方 - 自动部署配置指南

## 🚀 快速开始

### 方案一：一键自动部署（推荐）

#### 步骤1：获取 GitHub Token（一次性）

1. 打开 https://github.com/settings/tokens
2. 点击 **Generate new token** → **Generate new token (classic)**
3. 填写：
   - **Note**: `zhuyun-deploy`
   - **Expiration**: 建议选择 `30 days` 或 `90 days`
   - ✅ 勾选 **`repo`** (Full control of private repositories)
4. 点击 **Generate token**
5. **立即复制 Token**（只显示一次！）

#### 步骤2：设置 Token

**Windows PowerShell（推荐）：**
```powershell
$env:GITHUB_TOKEN = "ghp_xxxxxxxxxxxx"
```

**永久保存（可选）：**
```powershell
[Environment]::SetEnvironmentVariable("GITHUB_TOKEN", "ghp_xxxxxxxxxxxx", "User")
```

#### 步骤3：运行部署脚本

```powershell
cd d:/workspace_codebuddy/huiyi_zz
powershell -File deploy.ps1
```

---

### 方案二：手动推送（备用）

如果自动脚本失败，使用手动命令：

```powershell
cd d:/workspace_codebuddy/huiyi_zz

# 设置 Token
$env:GITHUB_TOKEN = "ghp_xxxxxxxxxxxx"

# 复制最新文件
Copy-Item -Force "miniprogram-v2.html" "public/index.html"

# 推送
git init
git remote add origin "https://${env:GITHUB_TOKEN}@github.com/gongxinglin1023/zhuyun-miniprogram.git"
git add .
git commit -m "更新"
git push origin main --force
```

---

## ⚙️ 配置 Cloudflare Pages 自动部署

### 步骤1：获取 Cloudflare API Token

1. 打开 https://dash.cloudflare.com/profile/api-tokens
2. 点击 **Create Token**
3. 选择 **Custom token** → **Get started**
4. 配置：
   - **Token name**: `zhuyun-pages-deploy`
   - **Account permissions**: 
     - `Account Settings` → Read
     - `Cloudflare Pages` → Edit
5. 点击 **Continue to summary** → **Create Token**
6. **复制 Token**

### 步骤2：在 GitHub 设置密钥

1. 打开 https://github.com/gongxinglin1023/zhuyun-miniprogram/settings/secrets/actions
2. 点击 **New repository secret**，添加：
   - **Name**: `CLOUDFLARE_API_TOKEN`
   - **Secret**: 你的 Cloudflare API Token
3. 再添加：
   - **Name**: `CLOUDFLARE_ACCOUNT_ID`
   - **Secret**: 你的 Cloudflare Account ID（可在 Cloudflare Dashboard URL 中找到）

### 步骤3：在 Cloudflare Pages 连接 GitHub

1. 打开 https://pages.cloudflare.com/
2. 点击 **Create a project**
3. 选择 **GitHub** 并连接仓库 `zhuyun-miniprogram`
4. 设置：
   - **Project name**: `zhuyun-miniprogram`
   - **Production branch**: `main`
   - **Build settings**: 
     - Build command: (留空)
     - Build output directory: `/public`
5. 点击 **Save and Deploy**

---

## 🔄 自动部署流程

```
修改代码 → 推送 GitHub → GitHub Actions → Cloudflare Pages 自动部署 → 上线
     ↓
   deploy.ps1
```

---

## 📁 部署文件结构

```
d:/workspace_codebuddy/huiyi_zz/
├── public/                  ← 部署到 Cloudflare 的文件
│   ├── index.html
│   ├── brand-config.json
│   ├── api-config.json
│   └── _redirects
│
├── .github/
│   └── workflows/
│       └── deploy.yml      ← GitHub Actions 自动部署配置
│
├── deploy.ps1              ← Windows 自动部署脚本
├── deploy.sh               ← macOS/Linux 自动部署脚本
└── miniprogram-v2.html     ← 最新版本原型
```

---

## ❓ 常见问题

| 问题 | 解决方案 |
|------|----------|
| Token 无效 | 重新生成 Token，确保勾选了 repo 权限 |
| 推送被拒绝 | 检查 Token 是否过期 |
| Cloudflare 没自动部署 | 检查 GitHub Actions 和 Cloudflare 连接 |
| 部署失败 | 检查 GitHub Actions 日志 |

---

## 🌐 部署后访问

```
生产环境：https://zhuyun-miniprogram.pages.dev
GitHub Actions：https://github.com/gongxinglin1023/zhuyun-miniprogram/actions
Cloudflare Pages：https://pages.cloudflare.com/
```

---

## 💡 提示

- 每次修改 `miniprogram-v2.html` 后，运行 `deploy.ps1` 即可自动部署
- 部署后约 1-2 分钟生效
- 可以直接分享 `https://zhuyun-miniprogram.pages.dev` 给用户预览
