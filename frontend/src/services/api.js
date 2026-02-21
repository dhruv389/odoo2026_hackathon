// API Base Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Something went wrong');
  }
  const json = await response.json();
  // If response has a 'data' property, return that, otherwise return the whole response
  return json.data !== undefined ? json.data : json;
};

// Helper function to make authenticated requests
const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  return handleResponse(response);
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    return fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (userData) => {
    return fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getProfile: async () => {
    return fetchWithAuth('/auth/profile');
  },
};

// Vehicle API
export const vehicleAPI = {
  getAll: async () => {
    return fetchWithAuth('/vehicles');
  },

  getById: async (id) => {
    return fetchWithAuth(`/vehicles/${id}`);
  },

  create: async (vehicleData) => {
    return fetchWithAuth('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  },

  update: async (id, vehicleData) => {
    return fetchWithAuth(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData),
    });
  },

  delete: async (id) => {
    return fetchWithAuth(`/vehicles/${id}`, {
      method: 'DELETE',
    });
  },

  updateStatus: async (id, status) => {
    return fetchWithAuth(`/vehicles/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

// Driver API
export const driverAPI = {
  getAll: async () => {
    return fetchWithAuth('/drivers');
  },

  getById: async (id) => {
    return fetchWithAuth(`/drivers/${id}`);
  },

  create: async (driverData) => {
    return fetchWithAuth('/drivers', {
      method: 'POST',
      body: JSON.stringify(driverData),
    });
  },

  update: async (id, driverData) => {
    return fetchWithAuth(`/drivers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(driverData),
    });
  },

  delete: async (id) => {
    return fetchWithAuth(`/drivers/${id}`, {
      method: 'DELETE',
    });
  },

  updateStatus: async (id, status) => {
    return fetchWithAuth(`/drivers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

// Trip API
export const tripAPI = {
  getAll: async () => {
    return fetchWithAuth('/trips');
  },

  getById: async (id) => {
    return fetchWithAuth(`/trips/${id}`);
  },

  create: async (tripData) => {
    return fetchWithAuth('/trips', {
      method: 'POST',
      body: JSON.stringify(tripData),
    });
  },

  update: async (id, tripData) => {
    return fetchWithAuth(`/trips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tripData),
    });
  },

  delete: async (id) => {
    return fetchWithAuth(`/trips/${id}`, {
      method: 'DELETE',
    });
  },

  updateStatus: async (id, status) => {
    return fetchWithAuth(`/trips/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

// Maintenance API
export const maintenanceAPI = {
  getAll: async () => {
    return fetchWithAuth('/maintenance');
  },

  getById: async (id) => {
    return fetchWithAuth(`/maintenance/${id}`);
  },

  create: async (maintenanceData) => {
    return fetchWithAuth('/maintenance', {
      method: 'POST',
      body: JSON.stringify(maintenanceData),
    });
  },

  update: async (id, maintenanceData) => {
    return fetchWithAuth(`/maintenance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(maintenanceData),
    });
  },

  delete: async (id) => {
    return fetchWithAuth(`/maintenance/${id}`, {
      method: 'DELETE',
    });
  },
};

// Expense API
export const expenseAPI = {
  getAll: async () => {
    return fetchWithAuth('/expenses');
  },

  getById: async (id) => {
    return fetchWithAuth(`/expenses/${id}`);
  },

  create: async (expenseData) => {
    return fetchWithAuth('/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData),
    });
  },

  update: async (id, expenseData) => {
    return fetchWithAuth(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expenseData),
    });
  },

  delete: async (id) => {
    return fetchWithAuth(`/expenses/${id}`, {
      method: 'DELETE',
    });
  },
};

// Analytics API
export const analyticsAPI = {
  getDashboard: async () => {
    return fetchWithAuth('/analytics/dashboard');
  },

  getAnalytics: async () => {
    return fetchWithAuth('/analytics');
  },

  getVehicleStats: async () => {
    return fetchWithAuth('/analytics/vehicles');
  },

  getDriverStats: async () => {
    return fetchWithAuth('/analytics/drivers');
  },

  getFinancialStats: async () => {
    return fetchWithAuth('/analytics/financial');
  },

  getVehicleROI: async () => {
    return fetchWithAuth('/analytics/vehicle-roi');
  },
};

export default {
  auth: authAPI,
  vehicles: vehicleAPI,
  drivers: driverAPI,
  trips: tripAPI,
  maintenance: maintenanceAPI,
  expenses: expenseAPI,
  analytics: analyticsAPI,
};
