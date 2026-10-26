import { useEffect, useRef } from "react";

export default function SearchBar({ query, onQueryChange, onlyInStock, onOnlyInStockChange }) {
  const inputRef = useRef(null);

  // автофокус: при открытии страницы курсор сразу в поле поиска
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className="search-bar">
      <input
        ref={inputRef}
        type="search"
        placeholder="Поиск по названию"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={onlyInStock}
          onChange={(e) => onOnlyInStockChange(e.target.checked)}
        />
        Только в наличии
      </label>
    </div>
  );
}
