import React from 'react'
import { Link } from 'react-router-dom'
import { CurrencyDollarIcon, UserIcon } from '@heroicons/react/24/outline'

const ServiceCard = ({ service }) => {
  const categoryColors = {
    education: 'bg-blue-100 text-blue-800',
    music: 'bg-purple-100 text-purple-800',
    sports: 'bg-green-100 text-green-800',
    languages: 'bg-yellow-100 text-yellow-800',
    programming: 'bg-red-100 text-red-800',
    art: 'bg-pink-100 text-pink-800',
    other: 'bg-gray-100 text-gray-800',
  }

  const categoryNames = {
    education: 'Образование',
    music: 'Музыка',
    sports: 'Спорт',
    languages: 'Языки',
    programming: 'Программирование',
    art: 'Искусство',
    other: 'Другое',
  }

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[service.category] || categoryColors.other}`}>
          {categoryNames[service.category] || service.category}
        </span>
        <div className="flex items-center space-x-1 text-primary-600">
          <CurrencyDollarIcon className="h-5 w-5" />
          <span className="font-bold">{service.price}</span>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-gray-500">
          <UserIcon className="h-4 w-4" />
          <span className="text-sm">{service.user?.name || 'Пользователь'}</span>
        </div>
        
        <Link 
          to={`/service/${service.id}`} 
          className="btn-primary text-sm"
        >
          Подробнее
        </Link>
      </div>
    </div>
  )
}

export default ServiceCard