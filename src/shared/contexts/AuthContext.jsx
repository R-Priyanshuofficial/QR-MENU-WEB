import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api/endpoints'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is already logged in on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (token) {
        // Check if it's a mock token
        if (token.startsWith('mock-jwt-token')) {
          // Use mock user data
          const mockUser = {
            id: '1',
            name: 'Demo Admin',
            email: 'demo@example.com',
            restaurantName: 'Demo Restaurant',
          }
          setUser(mockUser)
          setIsAuthenticated(true)
        } else {
          // Fetch user from actual API
          const response = await authAPI.getMe()
          setUser(response.data.user)
          setIsAuthenticated(true)
        }
      }
    } catch (error) {
      localStorage.removeItem('auth_token')
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      // Call actual backend API
      const response = await authAPI.login(credentials)
      
      // Store token and user data
      localStorage.setItem('auth_token', response.data.token)
      
      // Store remember me preference
      if (credentials.rememberMe) {
        localStorage.setItem('remember_me', 'true')
        localStorage.setItem('user_email', credentials.email)
        localStorage.setItem('user_password', credentials.password)
      } else {
        localStorage.removeItem('remember_me')
        localStorage.removeItem('user_email')
        localStorage.removeItem('user_password')
      }
      
      setUser(response.data.user)
      setIsAuthenticated(true)
      toast.success('Login successful!')
      return { success: true }
    } catch (error) {
      // Handle errors with specific messages
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        // Backend not running - use mock for demo
        if (credentials.email === 'demo@example.com' && credentials.password === 'password123') {
          const mockUser = {
            id: '1',
            name: 'Demo Admin',
            email: 'demo@example.com',
            restaurantName: 'Demo Restaurant',
          }
          const mockToken = 'mock-jwt-token-' + Date.now()
          
          localStorage.setItem('auth_token', mockToken)
          
          // Store remember me preference
          if (credentials.rememberMe) {
            localStorage.setItem('remember_me', 'true')
            localStorage.setItem('user_email', credentials.email)
            localStorage.setItem('user_password', credentials.password)
          } else {
            localStorage.removeItem('remember_me')
            localStorage.removeItem('user_email')
            localStorage.removeItem('user_password')
          }
          
          setUser(mockUser)
          setIsAuthenticated(true)
          toast.success('Login successful! (Demo mode - backend not connected)')
          return { success: true }
        }
        toast.error('Backend server not running. Please start the API server.')
      } else {
        // API returned an error
        toast.error(error.response?.data?.message || 'Invalid email or password')
      }
      return { success: false, error }
    }
  }

  const register = async (userData) => {
    try {
      // Call actual backend API
      const response = await authAPI.register(userData)
      
      // Don't store token or login user after registration
      // User should login manually after registration
      toast.success('Registration successful! Please login to continue.')
      return { success: true }
    } catch (error) {
      // Handle errors with specific messages
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        toast.error('Backend server not running. Please start the API server.')
      } else {
        // API returned an error
        toast.error(error.response?.data?.message || 'Registration failed')
      }
      return { success: false, error }
    }
  }

  const logout = () => {
    // Clear local storage and state
    localStorage.removeItem('auth_token')
    
    // Only clear remember me data if remember me is not enabled
    const rememberMe = localStorage.getItem('remember_me')
    if (!rememberMe) {
      localStorage.removeItem('user_email')
      localStorage.removeItem('user_password')
    }
    
    setUser(null)
    setIsAuthenticated(false)
    toast.success('Logged out successfully')
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
