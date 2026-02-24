import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { userAPI, servicesAPI } from '../services/api'
import ServiceCard from '../components/Services/ServiceCard'
import Loader from '../components/UI/Loader'
import { CurrencyDollarIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  const { user } = useAuth()
  const [userServices, setUserServices] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('services')

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const [servicesRes, transactionsRes] = await Promise.all([
        userAPI.getUserServices(),
        userAPI.getUserTransactions(),
      ])
      
      setUserServices(servicesRes.data.data || servicesRes.data)
      setTransactions(transactionsRes.data.data || transactionsRes.data)
    } catch (error) {
      toast.error('Ошибка загрузки данных профиля')
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Вы уверены, что хотите удалить это объявление?')) {
      try {
        await servicesAPI.delete(serviceId)
        setUserServices(userServices.filter(s => s.id !== serviceId))
        toast.success('Объявление удалено')
      } catch (error) {
        toast.error('Ошибка при удалении')
      }
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Информация о пользователе */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user?.name}
            </h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>
          
          <div className="bg-primary-50 px-6 py-4 rounded-lg">
            <div className="flex items-center space-x-2 text-primary-600">
              <CurrencyDollarIcon className="h-8 w-8" />
              <div>
                <p className="text-sm text-primary-600">Баланс</p>
                <p className="text-2xl font-bold">{user?.balance || 0} коинов</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Табы */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('services')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'services'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Мои объявления ({userServices.length})
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'transactions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            История операций
          </button>
        </nav>
      </div>

      {/* Контент табов */}
      {activeTab === 'services' && (
        <div>
          {userServices.length === 0 ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">У вас пока нет объявлений</p>
              <a href="/create-service" className="btn-primary">
                Создать объявление
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userServices.map((service) => (
                <div key={service.id} className="relative">
                  <ServiceCard service={service} />
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="card overflow-x-auto">
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">История операций пуста</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Тип
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Сумма
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Описание
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.type === 'credit' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type === 'credit' ? 'Зачисление' : 'Списание'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                        {transaction.type === 'credit' ? '+' : '-'}{transaction.amount} коинов
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

export default ProfilePage