// pages/TopUpPage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { userAPI } from '../services/api'
import { CurrencyDollarIcon, CreditCardIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const TopUpPage = () => {
  const navigate = useNavigate()
  const { user, loadUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card')

  const predefinedAmounts = [100, 500, 1000, 5000]

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!amount || amount < 1) {
      toast.error('Введите корректную сумму')
      return
    }

    setLoading(true)
    try {
      // Здесь будет запрос к API для создания платежа
      const response = await userAPI.topUpBalance({
        amount: parseInt(amount),
        payment_method: paymentMethod
      })
      
      // Если API возвращает ссылку на платежную систему, перенаправляем
      if (response.data.payment_url) {
        window.location.href = response.data.payment_url
      } else {
        // Или просто обновляем баланс (для демо)
        toast.success('Баланс успешно пополнен!')
        await loadUser() // Перезагружаем данные пользователя
        navigate('/profile')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка при пополнении баланса')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Пополнение баланса
          </h1>
          <p className="text-gray-600">
            Текущий баланс: <span className="font-bold text-primary-600">{user?.balance || 0}</span> коинов
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Быстрый выбор суммы</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {predefinedAmounts.map((value) => (
              <button
                key={value}
                onClick={() => setAmount(value.toString())}
                className={`p-4 border-2 rounded-lg text-center transition ${
                  amount === value.toString()
                    ? 'border-primary-600 bg-primary-50 text-primary-600'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <CurrencyDollarIcon className="h-6 w-6 mx-auto mb-2" />
                <span className="font-bold">{value}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Сумма пополнения (коины)
            </label>
            <input
              type="number"
              id="amount"
              min="1"
              step="1"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field"
              placeholder="Введите сумму"
            />
            <p className="mt-1 text-sm text-gray-500">
              1 коин = 1₽ (примерный курс)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Способ оплаты
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4w-4 text-primary-600"
                />
                <CreditCardIcon className="h-5 w-5 text-gray-400" />
                <span>Банковская карта</span>
              </label>
              
              <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="sbp"
                  checked={paymentMethod === 'sbp'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-primary-600"
                />
                <span className="text-lg">🏦</span>
                <span>СБП (Система быстрых платежей)</span>
              </label>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Как это работает?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• После оплаты коины сразу поступят на ваш счет</li>
              <li>• Коинами можно оплачивать услуги других пользователей</li>
              <li>• Коины не подлежат обратному обмену на реальные деньги</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? 'Обработка...' : 'Пополнить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TopUpPage