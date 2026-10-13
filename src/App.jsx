import { useCallback, useMemo, useReducer, useState } from "react";
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

  // 2. Стабильные обработчики (dispatch не меняется → зависимости пустые)
  const onAdd = useCallback((product) => dispatch({ type: "add", product }), []);
  const onRemove = useCallback((id) => dispatch({ type: "remove", id }), []);
  const onClear = useCallback(() => dispatch({ type: "clear" }), []);

  const totalCount = useMemo(
    () => cart.items.reduce((sum, i) => sum + i.qty, 0),
    [cart.items]
  );
  const totalPrice = useMemo(
    () => cart.items.reduce((sum, i) => sum + i.qty * i.price, 0),
    [cart.items]
  );

  // 3. В карточку передаём только нужное ей число, а не весь cart:
  // cart — новый объект после каждого dispatch и сломал бы memo.
  // qtyById = { [id]: qty } — useMemo от cart.items
  const qtyById = useMemo(
    () => Object.fromEntries(cart.items.map((i) => [i.id, i.qty])),
    [cart.items]
  );

  return (
    <div className="app">
      <Header totalCount={totalCount} totalPrice={totalPrice} onClear={onClear} />
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
        onAdd={onAdd}
        onRemove={onRemove}
      />
    </div>
  );
}
