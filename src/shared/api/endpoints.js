import api from './axios'

// Auth endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
}

// Menu endpoints
export const menuAPI = {
  getPublicMenu: (menuSlug, token) => api.get(`/menu/${menuSlug}`, { params: { token } }),
  getOwnerMenu: () => api.get('/menu/owner'),
  uploadMenu: (formData) => api.post('/menu/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateMenu: (menuData) => api.put('/menu', menuData),
  publishMenu: () => api.post('/menu/publish'),
  addItem: (itemData) => api.post('/menu/items', itemData),
  updateItem: (itemId, itemData) => api.put(`/menu/items/${itemId}`, itemData),
  deleteItem: (itemId) => api.delete(`/menu/items/${itemId}`),
}

// Orders endpoints
export const ordersAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrder: (orderId) => api.get(`/orders/${orderId}`),
  getOwnerOrders: (status) => api.get('/orders/owner', { params: { status } }),
  updateOrderStatus: (orderId, status) => api.put(`/orders/${orderId}/status`, { status }),
  markOrderReady: (orderId) => api.put(`/orders/${orderId}/ready`),
  markOrderCompleted: (orderId) => api.put(`/orders/${orderId}/complete`),
}

// QR Code endpoints
export const qrAPI = {
  generateGlobal: () => api.post('/qr/global'),
  generateTable: (tableNumber) => api.post('/qr/table', { tableNumber }),
  getQRCodes: () => api.get('/qr'),
  deleteQRCode: (qrId) => api.delete(`/qr/${qrId}`),
}

// Analytics endpoints
export const analyticsAPI = {
  getStats: (period) => api.get('/analytics/stats', { params: { period } }),
  getOrderHistory: (page, limit) => api.get('/analytics/orders', { params: { page, limit } }),
  getPopularItems: () => api.get('/analytics/popular-items'),
}

export default {
  auth: authAPI,
  menu: menuAPI,
  orders: ordersAPI,
  qr: qrAPI,
  analytics: analyticsAPI,
}
