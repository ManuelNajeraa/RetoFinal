
import axios from 'axios';
import { getToken } from './auth';

axios.interceptors.request.use(
  config => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401 || error.response.status === 403) {
      // Redirigir a la página de inicio de sesión
      window.location.href = 'frontend/src/Web/admin-login.html'; 
    }
    return Promise.reject(error);
  }
);