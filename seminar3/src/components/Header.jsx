export default function Header({ totalCount, totalPrice, onClear }) {
  return (
    <header className="header">
      <h1>Каталог товаров</h1>
      <div className="header__cart">
        <span>
          Корзина: {totalCount} шт. · {totalPrice.toLocaleString("ru-RU")} ₽
        </span>
        <button className="ghost" onClick={onClear} disabled={totalCount === 0}>
          Очистить
        </button>
      </div>
    </header>
  );
}
