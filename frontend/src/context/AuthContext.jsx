import React, { createContext, useState, useContext, useEffect } from 'react'
import { authAPI, userAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  // context/AuthContext.jsx (фрагмент)
useEffect(() => {
  if (token) {
    loadUser()
  } else {
    setLoading(false)
  }
}, [token])

const loadUser = async () => {
  try {
    const response = await userAPI.getProfile()
    setUser(response.data.data || response.data)
  } catch (error) {
    console.error('Failed to load user:', error)
    // Проверяем, что это действительно ошибка авторизации
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
    }
    // Не показываем toast для ошибки загрузки профиля при старте
  } finally {
    setLoading(false)
  }
}

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials)
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)
      
      toast.success('Успешный вход!')
      return { success: true }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка входа')
      return { success: false, error: error.response?.data }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData)
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)
      
      toast.success('Регистрация успешна!')
      return { success: true }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка регистрации')
      console.log(`Error:${error}`);
      return { success: false, error: error.response?.data }
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
      toast.success('Выход выполнен')
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}