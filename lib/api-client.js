// API Client for Next.js API Routes

const API_BASE = '/api';

class ApiClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  }

  // Auth
  async register(userData) {
    return this.request('/auth', {
      method: 'POST',
      body: { ...userData, _action: 'register' },
    });
  }

  async login(email, password) {
    return this.request('/auth', {
      method: 'POST',
      body: { email, password },
    });
  }

  async logout() {
    return this.request('/auth', {
      method: 'POST',
      body: { _action: 'logout' },
    });
  }

  async getMe() {
    return this.request('/auth');
  }

  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/products${query ? `?${query}` : ''}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async getCategories() {
    return this.request('/products/categories');
  }

  // Seller
  async getSellerProfile() {
    return this.request('/seller?action=profile');
  }

  async updateSellerProfile(data) {
    return this.request('/seller?action=profile', {
      method: 'PUT',
      body: data,
    });
  }

  async getSellerProducts() {
    return this.request('/seller?action=products');
  }

  async createProduct(productData) {
    return this.request('/seller', {
      method: 'POST',
      body: productData,
    });
  }

  async updateProduct(id, productData) {
    return this.request('/seller?action=product', {
      method: 'PUT',
      body: { id, ...productData },
    });
  }

  async deleteProduct(id) {
    return this.request(`/seller?id=${id}`, {
      method: 'DELETE',
    });
  }

  async getSellerOrders() {
    return this.request('/seller?action=orders');
  }

  async getSellerWallet() {
    return this.request('/seller?action=wallet');
  }

  async getSellerTransactions() {
    return this.request('/seller?action=transactions');
  }

  // Orders
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: orderData,
    });
  }

  async getOrders() {
    return this.request('/orders');
  }

  async getOrder(id) {
    return this.request(`/orders?id=${id}`);
  }

  async updateOrderStatus(id, status) {
    return this.request('/orders', {
      method: 'PUT',
      body: { id, status },
    });
  }

  // Admin
  async getDashboard() {
    return this.request('/admin?action=dashboard');
  }

  async getUsers() {
    return this.request('/admin?action=users');
  }

  async getUser(id) {
    return this.request(`/admin?action=users&id=${id}`);
  }

  async updateUser(id, data) {
    return this.request('/admin?action=user', {
      method: 'PUT',
      body: { id, ...data },
    });
  }

  async blockUser(id) {
    return this.request(`/admin?action=user&id=${id}`, {
      method: 'DELETE',
    });
  }

  async restoreUser(id) {
    return this.request('/admin?action=restore-user', {
      method: 'PUT',
      body: { id },
    });
  }

  async getSellers() {
    return this.request('/admin?action=sellers');
  }

  async approveSeller(id) {
    return this.request('/admin?action=approve-seller', {
      method: 'PUT',
      body: { id },
    });
  }

  async rejectSeller(id) {
    return this.request('/admin?action=reject-seller', {
      method: 'PUT',
      body: { id },
    });
  }

  async getAllProducts() {
    return this.request('/admin?action=products');
  }

  async deleteProductAdmin(id) {
    return this.request(`/admin?action=product&id=${id}`, {
      method: 'DELETE',
    });
  }

  async getAdminCategories() {
    return this.request('/admin?action=categories');
  }

  async createCategory(data) {
    return this.request('/admin?action=category', {
      method: 'POST',
      body: data,
    });
  }

  async updateCategory(id, data) {
    return this.request('/admin?action=category', {
      method: 'PUT',
      body: { id, ...data },
    });
  }

  async deleteCategory(id) {
    return this.request(`/admin?action=category&id=${id}`, {
      method: 'DELETE',
    });
  }

  async getAllOrders() {
    return this.request('/admin?action=orders');
  }

  async deleteOrder(id) {
    return this.request(`/admin?action=order&id=${id}`, {
      method: 'DELETE',
    });
  }

  async getBanners() {
    return this.request('/banners');
  }

  async getAdminBanners() {
    return this.request('/admin?action=banners');
  }

  async createBanner(data) {
    return this.request('/admin?action=banner', {
      method: 'POST',
      body: data,
    });
  }

  async updateBanner(id, data) {
    return this.request('/admin?action=banner', {
      method: 'PUT',
      body: { id, ...data },
    });
  }

  async deleteBanner(id) {
    return this.request(`/admin?action=banner&id=${id}`, {
      method: 'DELETE',
    });
  }

  async getSellerWalletAdmin(sellerId) {
    return this.request(`/admin?action=wallet&sellerId=${sellerId}`);
  }

  async addDeposit(sellerId, amount, note) {
    return this.request('/admin?action=deposit', {
      method: 'POST',
      body: { sellerId, amount, note },
    });
  }

  async deductAmount(sellerId, amount, note) {
    return this.request('/admin?action=deduct', {
      method: 'POST',
      body: { sellerId, amount, note },
    });
  }

  async loginAsUser(userId) {
    return this.request('/admin?action=login-as', {
      method: 'POST',
      body: { userId },
    });
  }

  // Messages
  async getMessages() {
    return this.request('/messages');
  }

  async markMessageRead(id) {
    return this.request(`/messages?id=${id}`, {
      method: 'PUT',
    });
  }

  async sendMessage(receiverId, message) {
    return this.request('/admin?action=message', {
      method: 'POST',
      body: { receiverId, message },
    });
  }

  // Withdrawals
  async createWithdrawal(data) {
    return this.request('/withdrawals', {
      method: 'POST',
      body: data,
    });
  }

  async getWithdrawals() {
    return this.request('/withdrawals');
  }

  async processWithdrawal(id, status, note) {
    return this.request('/withdrawals', {
      method: 'PUT',
      body: { id, status, note },
    });
  }

  // Virtual Customers
  async generateVirtualCustomers(count) {
    return this.request('/virtual-customers?action=generate', {
      method: 'POST',
      body: { count },
    });
  }

  async getVirtualCustomers() {
    return this.request('/virtual-customers');
  }

  async loginAsCustomer(id) {
    return this.request('/virtual-customers?action=login-as', {
      method: 'POST',
      body: { id },
    });
  }

  // Virtual Orders & Sellers
  async createVirtualOrder(data) {
    return this.request('/admin?action=virtual-order', {
      method: 'POST',
      body: data,
    });
  }

  async createVirtualSeller(data) {
    return this.request('/admin?action=virtual-seller', {
      method: 'POST',
      body: data,
    });
  }
}

export const api = new ApiClient();
export default api;
