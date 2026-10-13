import { useMemo, useReducer, useState } from "react";
import { products } from "./data.js";
import { cartReducer, initialCart } from "./cartReducer.js";
import Header from "./components/Header.jsx";
import SearchBar from "./components/SearchBar.jsx";
import ProductList from "./components/ProductList.jsx";

export default function App() {
  const [query, setQuery] = useState("");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [cart, dispatch] = useReducer(cartReducer, initialCart);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) => p.title.toLowerCase().includes(q) && (!onlyInStock || p.inStock)
    );
  }, [query, onlyInStock]);

  // производные данные корзины
  const totalCount = cart.items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.items.reduce((sum, i) => sum + i.qty * i.price, 0);
  const qtyById = {};
  for (const i of cart.items) qtyById[i.id] = i.qty;

  return (
    <div className="app">
      <Header
        totalCount={totalCount}
        totalPrice={totalPrice}
        onClear={() => dispatch({ type: "clear" })}
      />
      <SearchBar
        query={query}
        onQueryChange={setQuery}
        onlyInStock={onlyInStock}
        onOnlyInStockChange={setOnlyInStock}
      />
      <div className="status">
        <span>Найдено: {visible.length}</span>
      </div>
      <ProductList
        products={visible}
        qtyById={qtyById}
        onAdd={(product) => dispatch({ type: "add", product })}
        onRemove={(id) => dispatch({ type: "remove", id })}
      />
    </div>
  );
}
