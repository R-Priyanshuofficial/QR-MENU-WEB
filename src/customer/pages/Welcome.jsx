import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChefHat, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@shared/components/Button'
import { TableBadge } from '../components/TableBadge'
import { PageLoader } from '@shared/components/Spinner'
import { menuAPI } from '@shared/api/endpoints'
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
      const response = await menuAPI.getPublicMenu(menuSlug, token)
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

  if (loading) {
    return <PageLoader message="Loading restaurant details..." />
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Restaurant Logo/Image */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mb-4 shadow-lg"
          >
            <ChefHat className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2"
          >
            {restaurant?.name || 'Welcome'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4"
          >
            {restaurant?.description || 'Delicious food awaits you!'}
          </motion.p>

          {tableNumber && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center"
            >
              <TableBadge tableNumber={tableNumber} />
            </motion.div>
          )}
        </div>

        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Browse Our Menu
              </h2>
              <p className="text-sm text-gray-600">
                Explore our carefully curated selection of dishes and place your order instantly
              </p>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={handleViewMenu}
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            View Menu
          </Button>

          {restaurant?.openingHours && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                {restaurant.openingHours}
              </p>
            </div>
          )}
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 grid grid-cols-3 gap-4 text-center"
        >
          {[
            { label: 'Easy Ordering', icon: '📱' },
            { label: 'Quick Service', icon: '⚡' },
            { label: 'Fresh Food', icon: '🍽️' },
          ].map((feature, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl mb-1">{feature.icon}</div>
              <p className="text-xs text-gray-600 font-medium">{feature.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
