<template>
  <view class="container">
    <view class="category-content">
      <!-- 左侧分类导航 -->
      <scroll-view class="category-left" scroll-y>
        <view 
          v-for="item in categories" 
          :key="item.id" 
          class="category-item"
          :class="{ active: currentCategory === item.id }"
          @click="onCategoryChange(item.id)"
        >
          <text>{{ item.name }}</text>
        </view>
      </scroll-view>
      
      <!-- 右侧产品列表 -->
      <scroll-view class="category-right" scroll-y @scrolltolower="loadMore">
        <view class="category-banner">
          <image :src="currentBanner" mode="aspectFill" />
        </view>
        
        <view class="products-grid">
          <view v-for="item in products" :key="item.id" class="product-item" @click="goToDetail(item.id)">
            <view class="product-image">
              <image :src="item.image" mode="aspectFill" />
              <view v-if="item.tag" class="product-tag">{{ item.tag }}</view>
            </view>
            <view class="product-info">
              <text class="product-name">{{ item.name }}</text>
              <text class="product-price">¥{{ item.price }}</text>
            </view>
          </view>
        </view>
        
        <view v-if="loading" class="loading">加载中...</view>
        <view v-if="noMore" class="no-more">没有更多了</view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import api from '../../api/index.js'

export default {
  data() {
    return {
      categories: [
        { id: '', name: '全部' },
        { id: 'classic', name: '经典单珠' },
        { id: 'multi', name: '多珠串链' },
        { id: 'designer', name: '设计师款' },
        { id: 'gift', name: '礼物套装' }
      ],
      currentCategory: '',
      products: [],
      page: 1,
      pageSize: 10,
      loading: false,
      noMore: false
    }
  },
  
  computed: {
    currentBanner() {
      const banners = {
        '': '/static/images/banner-all.png',
        'classic': '/static/images/banner-classic.png',
        'multi': '/static/images/banner-multi.png',
        'designer': '/static/images/banner-designer.png',
        'gift': '/static/images/banner-gift.png'
      }
      return banners[this.currentCategory] || banners['']
    }
  },
  
  onLoad() {
    this.loadProducts()
  },
  
  methods: {
    async onCategoryChange(id) {
      this.currentCategory = id
      this.page = 1
      this.products = []
      this.noMore = false
      await this.loadProducts()
    },
    
    async loadProducts() {
      if (this.loading || this.noMore) return
      
      this.loading = true
      const res = await api.getProducts({
        category: this.currentCategory,
        page: this.page,
        pageSize: this.pageSize
      })
      
      if (res.code === 200) {
        const list = res.data.list || []
        this.products = [...this.products, ...list]
        
        if (list.length < this.pageSize) {
          this.noMore = true
        } else {
          this.page++
        }
      }
      this.loading = false
    },
    
    loadMore() {
      this.loadProducts()
    },
    
    goToDetail(id) {
      uni.navigateTo({
        url: `/pages/product-detail/index?id=${id}`
      })
    }
  }
}
</script>

<style scoped>
.container { height: 100vh; background: #FFF9F0; }

.category-content {
  display: flex;
  height: calc(100vh - env(safe-area-inset-bottom) - 100rpx);
}

.category-left {
  width: 180rpx;
  background: #fff;
  border-right: 1px solid #eee;
}

.category-item {
  padding: 32rpx 20rpx;
  text-align: center;
  font-size: 28rpx;
  color: #666;
  position: relative;
}

.category-item.active {
  background: #FFF9F0;
  color: #8B6914;
  font-weight: 600;
}

.category-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4rpx;
  background: #8B6914;
}

.category-right {
  flex: 1;
  padding: 20rpx;
}

.category-banner {
  height: 200rpx;
  border-radius: 12rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  background: linear-gradient(135deg, #F5E6C8, #D4A84B);
}

.category-banner image {
  width: 100%;
  height: 100%;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.product-item {
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
}

.product-image {
  position: relative;
  height: 300rpx;
  background: #F7F5F0;
}

.product-image image { width: 100%; height: 100%; }

.product-tag {
  position: absolute;
  top: 12rpx;
  left: 12rpx;
  padding: 4rpx 12rpx;
  background: #8B6914;
  color: #fff;
  font-size: 20rpx;
  border-radius: 16rpx;
}

.product-info {
  padding: 16rpx;
}

.product-name {
  display: block;
  font-size: 26rpx;
  color: #333;
  margin-bottom: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  font-size: 30rpx;
  font-weight: 600;
  color: #8B6914;
}

.loading, .no-more {
  text-align: center;
  padding: 30rpx;
  color: #999;
  font-size: 26rpx;
}
</style>
