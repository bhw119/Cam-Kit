import { useEffect, useState } from 'react';

const initialState = {
  name: '',
  price: '',
  quantity: '',
  description: '',
};

const ProductForm = ({ editingProduct, onSubmit, onCancel }) => {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name,
        price: editingProduct.price,
        quantity: editingProduct.quantity,
        description: editingProduct.description || '',
      });
    } else {
      setForm(initialState);
    }
  }, [editingProduct]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form__group">
        <label htmlFor="name">상품명</label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form__group">
        <label htmlFor="price">가격(원)</label>
        <input
          id="price"
          name="price"
          type="number"
          min="0"
          value={form.price}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form__group">
        <label htmlFor="quantity">수량(개)</label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          min="0"
          value={form.quantity}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form__group">
        <label htmlFor="description">설명</label>
        <textarea
          id="description"
          name="description"
          rows="3"
          value={form.description}
          onChange={handleChange}
        />
      </div>
      <div className="form__actions">
        {editingProduct && (
          <button type="button" className="button button--secondary" onClick={onCancel}>
            취소
          </button>
        )}
        <button type="submit" className="button button--primary">
          {editingProduct ? '상품 수정' : '상품 추가'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;

