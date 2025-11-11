import { create } from 'zustand';
import {
  createOrder as createOrderApi,
  fetchMyOrders,
  fetchAllOrders,
  updateOrderStatus as updateOrderStatusApi,
} from '../services/orderService';

const useOrderStore = create((set, get) => ({
  orders: [],
  loading: false,
  error: null,
  fetchMine: async () => {
    set({ loading: true, error: null });
    try {
      const { orders } = await fetchMyOrders();
      set({ orders, loading: false });
    } catch (error) {
      const message = error.response?.data?.message || '주문 목록을 불러오지 못했습니다.';
      set({ error: message, loading: false });
    }
  },
  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const { orders } = await fetchAllOrders();
      set({ orders, loading: false });
    } catch (error) {
      const message = error.response?.data?.message || '주문 목록을 불러오지 못했습니다.';
      set({ error: message, loading: false });
    }
  },
  createOrder: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { order } = await createOrderApi(payload);
      set({ orders: [order, ...get().orders], loading: false });
      return order;
    } catch (error) {
      const message = error.response?.data?.message || '주문에 실패했습니다.';
      set({ error: message, loading: false });
      throw error;
    }
  },
  updateOrderStatus: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const { order } = await updateOrderStatusApi(id, payload);
      set({
        orders: get().orders.map((item) => (item._id === id ? order : item)),
        loading: false,
      });
      return order;
    } catch (error) {
      const message = error.response?.data?.message || '주문 상태 변경에 실패했습니다.';
      set({ error: message, loading: false });
      throw error;
    }
  },
}));

export default useOrderStore;

