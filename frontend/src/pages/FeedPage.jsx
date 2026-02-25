// pages/FeedPage.jsx
import React, { useState, useEffect } from 'react'
import ServiceList from '../components/Services/ServiceList'
import ServiceFilters from '../components/Services/ServiceFilters'
import { servicesAPI } from '../services/api'
import Loader from '../components/UI/Loader'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const FeedPage = () => {
  const { isAuthenticated } = useAuth() // Добавляем проверку авторизации
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    sort: 'newest',
    minPrice: '',
    maxPrice: '',
  })

  useEffect(() => {
    // Загружаем объявления только если пользователь авторизован
    if (isAuthenticated) {
      fetchServices()
    } else {
      setLoading(false)
      setServices([])
    }
  }, [filters, isAuthenticated])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await servicesAPI.getAll(filters)
      setServices(response.data.data || response.data)
    } catch (error) {
      if (error.response?.status !== 401) { // Не показываем ошибку для 401
        toast.error('Ошибка загрузки объявлений')
      }
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters })
  }

  const handleSearch = (searchTerm) => {
    setFilters({ ...filters, search: searchTerm })
  }

  // Показываем сообщение для неавторизованных пользователей
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Лента объявлений
        </h1>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            Для просмотра объявлений необходимо авторизоваться
          </p>
          <a href="/login" className="btn-primary">
            Войти
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Лента объявлений
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <ServiceFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
          />
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <Loader />
          ) : (
            <ServiceList services={services} />
          )}
        </div>
      </div>
    </div>
  )
}

export default FeedPage