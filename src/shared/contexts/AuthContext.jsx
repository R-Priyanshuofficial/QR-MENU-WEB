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
          // Try to fetch from actual API
          const response = await authAPI.getProfile()
          setUser(response.data)
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
      // Mock authentication for demo (no backend required)
      if (credentials.email === 'demo@example.com' && credentials.password === 'password123') {
        const mockUser = {
          id: '1',
          name: 'Demo Admin',
          email: 'demo@example.com',
          restaurantName: 'Demo Restaurant',
        }
        const mockToken = 'mock-jwt-token-' + Date.now()
        
        localStorage.setItem('auth_token', mockToken)
        setUser(mockUser)
        setIsAuthenticated(true)
        toast.success('Login successful!')
        return { success: true }
      }
      
      // Try actual API call (will fail if no backend)
      const response = await authAPI.login(credentials)
      localStorage.setItem('auth_token', response.token)
      setUser(response.user)
      setIsAuthenticated(true)
      toast.success('Login successful!')
      return { success: true }
    } catch (error) {
      // Show helpful error message
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        toast.error('No backend server running. Use demo credentials: demo@example.com / password123')
      } else {
        toast.error(error.response?.data?.message || 'Invalid credentials')
      }
      return { success: false, error }
    }
  }

  const register = async (userData) => {
    try {
      // Mock registration for demo
      const mockUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        restaurantName: userData.restaurantName,
      }
      const mockToken = 'mock-jwt-token-' + Date.now()
      
      localStorage.setItem('auth_token', mockToken)
      setUser(mockUser)
      setIsAuthenticated(true)
      toast.success('Registration successful! (Mock mode - no backend)')
      return { success: true }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
      return { success: false, error }
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('auth_token')
      setUser(null)
      setIsAuthenticated(false)
      toast.success('Logged out successfully')
    }
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
