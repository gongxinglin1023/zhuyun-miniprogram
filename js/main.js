/**
 * 珠韵东方 - 品牌官网主逻辑
 * 动态加载品牌配置，预留后端修改入口
 */

class PearlBrand {
  constructor() {
    this.api = brandAPI;
    this.init();
  }

  /**
   * 初始化
   */
  async init() {
    // 等待API初始化
    await this.api.init();
    
    // 加载品牌配置
    await this.loadBrandConfig();
    
    // 根据页面加载对应模块
    this.initPage();
  }

  /**
   * 加载品牌配置到页面
   */
  async loadBrandConfig() {
    const result = await this.api.getBrandInfo();
    
    if (result.code === 200 && result.data) {
      this.config = result.data;
      this.applyConfig();
    }
  }

  /**
   * 应用配置到页面元素
   */
  applyConfig() {
    const config = this.config;
    if (!config) return;

    // 更新SEO
    document.title = config.seo?.title || config.brand?.name;
    
    // 更新meta标签
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', config.seo?.description || config.brand?.description);
    }

    // 更新品牌名称 - 全局查找并替换
    document.querySelectorAll('[data-brand-name]').forEach(el => {
      el.textContent = config.brand?.name || '珠韵东方';
    });

    // 更新Slogan
    document.querySelectorAll('[data-brand-slogan]').forEach(el => {
      el.textContent = config.brand?.slogan || '';
    });

    // 更新描述
    document.querySelectorAll('[data-brand-desc]').forEach(el => {
      el.textContent = config.brand?.description || '';
    });

    // 更新联系方式
    document.querySelectorAll('[data-contact-phone]').forEach(el => {
      el.textContent = config.contact?.phone || '';
    });
    document.querySelectorAll('[data-contact-email]').forEach(el => {
      el.textContent = config.contact?.email || '';
    });
    document.querySelectorAll('[data-contact-address]').forEach(el => {
      el.textContent = config.contact?.address || '';
    });

    // 应用主题色
    if (config.theme) {
      this.applyTheme(config.theme);
    }

