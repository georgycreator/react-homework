import ProductCard from "./ProductCard.jsx";

export default function ProductList({ products, qtyById, onAdd, onRemove }) {
  return (
    <ul className="list">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          qty={qtyById[p.id] ?? 0}
          onAdd={onAdd}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
}
