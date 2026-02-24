import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { servicesAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const categories = [
  { value: 'education', label: 'Образование' },
  { value: 'music', label: 'Музыка' },
  { value: 'sports', label: 'Спорт' },
  { value: 'languages', label: 'Языки' },
  { value: 'programming', label: 'Программирование' },
  { value: 'art', label: 'Искусство' },
  { value: 'other', label: 'Другое' },
]

const CreateServicePage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'other',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Необходимо авторизоваться')
      navigate('/login')
      return
    }

    if (formData.price < 1) {
      toast.error('Цена должна быть больше 0')
      return
    }

    setLoading(true)
    try {
      await servicesAPI.create(formData)
      toast.success('Объявление успешно создано!')
      navigate('/profile')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка при создании объявления')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Создать новое объявление
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Название услуги *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="Например: Обучение игре на гитаре"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Описание *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows="5"
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              placeholder="Подробно опишите, чему вы можете научить..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Категория *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="input-field"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Цена (коины) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="1"
                value={formData.price}
                onChange={handleChange}
                className="input-field"
                placeholder="100"
              />
            </div>
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
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Создание...' : 'Создать объявление'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateServicePage