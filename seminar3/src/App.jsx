import { useCallback, useMemo, useState, useTransition } from "react";
import { products } from "./data.js";
import { useCart } from "./hooks/useCart.js";
import Header from "./components/Header.jsx";
import SearchBar from "./components/SearchBar.jsx";
import ProductList from "./components/ProductList.jsx";

export default function App() {
  const [query, setQuery] = useState(""); // поле ввода — обновляется сразу
  const [filter, setFilter] = useState(""); // для списка — через transition
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [isPending, startTransition] = useTransition();

  // в App нет useReducer — только useCart()
  const { qtyById, totalCount, totalPrice, add, remove, clear } = useCart();

  const handleSearch = useCallback((value) => {
    setQuery(value); // срочное обновление: буквы появляются без задержки
    startTransition(() => setFilter(value)); // несрочное: пересчёт списка
  }, []);

  // useMemo из шага 1 теперь зависит от filter, а не от query
  const visible = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return products.filter(
      (p) => p.title.toLowerCase().includes(q) && (!onlyInStock || p.inStock)
    );
  }, [filter, onlyInStock]);

  return (
    <div className="app">
      <Header totalCount={totalCount} totalPrice={totalPrice} onClear={clear} />
      <SearchBar
        query={query}
        onQueryChange={handleSearch}
        onlyInStock={onlyInStock}
        onOnlyInStockChange={setOnlyInStock}
      />
      <div className="status">
        <span>Найдено: {visible.length}</span>
        {isPending && <span className="status__pending">Обновляю список…</span>}
      </div>
      <div className={"list-wrap" + (isPending ? " list-wrap--pending" : "")}>
        <ProductList
          products={visible}
          qtyById={qtyById}
          onAdd={add}
          onRemove={remove}
        />
      </div>
    </div>
  );
}
