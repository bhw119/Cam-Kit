import { format } from '../utils/date';

const OrderList = ({ orders, isAdmin, onChangeStatus }) => {
  if (!orders.length) {
    return <div className="status-message">주문 내역이 없습니다.</div>;
  }

  return (
    <div className="order-list">
      {orders.map((order) => (
        <div key={order._id} className="card">
          <div className="card__content">
            <div className="order-list__header">
              <span className={`order-status order-status--${order.status}`}>
                {statusLabel(order.status)}
              </span>
              <span className="order-list__date">{format(order.createdAt)}</span>
            </div>

            {isAdmin && order.user && (
              <p className="card__text">
                주문자: {order.user.name} ({order.user.email})
              </p>
            )}

            <ul className="order-list__items">
              {order.items.map((item) => (
                <li key={item.product?._id || item.product} className="order-list__item">
                  <span>{item.product?.name ?? '삭제된 상품'}</span>
                  <span>
                    {item.quantity}개 × {item.price.toLocaleString()}원
                  </span>
                </li>
              ))}
            </ul>

            <p className="card__text card__text--bold">
              총 금액: {order.totalPrice.toLocaleString()}원
            </p>
            {order.pickupSlot && <p className="card__text">수령 시간: {order.pickupSlot}</p>}
          </div>

          {isAdmin && (
            <div className="card__actions">
              <select
                value={order.status}
                onChange={(event) => onChangeStatus(order._id, event.target.value)}
              >
                <option value="pending">준비 중</option>
                <option value="ready">수령 준비 완료</option>
                <option value="completed">수령 완료</option>
                <option value="cancelled">취소</option>
              </select>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const statusLabel = (status) => {
  switch (status) {
    case 'pending':
      return '준비 중';
    case 'ready':
      return '수령 준비 완료';
    case 'completed':
      return '완료';
    case 'cancelled':
      return '취소';
    default:
      return status;
  }
};

export default OrderList;

