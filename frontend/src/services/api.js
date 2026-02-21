// API Base Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://odoo2026-hackathon.onrender.com/api';

console.log('🔗 API Base URL:', API_BASE_URL);

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

// Helper function to make authenticated requests with retry logic
const fetchWithAuth = async (url, options = {}, retries = 2) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
      mode: 'cors',
      credentials: 'include',
    });

    return handleResponse(response);
  } catch (error) {
    // Retry logic for network errors
    if (retries > 0 && (error.name === 'TypeError' || error.message.includes('Failed to fetch'))) {
      console.warn(`Retrying request to ${url}... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      return fetchWithAuth(url, options, retries - 1);
    }
    
    // Handle CORS errors
    if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to server. Please check your internet connection or try again later.');
    }
    
    throw error;
  }
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

  complete: async (id) => {
    return fetchWithAuth(`/maintenance/${id}/complete`, {
      method: 'PUT',
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
