export default function ProductCard({ product, qty, onAdd, onRemove }) {
  return (
    <li className={"card" + (product.inStock ? "" : " card--out")}>
      <div className="card__title">{product.title}</div>
      <div className="card__price">{product.price} ₽</div>
      <div className="card__stock">{product.inStock ? "В наличии" : "Нет в наличии"}</div>
      <div className="card__actions">
        {/* нет в наличии — кнопка неактивна */}
        <button onClick={() => onAdd(product)} disabled={!product.inStock}>
          В корзину
        </button>
        {qty > 0 && (
          <>
            <span className="card__in-cart">В корзине: {qty}</span>
            <button className="ghost" onClick={() => onRemove(product.id)}>
              Убрать
            </button>
          </>
        )}
      </div>
    </li>
  );
}
