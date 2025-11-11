import { create } from 'zustand';
import {
  fetchProducts,
  createProduct as createProductApi,
  updateProduct as updateProductApi,
  deleteProduct as deleteProductApi,
} from '../services/productService';

const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const { products } = await fetchProducts();
      set({ products, loading: false });
    } catch (error) {
      const message = error.response?.data?.message || '상품 목록을 불러오지 못했습니다.';
      set({ error: message, loading: false });
    }
  },
  createProduct: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { product } = await createProductApi(payload);
      set({ products: [product, ...get().products], loading: false });
      return product;
    } catch (error) {
      const message = error.response?.data?.message || '상품 등록에 실패했습니다.';
      set({ error: message, loading: false });
      throw error;
    }
  },
  updateProduct: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const { product } = await updateProductApi(id, payload);
      set({
        products: get().products.map((item) => (item._id === id ? product : item)),
        loading: false,
      });
      return product;
    } catch (error) {
      const message = error.response?.data?.message || '상품 수정에 실패했습니다.';
      set({ error: message, loading: false });
      throw error;
    }
  },
  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteProductApi(id);
      set({
        products: get().products.filter((item) => item._id !== id),
        loading: false,
      });
    } catch (error) {
      const message = error.response?.data?.message || '상품 삭제에 실패했습니다.';
      set({ error: message, loading: false });
      throw error;
    }
  },
}));

export default useProductStore;

