import { Search } from 'lucide-react'

export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search',
  ariaLabel = 'Search',
  className = '',
}) {
  return (
    <label className={`directory-search search-bar ${className}`.trim()}>
      <Search size={18} />
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
      {value && onClear && (
        <button onClick={onClear} aria-label="Clear search">
          ×
        </button>
      )}
    </label>
  )
}
