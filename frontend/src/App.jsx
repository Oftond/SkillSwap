import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout/Layout'
import HomePage from './pages/HomePage'
import FeedPage from './pages/FeedPage'
import ProfilePage from './pages/ProfilePage'
import CreateServicePage from './pages/CreateServicePage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />
}

// App.jsx (фрагмент)
function AppContent() {
  const { isAuthenticated } = useAuth()
  
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/feed" 
          element={
            <PrivateRoute>
              <FeedPage />
            </PrivateRoute>
          } 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/create-service" 
          element={
            <PrivateRoute>
              <CreateServicePage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/service/:id" 
          element={
            <PrivateRoute>
              <ServiceDetailPage />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Layout>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App