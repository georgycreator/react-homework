import ProductCard from "./ProductCard.jsx";

export default function ProductList({ products }) {
  return (
    <ul className="list">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </ul>
  );
}
