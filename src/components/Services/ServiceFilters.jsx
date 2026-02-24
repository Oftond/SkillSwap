import React, { useState } from 'react'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'

const categories = [
  { value: '', label: 'Все категории' },
  { value: 'education', label: 'Образование' },
  { value: 'music', label: 'Музыка' },
  { value: 'sports', label: 'Спорт' },
  { value: 'languages', label: 'Языки' },
  { value: 'programming', label: 'Программирование' },
  { value: 'art', label: 'Искусство' },
  { value: 'other', label: 'Другое' },
]

const sortOptions = [
  { value: 'newest', label: 'Сначала новые' },
  { value: 'oldest', label: 'Сначала старые' },
  { value: 'price_asc', label: 'Цена (по возрастанию)' },
  { value: 'price_desc', label: 'Цена (по убыванию)' },
]

const ServiceFilters = ({ filters, onFilterChange, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  const handleCategoryChange = (e) => {
    onFilterChange({ category: e.target.value })
  }

  const handleSortChange = (e) => {
    onFilterChange({ sort: e.target.value })
  }

  const handlePriceChange = (type, value) => {
    onFilterChange({ [type]: value })
  }

  const clearFilters = () => {
    onFilterChange({
      category: '',
      search: '',
      sort: 'newest',
      minPrice: '',
      maxPrice: '',
    })
    setSearchTerm('')
  }

  return (
    <div className="space-y-4">
      {/* Поиск */}
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          placeholder="Поиск объявлений..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
        <button
          type="submit"
          className="absolute right-2 top-2 btn-primary text-sm py-1"
        >
          Найти
        </button>
      </form>

      {/* Кнопка фильтров для мобильных */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden w-full btn-secondary flex items-center justify-center space-x-2"
      >
        <FunnelIcon className="h-5 w-5" />
        <span>Фильтры</span>
      </button>

      {/* Фильтры */}
      <div className={`space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
        <div className="card">
          <h3 className="font-semibold mb-4">Категория</h3>
          <select
            value={filters.category}
            onChange={handleCategoryChange}
            className="input-field"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4">Сортировка</h3>
          <select
            value={filters.sort}
            onChange={handleSortChange}
            className="input-field"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4">Цена</h3>
          <div className="space-y-2">
            <input
              type="number"
              placeholder="Мин. цена"
              value={filters.minPrice}
              onChange={(e) => handlePriceChange('minPrice', e.target.value)}
              className="input-field"
              min="0"
            />
            <input
              type="number"
              placeholder="Макс. цена"
              value={filters.maxPrice}
              onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
              className="input-field"
              min="0"
            />
          </div>
        </div>

        <button
          onClick={clearFilters}
          className="w-full btn-secondary"
        >
          Сбросить фильтры
        </button>
      </div>
    </div>
  )
}

export default ServiceFilters