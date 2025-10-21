import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChefHat, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { Card } from '@shared/components/Card'
import { useAuth } from '@shared/contexts/AuthContext'
import { motion } from 'framer-motion'

export const Login = () => {
  const navigate = useNavigate()
  const { login, register, isAuthenticated } = useAuth()
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // Check if remember me is enabled
  const savedEmail = localStorage.getItem('user_email')
  const savedPassword = localStorage.getItem('user_password')
  const savedRememberMe = localStorage.getItem('remember_me') === 'true'
  
  const [rememberMe, setRememberMe] = useState(savedRememberMe)
  const [formData, setFormData] = useState({
    email: savedEmail || '',
    password: savedPassword || '',
    name: '',
    restaurantName: '',
    phone: '',
  })

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/owner/dashboard')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLoginMode) {
        const result = await login({ 
          email: formData.email, 
          password: formData.password,
          rememberMe 
        })
        if (result.success) {
          navigate('/owner/dashboard')
        }
      } else {
        const result = await register(formData)
        if (result.success) {
          // Redirect to login page after registration
          setIsLoginMode(true)
          setFormData({
            email: formData.email, // Keep email for convenience
            password: '',
            name: '',
            restaurantName: '',
            phone: '',
          })
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">QR Menu Admin</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your digital menu</p>
        </div>

        {/* Login/Register Card */}
        <Card>
          <div className="p-8">
            <div className="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setIsLoginMode(true)}
                className={`flex-1 py-2 rounded-md transition-all ${
                  isLoginMode
                    ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 font-medium shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLoginMode(false)}
                className={`flex-1 py-2 rounded-md transition-all ${
                  !isLoginMode
                    ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 font-medium shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLoginMode && (
                <>
                  <Input
                    label="Your Name"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    leftIcon={<User className="w-5 h-5" />}
                    required
                  />
                  <Input
                    label="Restaurant Name"
                    name="restaurantName"
                    placeholder="Enter restaurant name"
                    value={formData.restaurantName}
                    onChange={handleChange}
                    leftIcon={<ChefHat className="w-5 h-5" />}
                    required
                  />
                  <Input
                    label="Phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    leftIcon={<Phone className="w-5 h-5" />}
                    required
                  />
                </>
              )}

              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                leftIcon={<Mail className="w-5 h-5" />}
                required
              />

              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                }
                required
              />

              {isLoginMode && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Remember me</span>
                  </label>
                  <a
                    href="#"
                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                  >
                    Forgot password?
                  </a>
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" loading={loading}>
                {isLoginMode ? 'Login' : 'Create Account'}
              </Button>
            </form>
          </div>
        </Card>
        {/* Demo Note */}
        <div className="mt-6 text-center space-y-2">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
              💡 Testing Credentials
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              For testing: Email: <span className="font-mono">demo@example.com</span> | Password: <span className="font-mono">password123</span>
            </p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Or register any account - works in mock mode
          </p>
        </div>
      </motion.div>
    </div>
  )
}
