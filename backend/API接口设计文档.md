# 后端API接口设计文档

## 珠韵东方 - 后端接口规范

### 接口基础信息

| 项目 | 说明 |
|------|------|
| 基础URL | `https://api.zhuyun.com` |
| 数据格式 | JSON |
| 编码格式 | UTF-8 |
| 认证方式 | Bearer Token |

---

## 一、品牌接口

### 1.1 获取品牌基本信息

```
GET /api/brand/info
```

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "name": "珠韵东方",
    "nameEn": "ZHUYUN ORIENTAL",
    "logo": "https://cdn.zhuyun.com/logo.png",
    "slogan": "一珠一韵 · 一生珍爱",
    "tagline": "源自东方美学的高端珍珠品牌",
    "description": "...",
    "vision": "...",
    "mission": "...",
    "contact": {
      "phone": "400-888-9999",
      "email": "contact@zhuyun.com",
      "address": "云南省昆明市..."
    },
    "social": {
      "wechat": "zhuyun_oriental",
      "xiaohongshu": "珠韵东方",
      "douyin": "珠韵东方官方"
    }
  }
}
```

### 1.2 获取产品列表

```
GET /api/brand/products
```

**参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码，默认1 |
| pageSize | int | 否 | 每页数量，默认20 |
| category | string | 否 | 分类ID |
| keyword | string | 否 | 搜索关键词 |
| sort | string | 否 | 排序：price-asc, price-desc, sales |

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "经典单珠项链",
        "price": 2999,
        "originalPrice": 3999,
        "image": "https://cdn.zhuyun.com/products/1.jpg",
        "images": ["...", "..."],
        "tag": "畅销款",
        "category": "经典单珠",
        "sales": 2580,
        "stock": 100,
        "description": "精选日本Akoya海水珍珠..."
      }
    ],
    "total": 20,
    "page": 1,
    "pageSize": 20
  }
}
```

### 1.3 获取门店列表

```
GET /api/brand/stores
```

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "昆明旗舰体验店",
      "address": "云南省昆明市五华区东风东路98号",
      "phone": "0871-8888-9999",
      "hours": "10:00-21:00",
      "status": "open",
      "latitude": 25.0433,
      "longitude": 102.7092,
      "services": ["线下体验", "免费清洗", "刻字服务"]
    }
  ]
}
```

---

## 二、用户接口

### 2.1 用户登录

```
POST /api/user/login
```

**请求参数：**
```json
{
  "phone": "13800138000",
  "code": "123456"
}
```

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userInfo": {
      "id": 1,
      "phone": "13800138000",
      "nickname": "珍珠爱好者",
      "avatar": "https://cdn.zhuyun.com/avatar.jpg",
      "level": "银卡会员",
      "points": 1000
    }
  }
}
```

---

## 三、订单接口

### 3.1 创建订单

```
POST /api/order/create
```

**请求参数：**
```json
{
  "items": [
    { "productId": 1, "quantity": 1 }
  ],
  "addressId": 1,
  "couponId": null,
  "remark": "请 gift 包装"
}
```

---

## 四、购物车接口

### 4.1 获取购物车

```
GET /api/cart/list
```

### 4.2 添加到购物车

```
POST /api/cart/add
```

---

## 五、会员接口

### 5.1 获取会员信息

```
GET /api/member/info
Authorization: Bearer {token}
```

### 5.2 获取会员积分

```
GET /api/member/points
```

### 5.3 获取会员权益

```
GET /api/member/benefits
```

---

## 六、通用配置接口

### 6.1 获取全局配置

```
GET /api/brand/config
```

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "version": "1.0.0",
    "lastUpdate": "2025-05-02T00:00:00Z",
    "brand": { ... },
    "theme": {
      "primary": "#8B6914",
      "secondary": "#D4A84B"
    }
  }
}
```

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未登录或token过期 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 后端修改品牌信息的步骤

1. **登录后台管理系统**
2. **进入品牌设置页面**
3. **修改相应字段**（名称、slogan、联系方式等）
4. **保存后系统自动更新 `brand-config.json`**
5. **前端通过 `/api/brand/info` 接口获取最新配置**
6. **前端页面无需重新部署，自动生效**

---

*文档版本：v1.0.0*
*最后更新：2025-05-02*
