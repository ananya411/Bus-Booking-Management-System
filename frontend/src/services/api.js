import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bbms_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors globally (e.g. 401 unauthorized)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('bbms_token');
      localStorage.removeItem('bbms_user');
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// Auth APIs
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// Trip APIs
export const tripApi = {
  searchTrips: (params) => api.get('/trips/search', { params }),
  getTripById: (tripId) => api.get(`/trips/${tripId}`),
  getTripSeats: (tripId) => api.get(`/trips/${tripId}/seats`),
  getAllTrips: (params) => api.get('/trips', { params }),
  createTrip: (data) => api.post('/trips', data),
  updateTrip: (tripId, data) => api.put(`/trips/${tripId}`, data),
  deleteTrip: (tripId) => api.delete(`/trips/${tripId}`),
};

// Bus APIs
export const busApi = {
  getBuses: (params) => api.get('/buses', { params }),
  getBusById: (busId) => api.get(`/buses/${busId}`),
  createBus: (data) => api.post('/buses', data),
  updateBus: (busId, data) => api.put(`/buses/${busId}`, data),
  deleteBus: (busId) => api.delete(`/buses/${busId}`),
};

// Route APIs
export const routeApi = {
  getRoutes: (params) => api.get('/routes', { params }),
  getRouteById: (routeId) => api.get(`/routes/${routeId}`),
  createRoute: (data) => api.post('/routes', data),
  updateRoute: (routeId, data) => api.put(`/routes/${routeId}`, data),
  deleteRoute: (routeId) => api.delete(`/routes/${routeId}`),
};

// Stop APIs
export const stopApi = {
  getStops: (params) => api.get('/stops', { params }),
  createStop: (data) => api.post('/stops', data),
};

// Booking APIs
export const bookingApi = {
  createBooking: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my').catch(() => api.get('/bookings')), // fallback
  getAllBookings: (params) => api.get('/bookings', { params }),
  getBookingById: (bookingId) => api.get(`/bookings/${bookingId}`),
  getBookingByPnr: (pnr) => api.get(`/bookings/pnr/${pnr}`),
  cancelBooking: (bookingId, reason = '') => api.post(`/bookings/${bookingId}/cancel`, { reason }),
};

// Reports APIs
export const reportApi = {
  getDashboard: () => api.get('/reports/dashboard'),
  getRevenue: (params) => api.get('/reports/revenue', { params }),
  getOccupancy: (params) => api.get('/reports/occupancy', { params }),
};

// Operator APIs
export const operatorApi = {
  getMyTrips: () => api.get('/operators/trips'),
  getManifest: (tripId) => api.get(`/operators/trips/${tripId}/manifest`),
};

// User Management APIs
export const userApi = {
  getAllUsers: (params) => api.get('/users', { params }),
  updateUserRole: (userId, role) => api.patch(`/users/${userId}/role`, { role }),
};

// Audit Logs APIs
export const auditLogApi = {
  getAuditLogs: (params) => api.get('/audit-logs', { params }),
};

export default api;
