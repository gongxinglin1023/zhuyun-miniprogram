/**
 * 珠韵东方小程序 - API配置
 * 预留后端接口，支持本地配置和远程API切换
 */

import config from './config.js'

class API {
  constructor() {
    this.baseUrl = config.api.baseUrl
    this.isMockMode = config.mock.enabled
    this.brandConfig = null
  }

  /**
   * 通用请求方法
   */
  async request(endpoint, options = {}) {
    const { method = 'GET', data = {}, params = {} } = options

    // Mock模式
    if (this.isMockMode) {
      return this.getMockData(endpoint)
    }

    let url = this.baseUrl + endpoint
    const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
    if (queryString) url += '?' + queryString

    try {
      const response = await uni.request({
        url,
        method,
        header: {
          'Content-Type': 'application/json',
          'Authorization': this.getToken()
        },
        data
      })
      return response.data
    } catch (error) {
      console.error('API请求失败:', error)
      return this.handleError(error)
    }
  }

  /**
   * 获取Token
   */
  getToken() {
    try {
      return uni.getStorageSync('zhuyun_token') || ''
    } catch {
      return ''
    }
  }

  /**
   * 错误处理
   */
  handleError(error) {
    return {
      code: -1,
      message: '网络请求失败，请检查网络连接',
      error: error.message
    }
  }

  /**
   * Mock数据
   */
  async getMockData(endpoint) {
    await new Promise(resolve => setTimeout(resolve, config.mock.delay))

    if (endpoint.includes('brand/info')) return this.mockBrandInfo()
    if (endpoint.includes('products')) return this.mockProducts()
    if (endpoint.includes('stores')) return this.mockStores()
    if (endpoint.includes('banners')) return this.mockBanners()

    return { code: 404, message: '接口不存在', data: null }
  }

  // ==================== 品牌接口 ====================

  async getBrandInfo() {
    return this.request('/api/brand/info')
  }

  async getProducts(params = {}) {
    return this.request('/api/brand/products', { params })
  }

  async getProductDetail(id) {
    return this.request(`/api/brand/products/${id}`)
  }

  async getStores() {
    return this.request('/api/brand/stores')
  }

  async getBanners() {
    return this.request('/api/brand/banners')
  }

  // ==================== 用户接口 ====================

  async login(phone, code) {
    return this.request('/api/user/login', { method: 'POST', data: { phone, code } })
  }

  async getUserInfo() {
    return this.request('/api/user/info')
  }

  async updateUserInfo(data) {
    return this.request('/api/user/update', { method: 'POST', data })
  }

  // ==================== 订单接口 ====================

  async createOrder(orderData) {
    return this.request('/api/order/create', { method: 'POST', data: orderData })
  }

  async getOrders(params = {}) {
    return this.request('/api/order/list', { params })
  }

  async cancelOrder(orderId) {
    return this.request(`/api/order/${orderId}/cancel`, { method: 'POST' })
  }

  // ==================== 购物车接口 ====================

  async getCart() {
    return this.request('/api/cart/list')
  }

  async addToCart(productId, quantity = 1) {
    return this.request('/api/cart/add', { method: 'POST', data: { productId, quantity } })
  }

  async removeFromCart(cartId) {
    return this.request(`/api/cart/${cartId}`, { method: 'DELETE' })
  }

  async updateCartItem(cartId, quantity) {
    return this.request(`/api/cart/${cartId}`, { method: 'PUT', data: { quantity } })
  }

  // ==================== 会员接口 ====================

  async getMemberInfo() {
    return this.request('/api/member/info')
  }

  async getMemberPoints() {
    return this.request('/api/member/points')
  }

  async getMemberBenefits() {
    return this.request('/api/member/benefits')
  }

  // ==================== Mock数据 ====================

  mockBrandInfo() {
    return {
      code: 200,
      message: 'success',
      data: config.brand
    }
  }

  mockProducts() {
    return {
      code: 200,
      message: 'success',
      data: {
        list: [
          {
            id: 1,
            name: '经典单珠项链 - Akoya珍珠',
            price: 2999,
            originalPrice: 3999,
            image: '/static/images/product-1.png',
            tag: '畅销款',
            category: '经典单珠',
            sales: 2580,
            description: '精选日本Akoya海水珍珠，直径8-8.5mm，圆润光泽，18K金扣头'
          },
          {
            id: 2,
            name: '优雅串珠项链 - 淡水珍珠',
            price: 1599,
            originalPrice: 1999,
            image: '/static/images/product-2.png',
            tag: '新品',
            category: '多珠串链',
            sales: 1260,
            description: '精选优质淡水珍珠，颗颗饱满，大小渐变设计，优雅大方'
          },
          {
            id: 3,
            name: '设计师限定款 - 星辰系列',
            price: 5999,
            originalPrice: 7999,
            image: '/static/images/product-3.png',
            tag: '限定',
            category: '设计师款',
            sales: 386,
            description: '知名设计师联名款，将珍珠与星辰元素结合，独一无二'
          },
          {
            id: 4,
            name: '挚爱礼盒套装',
            price: 3999,
            originalPrice: 4999,
            image: '/static/images/product-4.png',
            tag: '礼盒',
            category: '礼物套装',
            sales: 890,
            description: '项链+耳钉组合，精美礼盒包装，适合送给自己或挚爱'
          }
        ],
        total: 4,
        page: 1,
        pageSize: 20
      }
    }
  }

  mockStores() {
    return {
      code: 200,
      message: 'success',
      data: [
        {
          id: 1,
          name: '昆明旗舰体验店',
          address: '云南省昆明市五华区东风东路98号',
          phone: '0871-8888-9999',
          hours: '10:00-21:00',
          status: 'open',
          latitude: 25.0433,
          longitude: 102.7092,
          services: ['线下体验', '免费清洗', '刻字服务', '礼品包装']
        },
        {
          id: 2,
          name: '昆明恒隆广场店',
          address: '云南省昆明市盘龙区东风广场恒隆广场L2',
          phone: '0871-6666-8888',
          hours: '10:00-22:00',
          status: 'open',
          latitude: 25.0456,
          longitude: 102.7189,
          services: ['线下体验', '礼品包装']
        }
      ]
    }
  }

  mockBanners() {
    return {
      code: 200,
      message: 'success',
      data: [
        { id: 1, image: '/static/images/banner-1.png', title: '新品上市', subtitle: '星辰系列限定款发布', link: '/pages/product-detail/index?id=3' },
        { id: 2, image: '/static/images/banner-2.png', title: '会员专享', subtitle: '注册即享首单8折优惠', link: '/pages/member/index' },
        { id: 3, image: '/static/images/banner-3.png', title: '线下体验', subtitle: '昆明旗舰体验店盛大开业', link: '/pages/store/index' }
      ]
    }
  }
}

export default new API()
