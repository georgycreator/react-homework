export const initialCart = { items: [] };

// Чистая функция: не мутирует state, а возвращает новый объект.
export function cartReducer(state, action) {
  switch (action.type) {
    case "add": {
      const { product } = action; // action.product
      if (!product.inStock) return state;
      const exists = state.items.some((item) => item.id === product.id);
      if (exists) {
        // товар уже в корзине — qty + 1
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item
          ),
        };
      }
      // иначе добавить с qty: 1
      return {
        ...state,
        items: [
          ...state.items,
          { id: product.id, title: product.title, price: product.price, qty: 1 },
        ],
      };
    }
    case "remove": // action.id — убрать товар целиком
      return { ...state, items: state.items.filter((item) => item.id !== action.id) };
    case "clear":
      return initialCart;
    default:
      return state;
  }
}
