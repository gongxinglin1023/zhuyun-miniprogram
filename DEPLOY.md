# 珠韵东方 - Cloudflare Pages 部署指南

## 🚀 5分钟快速部署

### 步骤1：创建 GitHub 仓库（约2分钟）

1. 打开 https://github.com 并登录
2. 点击右上角 **+** → **New repository**
3. 填写：
   - **Repository name**: `zhuyun-miniprogram`
   - **Description**: 珠韵东方小程序原型
   - 选择 **Public**
   - 点击 **Create repository**

### 步骤2：上传文件（约1分钟）

在 GitHub 仓库页面，点击 **uploading an existing file**，将 `public` 文件夹内的所有文件拖入：

```
public/
├── index.html        ✓
├── brand-config.json ✓
├── api-config.json   ✓
├── _redirects        ✓
└── _headers          ✓
```

### 步骤3：部署到 Cloudflare Pages（约2分钟）

1. 打开 https://pages.cloudflare.com/ 并登录（可用 GitHub 账号）
2. 点击 **Create a project**
3. 选择 **Authorize GitHub** 并连接你的 GitHub 账号
4. 选择刚创建的仓库 `zhuyun-miniprogram`
5. 配置：
   - **Project name**: `zhuyun-miniprogram`（或你喜欢的名字）
   - **Production branch**: `main`
   - **Build settings**: 
     - Build command: （留空）
     - Build output directory: `/public`
6. 点击 **Save and Deploy**

### 🎉 完成！

你将获得一个类似这样的免费域名：
```
https://zhuyun-miniprogram.pages.dev
```

---

## 📱 用户访问方式

直接把链接发给用户即可：
- 微信内打开：长按二维码 → 识别图中小程序码
- 浏览器打开：直接访问链接

---

## 🔄 快速更新迭代流程

```
你修改代码 → 推送到 GitHub → Cloudflare 自动部署（约1分钟）→ 用户刷新页面看到更新
```

### 更新命令：

```bash
# 1. 在本地修改文件
# 2. 推送到 GitHub
git add .
git commit -m "更新品牌信息"
git push origin main
```

---

## 🌐 自定义域名（可选）

如果你有自己的域名：

1. 在 Cloudflare Pages 项目设置中点击 **Custom domains**
2. 输入你的域名（如 `app.zhuyun.com`）
3. 按照提示在 DNS 添加记录
4. 免费 SSL 证书自动生效！

---

## 💡 高级功能

### 添加访问密码

编辑 `public/index.html`，在 `<script>` 开头添加：

```javascript
// 简单的密码保护
const PASSWORD = 'zhuyun2026';
const userPass = prompt('请输入访问密码：');
if (userPass !== PASSWORD) {
  alert('密码错误');
  location.href = 'about:blank';
}
```

### 添加版本号显示

在 `public/index.html` 底部添加：

```html
<div style="position:fixed;bottom:70px;right:10px;background:rgba(139,105,20,0.9);color:white;padding:6px 10px;border-radius:20px;font-size:11px;">
  v1.0.0 | 更新日期
</div>
```

---

## 📁 项目文件结构

```
d:/workspace_codebuddy/huiyi_zz/
├── public/                    ← 上传到 GitHub 的文件夹
│   ├── index.html            # 主页面（小程序原型）
│   ├── brand-config.json     # 品牌配置（可在线修改）
│   ├── api-config.json       # API配置
│   ├── _redirects            # Cloudflare 配置
│   └── _headers             # 安全头配置
│
├── miniprogram-prototype.html # 原型源文件
├── miniprogram/              # uni-app 小程序源码
├── pages/                    # 官网页面
├── js/                       # JS模块
├── css/                      # 样式文件
└── DEPLOY.md                 # 本部署指南
```

---

## ❓ 常见问题

| 问题 | 解决 |
|------|------|
| 页面空白 | 检查 `index.html` 是否在 `public` 文件夹根目录 |
| 样式丢失 | 确保 `_redirects` 文件正确配置 |
| 品牌配置不生效 | Cloudflare Pages 不支持 fetch 本地 JSON，已改为内联 |
| 部署失败 | 检查 GitHub 仓库是否设置为 Public |
| 更新不生效 | 等待约1分钟，Cloudflare 需要重新构建 |

---

## 🎯 推荐工作流

```
用户反馈需求 → 修改原型 → 推送 GitHub → 自动部署 → 用户预览 → 确认方案
     ↑_________________________________________________________________↓
```

这样你可以边开发边让用户预览，大大提高沟通效率！✨
