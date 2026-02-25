import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  AcademicCapIcon, 
  MusicalNoteIcon, 
  CodeBracketIcon,
  LanguageIcon,
  PaintBrushIcon,
  TrophyIcon 
} from '@heroicons/react/24/outline'

const HomePage = () => {
  const { isAuthenticated } = useAuth()

  const features = [
    { icon: AcademicCapIcon, title: 'Образование', description: 'Делитесь знаниями в математике, физике и других науках' },
    { icon: MusicalNoteIcon, title: 'Музыка', description: 'Учите и учитесь играть на музыкальных инструментах' },
    { icon: CodeBracketIcon, title: 'Программирование', description: 'Обменивайтесь опытом в разработке' },
    { icon: LanguageIcon, title: 'Языки', description: 'Практикуйте иностранные языки с носителями' },
    { icon: PaintBrushIcon, title: 'Искусство', description: 'Рисование, фотография, дизайн' },
    { icon: TrophyIcon, title: 'Спорт', description: 'Тренировки и спортивные навыки' },
  ]

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            SkillSwap
          </h1>
          <p className="text-2xl mb-8">
            Обменивайтесь навыками с помощью виртуальной валюты
          </p>
          <p className="text-xl mb-12 text-primary-100">
            Научись играть на гитаре ➔ Объясни производные ➔ Получи коины
          </p>
          
          {!isAuthenticated && (
            <div className="space-x-4">
              <Link to="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200">
                Начать обмен
              </Link>
              <Link to="/feed" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition duration-200">
                Смотреть объявления
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Чем можно делиться?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center hover:shadow-lg transition duration-300">
                <feature.icon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Как это работает?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Создайте объявление</h3>
              <p className="text-gray-600">Расскажите, чему вы можете научить других</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Найдите интересующий навык</h3>
              <p className="text-gray-600">Просматривайте объявления других пользователей</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Обменивайтесь знаниями</h3>
              <p className="text-gray-600">Используйте коины для оплаты и получения навыков</p>
            </div>
          </div>
        </div>
      </section>

      {!isAuthenticated && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Готовы начать?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Присоединяйтесь к сообществу SkillSwap прямо сейчас!
            </p>
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Создать аккаунт
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}

export default HomePage