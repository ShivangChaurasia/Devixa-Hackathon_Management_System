const BASE_URL = 'http://localhost:5000/api/v1';

export class ApiError extends Error {
  constructor(status, message, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('accessToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 401 && endpoint !== '/auth/login' && endpoint !== '/auth/refresh') {
        // Attempt token refresh
        const refreshed = await refreshTokens();
        if (refreshed) {
          // Retry original request with new token
          headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
          const retryResponse = await fetch(`${BASE_URL}${endpoint}`, { ...config, headers });
          const retryData = await retryResponse.json().catch(() => null);
          if (!retryResponse.ok) throw new ApiError(retryResponse.status, retryData?.message || 'Request failed', retryData);
          return retryData?.data || retryData;
        } else {
          // Logout user if refresh failed
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new ApiError(401, 'Session expired. Please login again.');
        }
      }
      throw new ApiError(response.status, data?.message || 'Request failed', data);
    }

    return data?.data || data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, error.message || 'Network error occurred');
  }
}

async function refreshTokens() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    const data = await response.json();
    
    if (response.ok && data.success) {
      localStorage.setItem('accessToken', data.data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
}

export const apiClient = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, data, options) => request(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data, options) => request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),
  patch: (endpoint, data, options) => request(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(data) }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
};
