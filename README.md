# 珠韵东方 - Pearl Brand Website

## 品牌档案

### 品牌核心信息（可由后端API动态修改）

```json
{
  "brand": {
    "name": "珠韵东方",
    "nameEn": "ZHUYUN ORIENTAL",
    "slogan": "一珠一韵 · 一生珍爱",
    "sloganShort": "一珠一韵，一生珍爱",
    "tagline": "源自东方美学的高端珍珠品牌",
    "description": "珠韵东方，专注于为都市女性提供高品质天然珍珠项链，以东方美学为设计理念，将传统工艺与现代时尚完美融合。"
  },
  "contact": {
    "phone": "400-888-9999",
    "email": "contact@zhuyun.com",
    "address": "云南省昆明市五华区",
    "wechat": "zhuyun_oriental",
    "weibo": "@珠韵东方官方"
  },
  "social": {
    "xiaohongshu": "珠韵东方",
    "douyin": "珠韵东方官方",
    "wechat": "珠韵东方",
    "weibo": "珠韵东方官方"
  }
}
```

## 技术架构

### 目录结构

```
d:/workspace_codebuddy/huiyi_zz/
├── brand-config.json          # 品牌配置（后端可修改）
├── api-config.json            # API接口配置
├── index.html                 # 品牌官网首页
├── css/
│   └── style.css              # 样式文件
├── js/
│   ├── main.js                # 主逻辑
│   └── api.js                 # API调用模块（预留后端接口）
├── images/                    # 图片资源
│   ├── logo.png
│   ├── hero.jpg
│   └── products/
├── pages/
│   ├── about.html             # 品牌故事
│   ├── products.html          # 产品列表
│   ├── product-detail.html     # 产品详情
│   ├── store.html             # 门店查询
│   ├── member.html             # 会员中心
│   └── contact.html           # 联系我们
└── miniprogram/               # 小程序源码
    ├── pages/
    │   ├── index/
    │   ├── category/
    │   ├── cart/
    │   ├── member/
    │   └── store/
    └── app.js
```

## 预留后端接口设计

### 基础信息接口

| 接口 | 方法 | 用途 | 状态 |
|------|------|------|------|
| `/api/brand/info` | GET | 获取品牌基本信息 | ✅ 已设计 |
| `/api/brand/products` | GET | 获取产品列表 | ✅ 已设计 |
| `/api/brand/stores` | GET | 获取门店列表 | ✅ 已设计 |
| `/api/brand/config` | GET | 获取全局配置 | ✅ 已设计 |

### 接口响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "brandName": "珠韵东方",
    "slogan": "一珠一韵 · 一生珍爱",
    "products": [...],
    "stores": [...]
  }
}
```

---

*此文档定义了品牌基础架构，所有品牌信息均可通过后端API动态修改。*
