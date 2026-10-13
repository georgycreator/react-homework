import { useMemo, useState } from "react";
import { products } from "./data.js";
import SearchBar from "./components/SearchBar.jsx";
import ProductList from "./components/ProductList.jsx";

export default function App() {
  const [query, setQuery] = useState("");
  const [onlyInStock, setOnlyInStock] = useState(false);

  // список пересчитывается только при смене фильтров
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) => p.title.toLowerCase().includes(q) && (!onlyInStock || p.inStock)
    );
  }, [query, onlyInStock]);

  return (
    <div className="app">
      <h1 className="title">Каталог товаров</h1>
      <SearchBar
        query={query}
        onQueryChange={setQuery}
        onlyInStock={onlyInStock}
        onOnlyInStockChange={setOnlyInStock}
      />
      <div className="status">
        <span>Найдено: {visible.length}</span>
      </div>
      <ProductList products={visible} />
    </div>
  );
}
