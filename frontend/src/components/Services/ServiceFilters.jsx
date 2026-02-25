import React, { useState } from 'react'
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { CATEGORIES, SORT_OPTIONS } from '../../utils/constants'

const ServiceFilters = ({ filters, onFilterChange, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || '',
    max: filters.maxPrice || ''
  })

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
    const newPriceRange = { ...priceRange, [type]: value }
    setPriceRange(newPriceRange)
    
    setTimeout(() => {
      onFilterChange({ 
        minPrice: newPriceRange.min, 
        maxPrice: newPriceRange.max 
      })
    }, 500)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setPriceRange({ min: '', max: '' })
    onFilterChange({
      category: '',
      search: '',
      sort: 'newest',
      minPrice: '',
      maxPrice: '',
    })
  }

  const hasActiveFilters = filters.category || filters.search || filters.minPrice || filters.maxPrice

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          placeholder="Поиск объявлений..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10 pr-24"
        />
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
        <button
          type="submit"
          className="absolute right-2 top-2 bg-primary-600 text-white px-4 py-1 rounded-md text-sm hover:bg-primary-700 transition"
        >
          Найти
        </button>
      </form>

      {hasActiveFilters && (
        <div className="flex items-center justify-between bg-primary-50 p-2 rounded-lg">
          <span className="text-sm text-primary-700">Применены фильтры</span>
          <button
            onClick={clearFilters}
            className="text-primary-600 hover:text-primary-800 text-sm flex items-center"
          >
            <XMarkIcon className="h-4 w-4 mr-1" />
            Сбросить все
          </button>
        </div>
      )}

      <button
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden w-full btn-secondary flex items-center justify-center space-x-2"
      >
        <FunnelIcon className="h-5 w-5" />
        <span>{showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}</span>
      </button>

      <div className={`space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
        <div className="card">
          <h3 className="font-semibold mb-4">Категория</h3>
          <select
            value={filters.category}
            onChange={handleCategoryChange}
            className="input-field"
          >
            {CATEGORIES.map(cat => (
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
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4">Цена (коины)</h3>
          <div className="space-y-2">
            <input
              type="number"
              placeholder="От"
              value={priceRange.min}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className="input-field"
              min="0"
            />
            <input
              type="number"
              placeholder="До"
              value={priceRange.max}
              onChange={(e) => handlePriceChange('max', e.target.value)}
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