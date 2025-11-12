import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowRight, History, Clock, Star, ShoppingBag, Utensils, Award } from 'lucide-react'
import { Button } from '@shared/components/Button'
import { TableBadge } from '../components/TableBadge'
import { PageLoader } from '@shared/components/Spinner'
import { menuAPI, qrAPI } from '@shared/api/endpoints'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export const Welcome = () => {
  const { menuSlug, token } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [restaurant, setRestaurant] = useState(null)
  const [tableNumber, setTableNumber] = useState(null)

  useEffect(() => {
    fetchMenuData()
  }, [])

  const fetchMenuData = async () => {
    try {
      // Track QR scan only once per session (not on reloads/back navigation)
      if (token) {
        const scanKey = `qr_scanned_${token}`
        const hasScanned = sessionStorage.getItem(scanKey)
        
        if (!hasScanned) {
          try {
            await qrAPI.trackScan(token)
            // Mark this token as scanned for this session
            sessionStorage.setItem(scanKey, 'true')
          } catch (scanError) {
            console.error('Scan tracking error:', scanError)
            // Don't show error to user, just log it
          }
        }
      }
      
      const response = await menuAPI.getPublicMenu(menuSlug, token)
      console.log('Restaurant data:', response.data.restaurant)
      console.log('Restaurant logo:', response.data.restaurant?.restaurantLogo)
      setRestaurant(response.data.restaurant)
      setTableNumber(response.data.tableNumber)
    } catch (error) {
      toast.error('Failed to load menu. Please try again.')
      console.error('Menu fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewMenu = () => {
    navigate(`/m/${menuSlug}/q/${token}/menu`)
  }

  const handleViewOrderHistory = () => {
    navigate(`/m/${menuSlug}/q/${token}/history`)
  }

  if (loading) {
    return <PageLoader message="Loading restaurant details..." />
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Blurred Background */}
      <motion.div
        initial={{ filter: 'blur(0px)' }}
        animate={{ filter: 'blur(8px)' }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-950 dark:via-purple-950 dark:to-gray-950"
      />
      
      {/* Logo - Starts from Upper-Middle, Then Moves Up */}
      <div className="absolute inset-0 flex items-start justify-center z-20 pointer-events-none pt-52">
        <motion.div
          initial={{ 
            opacity: 0, 
            scale: 0.5,
            y: 0
          }}
          animate={{ 
            opacity: [0, 1, 1, 1],
            scale: [0.5, 1, 1, 1],
            y: [0, 0, -120, -140]
          }}
          transition={{ 
            opacity: { times: [0, 0.25, 0.5, 1], duration: 3 },
            scale: { times: [0, 0.25, 0.5, 1], duration: 3 },
            y: { times: [0, 0.5, 0.75, 1], duration: 3, ease: 'easeInOut' }
          }}
        >
        {restaurant?.restaurantLogo ? (
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-1 shadow-2xl">
            <img
              src={restaurant.restaurantLogo}
              alt={restaurant?.name || 'Restaurant'}
              className="w-full h-full rounded-full object-cover bg-white dark:bg-gray-900"
              onError={(e) => {
                e.target.style.display = 'none'
                const fallback = document.createElement('div')
                fallback.className = 'w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center'
                fallback.innerHTML = '<svg class="w-16 h-16 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>'
                e.target.parentElement.appendChild(fallback)
              }}
            />
          </div>
        ) : (
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-1 shadow-2xl">
            <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
              <Utensils className="w-16 h-16 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        )}
        </motion.div>
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex items-start justify-center p-4 pt-60">
        <div className="max-w-2xl w-full">
          {/* Restaurant Name - Appears after logo moves up */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.8 }}
            className="text-center mb-6"
          >
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              {restaurant?.name || 'Our Restaurant'}
            </h1>
          </motion.div>

          {/* Welcome Message - Appears after name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8, duration: 0.6 }}
            className="text-center mb-8"
          >
            <p className="text-lg font-medium text-purple-600 dark:text-purple-400 mb-2">
              Welcome to our restaurant
            </p>
            
            <p className="text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-4">
              {restaurant?.description || 'Delicious food awaits you!'}
            </p>

            {tableNumber && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 3.2, type: 'spring' }}
                className="mt-4"
              >
                <div className="inline-flex flex-col items-center gap-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    <span className="text-xs font-medium uppercase tracking-wide">You're ordering from</span>
                  </div>
                  <span className="text-2xl font-bold">Table {tableNumber}</span>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Vibrant Action Cards - Appear last */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.4, duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
          >
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 3.5 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleViewMenu}
            className="group relative overflow-hidden p-8 text-left rounded-3xl bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
            <div className="relative z-10">
              <ShoppingBag className="w-10 h-10 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Browse Menu</h3>
              <p className="text-sm opacity-90 mb-4">Explore our delicious dishes</p>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 3.6 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleViewOrderHistory}
            className="group relative overflow-hidden p-8 text-left rounded-3xl bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 text-white shadow-xl hover:shadow-2xl transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
            <div className="relative z-10">
              <History className="w-10 h-10 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Order History</h3>
              <p className="text-sm opacity-90 mb-4">View your past orders</p>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </div>
          </motion.button>
          </motion.div>

          {/* Info Pills - Colorful */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.8 }}
          className="flex flex-wrap justify-center gap-3 text-sm"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg"
          >
            <Clock className="w-4 h-4" />
            <span className="font-medium">Fast Service</span>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
          >
            <Award className="w-4 h-4" />
            <span className="font-medium">Top Rated</span>
          </motion.div>
          {restaurant?.openingHours && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-lg"
            >
              <Clock className="w-4 h-4" />
              <span className="font-medium">{restaurant.openingHours}</span>
            </motion.div>
          )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
