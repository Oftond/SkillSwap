import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  HomeIcon, 
  MagnifyingGlassIcon, 
  PlusCircleIcon,
  UserCircleIcon,
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline'

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary-600">SkillSwap</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/" className="nav-link">
              <HomeIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Главная</span>
            </Link>
            
            <Link to="/feed" className="nav-link">
              <MagnifyingGlassIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Лента</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/create-service" className="nav-link">
                  <PlusCircleIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">Создать</span>
                </Link>
                
                <Link to="/profile" className="nav-link">
                  <UserCircleIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">Профиль</span>
                </Link>

                {user && (
                  <div className="hidden md:flex items-center space-x-2 bg-primary-50 px-3 py-1 rounded-full">
                    <CurrencyDollarIcon className="h-5 w-5 text-primary-600" />
                    <span className="font-semibold text-primary-700">
                      {user.balance || 0}
                    </span>
                  </div>
                )}
                
                <Link
                  to="/topup"
                  className="bg-green-500 text-white px-3 py-1 rounded-full text-sm hover:bg-green-600 transition flex items-center space-x-1"
                >
                  <CurrencyDollarIcon className="h-4 w-4" />
                  <span>Пополнить</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm"
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">
                  Войти
                </Link>
                <Link to="/register" className="btn-primary">
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar