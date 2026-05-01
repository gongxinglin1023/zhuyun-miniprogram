/**
 * API调用模块 - 珠韵东方品牌官网
 * 预留后端接口，支持本地配置和远程API切换
 */

class BrandAPI {
  constructor() {
    this.baseUrl = '';
    this.config = null;
    this.brandConfig = null;
    this.isMockMode = true; // 默认使用本地配置
    this.init();
  }

  /**
   * 初始化 - 加载配置
   */
  async init() {
    try {
      // 加载API配置
      const apiConfigRes = await fetch('./api-config.json');
      this.config = await apiConfigRes.json();
      
      // 加载品牌配置
      const brandConfigRes = await fetch('./brand-config.json');
      this.brandConfig = await brandConfigRes.json();
      
      // 根据配置决定是否启用mock模式
      this.isMockMode = this.config.mock.enabled;
      
      console.log('珠韵东方 - API模块初始化完成', {
        mode: this.isMockMode ? '本地配置模式' : '远程API模式',
        brand: this.brandConfig.brand.name
      });
      
      return true;
    } catch (error) {
      console.error('配置加载失败:', error);
      return false;
    }
  }

  /**
   * 通用请求方法
   */
  async request(endpoint, options = {}) {
    const { method = 'GET', data = null, params = {} } = options;
    
    // 如果是本地配置模式且存在mock数据
    if (this.isMockMode) {
      return this.getMockData(endpoint);
    }
    
    // 远程API模式
    let url = this.config.api.baseUrl + endpoint;
    
    // 添加查询参数
    const queryString = new URLSearchParams(params).toString();
    if (queryString) {
      url += '?' + queryString;
    }
    
    const requestOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.getToken()
      }
    };
    
    if (data && method !== 'GET') {
      requestOptions.body = JSON.stringify(data);
    }
    
    try {
      const response = await fetch(url, requestOptions);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API请求失败:', error);
      return this.handleError(error);
    }
  }

  /**
   * Mock数据获取
   */
  async getMockData(endpoint) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, this.config.mock.delay));
    
    // 根据endpoint返回对应mock数据
    if (endpoint.includes('brand/info') || endpoint === '/api/brand/info') {
      return this.mockBrandInfo();
    }
    if (endpoint.includes('products')) {
      return this.mockProducts();
    }
    if (endpoint.includes('stores')) {
      return this.mockStores();
    }
    if (endpoint.includes('banners')) {
      return this.mockBanners();
    }
    if (endpoint.includes('config')) {
      return this.mockConfig();
    }
    
    return { code: 404, message: '接口不存在', data: null };
  }

  /**
   * 获取Token
   */
  getToken() {
    return localStorage.getItem(this.config.storage.tokenKey) || '';
  }

  /**
   * 错误处理
   */
  handleError(error) {
    return {
      code: -1,
      message: '网络请求失败，请检查网络连接',
      error: error.message
    };
  }

  // ==================== 品牌接口 ====================

  /**
   * 获取品牌基本信息
   */
  async getBrandInfo() {
    return this.request('/api/brand/info');
  }

  /**
   * 获取产品列表
   */
  async getProducts(params = {}) {
    return this.request('/api/brand/products', { params });
  }

  /**
   * 获取产品详情
   */
  async getProductDetail(id) {
    return this.request(`/api/brand/products/${id}`);
  }

  /**
   * 获取门店列表
   */
  async getStores() {
    return this.request('/api/brand/stores');
  }

  /**
   * 获取首页横幅
   */
  async getBanners() {
    return this.request('/api/brand/banners');
  }

  /**
   * 获取全局配置
   */
  async getConfig() {
    return this.request('/api/brand/config');
  }

  // ==================== 用户接口 ====================

  /**
   * 用户登录
   */
  async login(phone, code) {
    return this.request('/api/user/login', {
      method: 'POST',
      data: { phone, code }
    });
  }

  /**
   * 获取用户信息
   */
  async getUserInfo() {
    return this.request('/api/user/info');
  }

  // ==================== 订单接口 ====================

  /**
   * 创建订单
   */
  async createOrder(orderData) {
    return this.request('/api/order/create', {
      method: 'POST',
      data: orderData
    });
  }

  /**
   * 获取订单列表
   */
  async getOrders(params = {}) {
    return this.request('/api/order/list', { params });
  }

  // ==================== 购物车接口 ====================

  /**
   * 获取购物车
   */
  async getCart() {
    return this.request('/api/cart/list');
  }

  /**
   * 添加到购物车
   */
  async addToCart(productId, quantity = 1) {
    return this.request('/api/cart/add', {
      method: 'POST',
      data: { productId, quantity }
    });
  }

  // ==================== Mock数据 ====================

  mockBrandInfo() {
    return {
      code: 200,
      message: 'success',
      data: this.brandConfig
    };
  }

  mockProducts() {
    const products = [
      {
        id: 1,
        name: '经典单珠项链 -  Akoya珍珠',
        price: 2999,
        originalPrice: 3999,
        image: './images/products/product-1.jpg',
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
        image: './images/products/product-2.jpg',
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
        image: './images/products/product-3.jpg',
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
        image: './images/products/product-4.jpg',
        tag: '礼盒',
        category: '礼物套装',
        sales: 890,
        description: '项链+耳钉组合，精美礼盒包装，适合送给自己或挚爱'
      },
      {
        id: 5,
        name: '南洋金珠项链',
        price: 12999,
        originalPrice: 15999,
        image: './images/products/product-5.jpg',
        tag: '高端',
        category: '经典单珠',
        sales: 156,
        description: '澳大利亚南洋金珠，直径12-13mm，奢华大气'
      },
      {
        id: 6,
        name: '简约时尚款 - 18K金链',
        price: 899,
        originalPrice: 1299,
        image: './images/products/product-6.jpg',
        tag: '百搭',
        category: '设计师款',
        sales: 1680,
        description: '小巧精致的单珠吊坠，18K金链，适合日常佩戴'
      }
    ];
    
    return {
      code: 200,
      message: 'success',
      data: {
        list: products,
        total: products.length,
        page: 1,
        pageSize: 20
      }
    };
  }

  mockStores() {
    return {
      code: 200,
      message: 'success',
      data: this.brandConfig.stores
    };
  }

  mockBanners() {
    return {
      code: 200,
      message: 'success',
      data: [
        {
          id: 1,
          image: './images/banners/banner-1.jpg',
          title: '新品上市',
          subtitle: '星辰系列限定款发布',
          link: '/pages/product-detail.html?id=3'
        },
        {
          id: 2,
          image: './images/banners/banner-2.jpg',
          title: '会员专享',
          subtitle: '注册即享首单8折优惠',
          link: '/pages/member.html'
        },
        {
          id: 3,
          image: './images/banners/banner-3.jpg',
          title: '线下体验',
          subtitle: '昆明旗舰体验店盛大开业',
          link: '/pages/store.html'
        }
      ]
    };
  }

  mockConfig() {
    return {
      code: 200,
      message: 'success',
      data: {
        version: '1.0.0',
        lastUpdate: '2025-05-02',
        brand: this.brandConfig
      }
    };
  }
}

// 导出全局实例
const brandAPI = new BrandAPI();

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BrandAPI, brandAPI };
}
