import api from './axios'

// Auth endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
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
  deleteAllItems: () => api.delete('/menu/items'),
}

// Orders endpoints
export const ordersAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrder: (orderId) => api.get(`/orders/${orderId}`),
  getCustomerOrders: (phone) => api.get(`/orders/customer/${phone}`),
  getOwnerOrders: (status) => api.get('/orders/owner/list', { params: { status } }),
  updateOrderStatus: (orderId, status) => api.put(`/orders/${orderId}/status`, { status }),
  markOrderReady: (orderId) => api.put(`/orders/${orderId}/ready`),
  markOrderCompleted: (orderId) => api.put(`/orders/${orderId}/complete`),
}

// QR Code endpoints
export const qrAPI = {
  generate: (qrData) => api.post('/qr/generate', qrData),
  getAll: () => api.get('/qr'),
  getOne: (qrId) => api.get(`/qr/${qrId}`),
  delete: (qrId) => api.delete(`/qr/${qrId}`),
  trackScan: (token) => api.post(`/qr/scan/${token}`),
}

// Dashboard endpoints
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getActivity: () => api.get('/dashboard/activity'),
  getQRSummary: () => api.get('/dashboard/qr-summary'),
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
  dashboard: dashboardAPI,
  analytics: analyticsAPI,
}
