import { useCallback, useEffect, useMemo, useReducer } from "react";
import { cartReducer, initialCart } from "../cartReducer.js";

const STORAGE_KEY = "cart";

// Восстановление корзины при загрузке (ленивая инициализация useReducer)
function loadCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(parsed?.items) ? parsed : initialCart;
  } catch {
    return initialCart;
  }
}

// Пользовательский хук: вся логика корзины в одном месте.
export function useCart() {
  const [cart, dispatch] = useReducer(cartReducer, initialCart, loadCart);

  // сохраняем корзину при каждом изменении
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      /* localStorage недоступен — не страшно */
    }
  }, [cart]);

  // add, remove, clear — через useCallback
  const add = useCallback((product) => dispatch({ type: "add", product }), []);
  const remove = useCallback((id) => dispatch({ type: "remove", id }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  // totalCount, totalPrice, qtyById — через useMemo
  const totalCount = useMemo(
    () => cart.items.reduce((sum, i) => sum + i.qty, 0),
    [cart.items]
  );
  const totalPrice = useMemo(
    () => cart.items.reduce((sum, i) => sum + i.qty * i.price, 0),
    [cart.items]
  );
  const qtyById = useMemo(
    () => Object.fromEntries(cart.items.map((i) => [i.id, i.qty])),
    [cart.items]
  );

  return { ...cart, qtyById, totalCount, totalPrice, add, remove, clear };
}
