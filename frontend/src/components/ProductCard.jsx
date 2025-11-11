const ProductCard = ({ product, onEdit, onDelete, isAdmin }) => (
  <div className="card">
    <div className="card__content">
      <h3 className="card__title">{product.name}</h3>
      <p className="card__text">가격: {product.price.toLocaleString()}원</p>
      <p className="card__text">남은 수량: {product.quantity}개</p>
      {product.description && <p className="card__text">{product.description}</p>}
    </div>

    {isAdmin && (
      <div className="card__actions">
        <button type="button" className="button button--secondary" onClick={() => onEdit(product)}>
          수정
        </button>
        <button
          type="button"
          className="button button--danger"
          onClick={() => onDelete(product._id)}
        >
          삭제
        </button>
      </div>
    )}
  </div>
);

export default ProductCard;

