import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { servicesAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/UI/Loader'
import { CurrencyDollarIcon, UserIcon, CalendarIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const ServiceDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    fetchService()
  }, [id])

  const fetchService = async () => {
    try {
      setLoading(true)
      const response = await servicesAPI.getById(id)
      setService(response.data.data || response.data)
    } catch (error) {
      toast.error('Ошибка загрузки объявления')
      navigate('/feed')
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      toast.error('Необходимо авторизоваться')
      navigate('/login')
      return
    }

    if (user.id === service.user_id) {
      toast.error('Нельзя купить свою услугу')
      return
    }

    if (user.balance < service.price) {
      toast.error('Недостаточно коинов на балансе')
      return
    }

    if (!window.confirm(`Вы уверены, что хотите купить услугу "${service.title}" за ${service.price} коинов?`)) {
      return
    }

    setPurchasing(true)
    try {
      await servicesAPI.purchase(id)
      toast.success('Услуга успешно приобретена!')
      navigate('/profile')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка при покупке')
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return <Loader />
  }

  if (!service) {
    return null
  }

  const isOwner = user && user.id === service.user_id

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card">
        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-4">
            {service.category_name || service.category}
          </span>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {service.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-gray-500 mb-6">
            <div className="flex items-center space-x-2">
              <UserIcon className="h-5 w-5" />
              <span>{service.user?.name || 'Пользователь'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <span>{new Date(service.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="prose max-w-none mb-8">
          <h3 className="text-lg font-semibold mb-2">Описание:</h3>
          <p className="text-gray-700 whitespace-pre-line">
            {service.description}
          </p>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <CurrencyDollarIcon className="h-8 w-8 text-primary-600" />
              <div>
                <p className="text-sm text-gray-500">Стоимость</p>
                <p className="text-2xl font-bold text-primary-600">
                  {service.price} коинов
                </p>
              </div>
            </div>

            {!isOwner ? (
              <button
                onClick={handlePurchase}
                disabled={purchasing}
                className="btn-primary text-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                {purchasing ? 'Обработка...' : 'Купить услугу'}
              </button>
            ) : (
              <div className="bg-gray-100 px-6 py-3 rounded-lg w-full sm:w-auto text-center">
                <p className="text-gray-600">Это ваше объявление</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceDetailPage