import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 인증 만료 시 전역으로 처리할 수 있도록 에러를 그대로 전달
      console.warn('인증이 만료되었거나 권한이 없습니다.');
    }
    return Promise.reject(error);
  }
);

export default api;

