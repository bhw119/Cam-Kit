import api from './apiClient';

export const createOrder = async (payload) => {
  const { data } = await api.post('/orders', payload);
  return data;
};

export const fetchMyOrders = async () => {
  const { data } = await api.get('/orders/me');
  return data;
};

export const fetchAllOrders = async () => {
  const { data } = await api.get('/orders');
  return data;
};

export const updateOrderStatus = async (id, payload) => {
  const { data } = await api.patch(`/orders/${id}/status`, payload);
  return data;
};

