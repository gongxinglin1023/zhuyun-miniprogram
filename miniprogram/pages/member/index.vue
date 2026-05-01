<template>
  <view class="container">
    <!-- 用户信息头部 -->
    <view class="user-header">
      <view class="user-info">
        <view class="avatar">
          <image src="/static/images/avatar-default.png" mode="aspectFill" />
        </view>
        <view class="user-detail" v-if="isLogin">
          <text class="nickname">{{ userInfo.nickname }}</text>
          <text class="level">{{ userInfo.level }}</text>
        </view>
        <view class="user-detail" v-else>
          <text class="nickname" @click="goToLogin">点击登录</text>
        </view>
      </view>
      <view class="member-card">
        <view class="member-left">
          <text class="member-label">会员积分</text>
          <text class="member-value">{{ userInfo.points || 0 }}</text>
        </view>
        <view class="member-right">
          <text class="member-label">会员等级</text>
          <text class="member-value">{{ userInfo.level || '普通会员' }}</text>
        </view>
      </view>
    </view>

    <!-- 订单入口 -->
    <view class="order-section">
      <view class="order-header">
        <text class="section-title">我的订单</text>
        <text class="section-more" @click="goToOrderList">全部订单 ></text>
      </view>
      <view class="order-tabs">
        <view class="order-tab" @click="goToOrderList('pending')">
          <view class="tab-icon">⏳</view>
          <text>待付款</text>
        </view>
        <view class="order-tab" @click="goToOrderList('shipped')">
          <view class="tab-icon">🚚</view>
          <text>待收货</text>
        </view>
        <view class="order-tab" @click="goToOrderList('completed')">
          <view class="tab-icon">✅</view>
          <text>已完成</text>
        </view>
        <view class="order-tab" @click="goToOrderList('refund')">
          <view class="tab-icon">💰</view>
          <text>退款/售后</text>
        </view>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="menu-section">
      <view class="menu-item" @click="goToPoints">
        <view class="menu-left">
          <text class="menu-icon">🎫</text>
          <text class="menu-text">我的积分</text>
        </view>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="goToCoupons">
        <view class="menu-left">
          <text class="menu-icon">🎟️</text>
          <text class="menu-text">优惠券</text>
        </view>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="goToAddresses">
        <view class="menu-left">
          <text class="menu-icon">📍</text>
          <text class="menu-text">收货地址</text>
        </view>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="goToStore">
        <view class="menu-left">
          <text class="menu-icon">🏪</text>
          <text class="menu-text">门店查询</text>
        </view>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="callService">
        <view class="menu-left">
          <text class="menu-icon">📞</text>
          <text class="menu-text">联系客服</text>
        </view>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="goToSettings">
        <view class="menu-left">
          <text class="menu-icon">⚙️</text>
          <text class="menu-text">设置</text>
        </view>
        <text class="menu-arrow">></text>
      </view>
    </view>
  </view>
</template>

<script>
import config from '../../api/config.js'

export default {
  data() {
    return {
      isLogin: false,
      userInfo: {}
    }
  },
  
  onShow() {
    this.checkLogin()
  },
  
  methods: {
    checkLogin() {
      const token = uni.getStorageSync('zhuyun_token')
      if (token) {
        this.isLogin = true
        this.userInfo = uni.getStorageSync('zhuyun_user') || {
          nickname: '珍珠爱好者',
          level: '银卡会员',
          points: 1000
        }
      } else {
        this.isLogin = false
      }
    },
    
    goToLogin() {
      uni.navigateTo({ url: '/pages/login/index' })
    },
    
    goToOrderList(status) {
      uni.navigateTo({
        url: `/pages/order/index?status=${status || 'all'}`
      })
    },
    
    goToPoints() {
      uni.navigateTo({ url: '/pages/points/index' })
    },
    
    goToCoupons() {
      uni.navigateTo({ url: '/pages/coupons/index' })
    },
    
    goToAddresses() {
      uni.navigateTo({ url: '/pages/addresses/index' })
    },
    
    goToStore() {
      uni.navigateTo({ url: '/pages/store/index' })
    },
    
    callService() {
      uni.makePhoneCall({
        phoneNumber: config.contact.phone
      })
    },
    
    goToSettings() {
      uni.navigateTo({ url: '/pages/settings/index' })
    }
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #F7F5F0;
  padding-bottom: 120rpx;
}

.user-header {
  background: linear-gradient(135deg, #8B6914, #D4A84B);
  padding: 40rpx 30rpx;
  color: #fff;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  overflow: hidden;
  border: 4rpx solid rgba(255,255,255,0.3);
  margin-right: 24rpx;
}

.avatar image { width: 100%; height: 100%; }

.user-detail {
  display: flex;
  flex-direction: column;
}

.nickname {
  font-size: 36rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.level {
  font-size: 26rpx;
  opacity: 0.9;
}

.member-card {
  display: flex;
  background: rgba(255,255,255,0.15);
  border-radius: 16rpx;
  padding: 30rpx;
}

.member-left, .member-right {
  flex: 1;
  text-align: center;
}

.member-left {
  border-right: 1px solid rgba(255,255,255,0.3);
}

.member-label {
  display: block;
  font-size: 26rpx;
  opacity: 0.9;
  margin-bottom: 8rpx;
}

.member-value {
  font-size: 40rpx;
  font-weight: 600;
}

.order-section {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.section-more {
  font-size: 26rpx;
  color: #999;
}

.order-tabs {
  display: flex;
  justify-content: space-around;
}

.order-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tab-icon {
  font-size: 48rpx;
  margin-bottom: 12rpx;
}

.order-tab text {
  font-size: 26rpx;
  color: #666;
}

.menu-section {
  background: #fff;
  margin: 0 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1px solid #f5f5f5;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-left {
  display: flex;
  align-items: center;
}

.menu-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.menu-text {
  font-size: 30rpx;
  color: #333;
}

.menu-arrow {
  font-size: 28rpx;
  color: #ccc;
}
</style>
