<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <input class="search-input" placeholder="搜索珍珠项链" @confirm="onSearch" />
      <view class="search-icon">🔍</view>
    </view>

    <!-- 横幅轮播 -->
    <swiper class="banner-swiper" indicator-dots autoplay circular>
      <swiper-item v-for="item in banners" :key="item.id">
        <image class="banner-image" :src="item.image" mode="aspectFill" @click="onBannerClick(item)" />
      </swiper-item>
    </swiper>

    <!-- 分类导航 -->
    <view class="category-nav">
      <view v-for="item in categories" :key="item.id" class="category-item" @click="onCategoryClick(item)">
        <view class="category-icon">{{ item.icon }}</view>
        <text class="category-name">{{ item.name }}</text>
      </view>
    </view>

    <!-- 品牌特色 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">品牌特色</text>
      </view>
      <view class="features-grid">
        <view v-for="item in features" :key="item.title" class="feature-item">
          <view class="feature-icon">{{ item.icon }}</view>
          <text class="feature-title">{{ item.title }}</text>
          <text class="feature-desc">{{ item.desc }}</text>
        </view>
      </view>
    </view>

    <!-- 热门产品 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">热门推荐</text>
        <text class="section-more" @click="goToProducts">更多 ></text>
      </view>
      <view class="products-grid">
        <view v-for="item in products" :key="item.id" class="product-item" @click="goToProductDetail(item.id)">
          <view class="product-image">
            <image :src="item.image" mode="aspectFill" />
            <view v-if="item.tag" class="product-tag">{{ item.tag }}</view>
          </view>
          <view class="product-info">
            <text class="product-name">{{ item.name }}</text>
            <text class="product-desc">{{ item.description }}</text>
            <view class="product-price">
              <text class="price-current">¥{{ item.price }}</text>
              <text v-if="item.originalPrice > item.price" class="price-original">¥{{ item.originalPrice }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 门店信息 -->
    <view class="section store-section" @click="goToStore">
      <view class="store-card">
        <view class="store-info">
          <text class="store-name">昆明旗舰体验店</text>
          <text class="store-address">云南省昆明市五华区东风东路98号</text>
          <text class="store-hours">营业时间：周一至周日 10:00-21:00</text>
        </view>
        <text class="store-arrow">></text>
      </view>
    </view>

    <!-- 底部导航 -->
    <view class="tab-bar">
      <view class="tab-item active">
        <view class="tab-icon">🏠</view>
        <text>首页</text>
      </view>
      <view class="tab-item" @click="goToCategory">
        <view class="tab-icon">📦</view>
        <text>分类</text>
      </view>
      <view class="tab-item" @click="goToCart">
        <view class="tab-icon">🛒</view>
        <text>购物车</text>
      </view>
      <view class="tab-item" @click="goToMember">
        <view class="tab-icon">👤</view>
        <text>我的</text>
      </view>
    </view>
  </view>
</template>

<script>
import api from '../../api/index.js'

export default {
  data() {
    return {
      banners: [],
      categories: [
        { id: 1, name: '经典单珠', icon: '💎' },
        { id: 2, name: '多珠串链', icon: '📿' },
        { id: 3, name: '设计师款', icon: '✨' },
        { id: 4, name: '礼物套装', icon: '🎁' }
      ],
      features: [
        { icon: '💎', title: '天然珍珠', desc: '精选优质天然珍珠' },
        { icon: '👨‍🎨', title: '匠心工艺', desc: '资深匠人手工打造' },
        { icon: '🌸', title: '东方设计', desc: '融合东方美学' },
        { icon: '✓', title: '品质保障', desc: '专业鉴定证书' }
      ],
      products: []
    }
  },
  
  onLoad() {
    this.loadData()
  },
  
  methods: {
    async loadData() {
      // 加载横幅
      const bannerRes = await api.getBanners()
      if (bannerRes.code === 200) {
        this.banners = bannerRes.data
      }
      
      // 加载产品
      const productRes = await api.getProducts()
      if (productRes.code === 200) {
        this.products = productRes.data.list?.slice(0, 4) || []
      }
    },
    
    onSearch(e) {
      uni.navigateTo({
        url: `/pages/products/index?keyword=${e.detail.value}`
      })
    },
    
    onBannerClick(item) {
      if (item.link) {
        uni.navigateTo({ url: item.link })
      }
    },
    
    onCategoryClick(item) {
      uni.navigateTo({
        url: `/pages/products/index?category=${item.id}`
      })
    },
    
    goToProducts() {
      uni.switchTab({ url: '/pages/category/index' })
    },
    
    goToProductDetail(id) {
      uni.navigateTo({
        url: `/pages/product-detail/index?id=${id}`
      })
    },
    
    goToStore() {
      uni.navigateTo({
        url: '/pages/store/index'
      })
    },
    
    goToCategory() {
      uni.switchTab({ url: '/pages/category/index' })
    },
    
    goToCart() {
      uni.switchTab({ url: '/pages/cart/index' })
    },
    
    goToMember() {
      uni.switchTab({ url: '/pages/member/index' })
    }
  }
}
</script>

<style scoped>
.container {
  background: #FFF9F0;
  padding-bottom: 120rpx;
}

.search-bar {
  position: relative;
  padding: 20rpx 30rpx;
  background: #8B6914;
}

.search-input {
  background: #fff;
  border-radius: 50rpx;
  padding: 20rpx 30rpx 20rpx 60rpx;
  font-size: 28rpx;
}

.search-icon {
  position: absolute;
  left: 50rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 28rpx;
}

.banner-swiper {
  height: 400rpx;
}

.banner-image {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #F5E6C8, #D4A84B);
}

.category-nav {
  display: flex;
  justify-content: space-around;
  padding: 40rpx 20rpx;
  background: #fff;
  margin-bottom: 20rpx;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.category-icon {
  width: 100rpx;
  height: 100rpx;
  background: #F5E6C8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  margin-bottom: 16rpx;
}

.category-name {
  font-size: 26rpx;
  color: #333;
}

.section {
  background: #fff;
  margin-bottom: 20rpx;
  padding: 30rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #3D2914;
}

.section-more {
  font-size: 26rpx;
  color: #8B6914;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.feature-icon {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #8B6914, #D4A84B);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  margin-bottom: 16rpx;
}

.feature-title {
  font-size: 26rpx;
  font-weight: 500;
  color: #3D2914;
  margin-bottom: 8rpx;
}

.feature-desc {
  font-size: 22rpx;
  color: #666;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.product-item {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.06);
}

.product-image {
  position: relative;
  height: 320rpx;
  background: linear-gradient(135deg, #F5E6C8, #E8E4DC);
}

.product-image image {
  width: 100%;
  height: 100%;
}

.product-tag {
  position: absolute;
  top: 16rpx;
  left: 16rpx;
  padding: 6rpx 16rpx;
  background: #8B6914;
  color: #fff;
  font-size: 22rpx;
  border-radius: 20rpx;
}

.product-info {
  padding: 20rpx;
}

.product-name {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-desc {
  display: block;
  font-size: 24rpx;
  color: #999;
  margin-bottom: 12rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  display: flex;
  align-items: baseline;
}

.price-current {
  font-size: 32rpx;
  font-weight: 600;
  color: #8B6914;
}

.price-original {
  font-size: 24rpx;
  color: #999;
  text-decoration: line-through;
  margin-left: 12rpx;
}

.store-section {
  padding: 0;
}

.store-card {
  display: flex;
  align-items: center;
  padding: 40rpx 30rpx;
}

.store-info {
  flex: 1;
}

.store-name {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: #3D2914;
  margin-bottom: 12rpx;
}

.store-address,
.store-hours {
  display: block;
  font-size: 26rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.store-arrow {
  font-size: 32rpx;
  color: #999;
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
  padding-bottom: env(safe-area-inset-bottom);
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #999;
}

.tab-item.active {
  color: #8B6914;
}

.tab-icon {
  font-size: 40rpx;
  margin-bottom: 4rpx;
}

.tab-item text {
  font-size: 22rpx;
}
</style>
