import { useEffect, useState } from 'react';
import useProductStore from '../store/productStore';
import useOrderStore from '../store/orderStore';
import useAuthStore from '../store/authStore';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';

const ProductsPage = () => {
  const products = useProductStore((state) => state.products);
  const productsLoading = useProductStore((state) => state.loading);
  const productsError = useProductStore((state) => state.error);
  const fetchAll = useProductStore((state) => state.fetchAll);
  const createProduct = useProductStore((state) => state.createProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const createOrder = useOrderStore((state) => state.createOrder);
  const ordersLoading = useOrderStore((state) => state.loading);
  const ordersError = useOrderStore((state) => state.error);
  const isAdmin = useAuthStore((state) => state.isAdmin);

  const [editingProduct, setEditingProduct] = useState(null);
  const [orderForm, setOrderForm] = useState({ productId: '', quantity: 1, pickupSlot: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleCreateOrUpdateProduct = async (payload) => {
    try {
      setLocalError(null);
      setSuccessMessage('');
      if (editingProduct) {
        await updateProduct(editingProduct._id, payload);
        setEditingProduct(null);
      } else {
        await createProduct(payload);
      }
      setSuccessMessage('상품 정보가 저장되었습니다.');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('상품을 삭제하시겠습니까?')) return;
    try {
      await deleteProduct(id);
      setSuccessMessage('상품이 삭제되었습니다.');
    } catch (error) {
      console.error(error);
    }
  };

  const handleOrderFormChange = (event) => {
    const { name, value } = event.target;
    setOrderForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateOrder = async (event) => {
    event.preventDefault();
    if (!orderForm.productId) return;
    const selectedProduct = products.find((product) => product._id === orderForm.productId);
    if (!selectedProduct) {
      setLocalError('선택한 상품을 찾을 수 없습니다.');
      setSuccessMessage('');
      return;
    }
    if (Number(orderForm.quantity) > selectedProduct.quantity) {
      setLocalError('주문 수량이 현재 재고보다 많습니다.');
      setSuccessMessage('');
      return;
    }
    try {
      setLocalError(null);
      await createOrder({
        items: [
          {
            productId: orderForm.productId,
            quantity: Number(orderForm.quantity),
          },
        ],
        pickupSlot: orderForm.pickupSlot,
      });
      setOrderForm({ productId: '', quantity: 1, pickupSlot: '' });
      setSuccessMessage('주문이 생성되었습니다. 주문 내역에서 확인하세요.');
      await fetchAll();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="page">
      <div className="page__header">
        <h1>오늘의 공동구매 상품</h1>
        <p className="page__subtitle">
          판매 목록과 수량을 확인하고 바로 주문하세요. 재고는 실시간으로 반영됩니다.
        </p>
      </div>

      <ErrorAlert message={localError || productsError || ordersError} />
      {successMessage && <div className="alert alert--success">{successMessage}</div>}

      {isAdmin && (
        <div className="panel">
          <div className="panel__header">
            <h2>{editingProduct ? '상품 수정' : '상품 등록'}</h2>
          </div>
          <ProductForm
            editingProduct={editingProduct}
            onSubmit={handleCreateOrUpdateProduct}
            onCancel={() => setEditingProduct(null)}
          />
        </div>
      )}

      {productsLoading ? (
        <Loader />
      ) : (
        <div className="grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              isAdmin={isAdmin}
              onEdit={setEditingProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      )}

      {!isAdmin && (
        <div className="panel panel--order">
          <div className="panel__header">
            <h2>바로 주문하기</h2>
          </div>
          <form className="form form--inline" onSubmit={handleCreateOrder}>
            <div className="form__group">
              <label htmlFor="productId">상품 선택</label>
              <select
                id="productId"
                name="productId"
                value={orderForm.productId}
                onChange={handleOrderFormChange}
                required
              >
                <option value="">상품을 선택하세요</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} (재고 {product.quantity}개)
                  </option>
                ))}
              </select>
            </div>

            <div className="form__group">
              <label htmlFor="quantity">수량</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                value={orderForm.quantity}
                onChange={handleOrderFormChange}
                required
              />
            </div>

            <div className="form__group">
              <label htmlFor="pickupSlot">수령 시간대 (선택)</label>
              <input
                id="pickupSlot"
                name="pickupSlot"
                value={orderForm.pickupSlot}
                onChange={handleOrderFormChange}
                placeholder="예: 18:00~19:00"
              />
            </div>

            <button
              type="submit"
              className="button button--primary"
              disabled={ordersLoading || !products.length}
            >
              {ordersLoading ? '주문 처리 중...' : '주문하기'}
            </button>
          </form>
        </div>
      )}
    </section>
  );
};

export default ProductsPage;

