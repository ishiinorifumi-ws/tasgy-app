import { CATEGORY_LABELS } from '../utils/labels'

function FilterSort({ categoryFilter, onCategoryChange, sortBy, onSortChange }) {
  return (
    <div className="flex gap-2 px-3 py-2 bg-white border-b border-gray-100">
      <select
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-2 bg-white text-gray-700"
      >
        <option value="all">カテゴリ: 全て</option>
        {CATEGORY_LABELS.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-2 bg-white text-gray-700"
      >
        <option value="created">作成日順</option>
        <option value="deadline">期限順</option>
        <option value="category">カテゴリ順</option>
      </select>
    </div>
  )
}

export default FilterSort
