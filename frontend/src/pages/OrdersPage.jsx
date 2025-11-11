import { useEffect } from 'react';
import useOrderStore from '../store/orderStore';
import useAuthStore from '../store/authStore';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';
import OrderList from '../components/OrderList';

const OrdersPage = () => {
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const orders = useOrderStore((state) => state.orders);
  const loading = useOrderStore((state) => state.loading);
  const error = useOrderStore((state) => state.error);
  const fetchMine = useOrderStore((state) => state.fetchMine);
  const fetchAll = useOrderStore((state) => state.fetchAll);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);

  useEffect(() => {
    if (isAdmin) {
      fetchAll();
    } else {
      fetchMine();
    }
  }, [isAdmin, fetchAll, fetchMine]);

  const handleChangeStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, { status });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="page">
      <div className="page__header">
        <h1>주문 내역</h1>
        <p className="page__subtitle">
          {isAdmin ? '전체 주문을 관리하고 상태를 업데이트하세요.' : '최근 주문 기록을 확인하세요.'}
        </p>
      </div>

      <ErrorAlert message={error} />

      {loading ? (
        <Loader />
      ) : (
        <OrderList orders={orders} isAdmin={isAdmin} onChangeStatus={handleChangeStatus} />
      )}
    </section>
  );
};

export default OrdersPage;

