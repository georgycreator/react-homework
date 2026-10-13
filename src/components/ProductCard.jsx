export default function ProductCard({ product }) {
  return (
    <li className={"card" + (product.inStock ? "" : " card--out")}>
      <div className="card__title">{product.title}</div>
      <div className="card__price">{product.price} ₽</div>
      <div className="card__stock">{product.inStock ? "В наличии" : "Нет в наличии"}</div>
    </li>
  );
}
