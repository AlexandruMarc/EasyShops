import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  withCredentials: true, // ensures cookies are sent automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: If a token is available in document.cookie, attach it
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

apiClient.interceptors.request.use(
  (config) => {
    const token = getCookie('token');
    // Even though the token may not be visible (if HttpOnly,
    //  can be choosed not to attach it.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Deal with specific error responses here if needed decomment this line
    // console.error('API Client error:', error);
    return Promise.reject(error);
  },
);

export default apiClient;
