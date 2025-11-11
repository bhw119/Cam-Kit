import { create } from 'zustand';
import { login as loginApi, logout as logoutApi, fetchProfile } from '../services/authService';

const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,
  isAdmin: false,
  setUser: (user) =>
    set({
      user,
      isAdmin: Boolean(user?.isAdmin),
    }),
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const { user } = await loginApi(credentials);
      set({ user, loading: false, isAdmin: Boolean(user?.isAdmin) });
      return user;
    } catch (error) {
      const message = error.response?.data?.message || '로그인에 실패했습니다.';
      set({ error: message, loading: false });
      throw error;
    }
  },
  logout: async () => {
    set({ loading: true, error: null });
    try {
      await logoutApi();
      set({ user: null, loading: false, isAdmin: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  loadProfile: async () => {
    set({ loading: true, error: null });
    try {
      const { user } = await fetchProfile();
      set({ user, loading: false, isAdmin: Boolean(user?.isAdmin) });
    } catch (error) {
      set({ loading: false });
      if (error.response?.status === 401) {
        set({ user: null, isAdmin: false });
      } else {
        set({ error: '프로필 정보를 불러오지 못했습니다.' });
      }
    }
  },
}));

export default useAuthStore;