    console.log('品牌配置已应用:', config.brand?.name);
  }

  /**
   * 应用主题色
   */
  applyTheme(theme) {
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primary || '#8B6914');
    root.style.setProperty('--secondary', theme.secondary || '#D4A84B');
    root.style.setProperty('--accent', theme.accent || '#F5E6C8');
    root.style.setProperty('--dark', theme.dark || '#3D2914');
    root.style.setProperty('--light', theme.light || '#FFF9F0');
    root.style.setProperty('--text', theme.text || '#333333');
    root.style.setProperty('--text-light', theme.textLight || '#666666');
  }

  /**
   * 初始化页面
   */
  initPage() {
    const page = document.body.dataset.page;
    
    switch(page) {
      case 'home':
        this.initHomePage();
        break;
      case 'products':
        this.initProductsPage();
        break;
      case 'product-detail':
        this.initProductDetailPage();
        break;
      case 'about':
        this.initAboutPage();
        break;
      case 'store':
        this.initStorePage();
        break;
      default:
        console.log('未识别页面类型');
    }
  }

  /**
   * 首页初始化
   */
  async initHomePage() {
    // 加载横幅
    const bannersResult = await this.api.getBanners();
    if (bannersResult.code === 200) {
      this.renderBanners(bannersResult.data);
    }

    // 加载产品
    const productsResult = await this.api.getProducts();
    if (productsResult.code === 200) {
      this.renderProducts(productsResult.data.list?.slice(0, 6) || []);
    }

    // 渲染品牌特色
    this.renderFeatures();

    // 渲染门店信息
    this.renderFeaturedStore();
  }

  /**
   * 渲染横幅轮播
   */
  renderBanners(banners) {
    const container = document.getElementById('banner-container');
    if (!container || !banners || banners.length === 0) return;

    container.innerHTML = banners.map((banner, index) => `
      <div class="banner-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
        <div class="banner-content">
          <h2 class="banner-title">${banner.title}</h2>
          <p class="banner-subtitle">${banner.subtitle}</p>
          <a href="${banner.link}" class="banner-btn">立即了解</a>
        </div>
        <div class="banner-image" style="background-image: url('${banner.image}')"></div>
      </div>
    `).join('');

    // 初始化轮播
    this.initBannerSlider();
  }

  /**
   * 初始化横幅轮播
   */
  initBannerSlider() {
    const slides = document.querySelectorAll('.banner-slide');
    if (slides.length <= 1) return;

    let currentIndex = 0;
    setInterval(() => {
      slides[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % slides.length;
      slides[currentIndex].classList.add('active');
    }, 4000);
  }

  /**
   * 渲染产品列表
   */
  renderProducts(products) {
    const container = document.getElementById('products-container');
    if (!container) return;

    container.innerHTML = products.map(product => `
      <div class="product-card" data-id="${product.id}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ''}
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-desc">${product.description}</p>
          <div class="product-price">
            <span class="price-current">¥${product.price.toLocaleString()}</span>
            ${product.originalPrice > product.price ? 
              `<span class="price-original">¥${product.originalPrice.toLocaleString()}</span>` : ''}
          </div>
          <div class="product-actions">
            <button class="btn-detail" onclick="window.location.href='pages/product-detail.html?id=${product.id}'">查看详情</button>
            <button class="btn-cart" onclick="app.addToCart(${product.id})">加入购物车</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  /**
   * 渲染品牌特色
   */
  renderFeatures() {
    const container = document.getElementById('features-container');
    if (!container || !this.config?.features) return;

    const featureIcons = {
      gem: '<svg viewBox="0 0 24 24"><path d="M12 2L2 9l10 13 10-13L12 2zm0 3.5L18.5 9 12 18.5 5.5 9 12 5.5z"/></svg>',
      craft: '<svg viewBox="0 0 24 24"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg>',
      design: '<svg viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>',
      quality: '<svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>'
    };

    container.innerHTML = this.config.features.map(feature => `
      <div class="feature-card">
        <div class="feature-icon">
          ${featureIcons[feature.icon] || featureIcons.gem}
        </div>
        <h3 class="feature-title">${feature.title}</h3>
        <p class="feature-desc">${feature.description}</p>
      </div>
    `).join('');
  }

  /**
   * 渲染门店信息
   */
  renderFeaturedStore() {
    const container = document.getElementById('featured-store');
    if (!container || !this.config?.stores) return;

    const store = this.config.stores[0];
    container.innerHTML = `
      <h3 class="store-name">${store.name}</h3>
      <p class="store-address">${store.address}</p>
      <p class="store-hours">营业时间：${store.hours}</p>
      <p class="store-phone">联系电话：<a href="tel:${store.phone}">${store.phone}</a></p>
      <a href="pages/store.html" class="store-more">查看全部门店 →</a>
    `;
  }

  /**
   * 产品页初始化
   */
  async initProductsPage() {
    const result = await this.api.getProducts();
    if (result.code === 200) {
      this.renderProducts(result.data.list || []);
    }
  }

  /**
   * 产品详情页初始化
   */
  async initProductDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
      const result = await this.api.getProductDetail(productId);
      if (result.code === 200) {
        this.renderProductDetail(result.data);
      }
    }
  }

  /**
   * 渲染产品详情
   */
  renderProductDetail(product) {
    // 实现产品详情渲染逻辑
    console.log('渲染产品详情:', product);
  }

  /**
   * 关于页初始化
   */
  initAboutPage() {
    if (!this.config?.about) return;
    
    document.querySelectorAll('[data-about-story]').forEach(el => {
      el.textContent = this.config.about.story;
    });
  }

  /**
   * 门店页初始化
   */
  async initStorePage() {
    const result = await this.api.getStores();
    if (result.code === 200) {
      this.renderStores(result.data);
    }
  }

  /**
   * 渲染门店列表
   */
  renderStores(stores) {
    const container = document.getElementById('stores-container');
    if (!container) return;

    container.innerHTML = stores.map(store => `
      <div class="store-card">
        <h3 class="store-name">${store.name}</h3>
        <p class="store-address">${store.address}</p>
        <p class="store-hours">营业时间：${store.hours}</p>
        <p class="store-phone">电话：${store.phone}</p>
        <div class="store-services">
          ${store.services.map(s => `<span class="service-tag">${s}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  /**
   * 添加到购物车
   */
  async addToCart(productId) {
    const result = await this.api.addToCart(productId);
    if (result.code === 200) {
      this.showToast('已添加到购物车');
    } else {
      this.showToast(result.message || '添加失败');
    }
  }

  /**
   * 显示提示
   */
  showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 2000);
    }, 10);
  }
}

// 页面加载完成后初始化
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new PearlBrand();
});
