/**
 * 珠韵东方小程序 - 全局配置
 * 可由后端API动态修改
 */

export default {
  // API配置
  api: {
    baseUrl: 'https://api.zhuyun.com', // 后端API地址
    timeout: 10000
  },
  
  // Mock模式配置
  mock: {
    enabled: true, // 设为false切换到远程API
    delay: 300 // 模拟网络延迟(ms)
  },
  
  // 品牌配置
  brand: {
    name: '珠韵东方',
    nameEn: 'ZHUYUN ORIENTAL',
    slogan: '一珠一韵 · 一生珍爱',
    tagline: '源自东方美学的高端珍珠品牌',
    description: '珠韵东方，专注于为都市女性提供高品质天然珍珠项链，以东方美学为设计理念，将传统工艺与现代时尚完美融合。'
  },
  
  // 主题色配置
  theme: {
    primary: '#8B6914',
    primaryDark: '#6B5210',
    secondary: '#D4A84B',
    accent: '#F5E6C8',
    dark: '#3D2914',
    light: '#FFF9F0',
    text: '#333333',
    textLight: '#666666',
    white: '#FFFFFF',
    gray100: '#F7F5F0',
    gray200: '#E8E4DC',
    gray300: '#D4CFC4'
  },
  
  // 存储键名
  storage: {
    tokenKey: 'zhuyun_token',
    userKey: 'zhuyun_user',
    cartKey: 'zhuyun_cart'
  },
  
  // 客服电话
  contact: {
    phone: '400-888-9999',
    hotline: '0871-8888-9999',
    email: 'contact@zhuyun.com'
  }
}
