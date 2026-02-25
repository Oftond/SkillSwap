import React from 'react'
import ServiceCard from './ServiceCard'

const ServiceList = ({ services }) => {
  if (!services || services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Объявлений не найдено</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  )
}

export default ServiceList