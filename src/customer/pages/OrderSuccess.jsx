import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle, ArrowRight, Clock, Home, History } from 'lucide-react'
import { Button } from '@shared/components/Button'
import { Card } from '@shared/components/Card'
import { formatCurrency } from '@shared/utils/formatters'
import { ordersAPI } from '@shared/api/endpoints'
import { motion, AnimatePresence } from 'framer-motion'
import { playSuccessSound } from '@shared/utils/soundEffects'
import toast from 'react-hot-toast'

export const OrderSuccess = () => {
  const { menuSlug, token, orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    fetchOrder()
    
    // Play success sound when checkmark appears
    setTimeout(() => {
      playSuccessSound()
    }, 500)
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const response = await ordersAPI.getOrder(orderId)
      setOrder(response.data)
      
      // Show content after animation
      setTimeout(() => setShowContent(true), 1200)
    } catch (error) {
      toast.error('Failed to load order details')
      console.error('Order fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Simple Clean Success Animation - Just Tick */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            duration: 0.6
          }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            {/* Main Success Circle */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: 0.1, 
                duration: 0.4,
                type: "spring",
                stiffness: 250
              }}
              className="relative w-32 h-32 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 20px 50px rgba(16, 185, 129, 0.4)'
              }}
            >
              {/* Checkmark Icon */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.3,
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
              >
                <CheckCircle 
                  className="w-20 h-20 text-white" 
                  strokeWidth={2.5}
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Thank You Message */}
        <AnimatePresence>
          {showContent && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8"
              >
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Thank You!
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-1">
                  Your order has been placed successfully
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Order #{orderId?.slice(-8).toUpperCase()}
                </p>
              </motion.div>

              {/* Order Summary Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Card className="mb-6">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          Preparing Your Order
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          We'll notify you when it's ready
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3 mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        Order Items
                      </h4>
                      {order?.items?.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="flex justify-between text-sm"
                        >
                          <div className="flex-1">
                            <p className="text-gray-900 dark:text-gray-100 font-medium">
                              {item.name}
                            </p>
                            <p className="text-gray-500 dark:text-gray-500 text-xs">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="text-gray-900 dark:text-gray-100 font-semibold">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          Total Amount
                        </span>
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {formatCurrency(order?.totalAmount)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 text-center">
                        💰 Pay in cash when your order is ready
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Customer Details */}
              {order?.tableNumber && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6"
                >
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
                    🪑 <strong>Table {order.tableNumber}</strong>
                    <br />
                    Please stay at your table. We'll bring your order!
                  </p>
                </motion.div>
              )}

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="space-y-3"
              >
                {/* Primary CTA - Back to Menu */}
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full group hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 border-2"
                  onClick={() => navigate(`/m/${menuSlug}/q/${token}`)}
                >
                  <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Back to Menu</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                {/* View Order History */}
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full group hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 border-2 border-blue-200 dark:border-blue-800"
                  onClick={() => navigate(`/m/${menuSlug}/q/${token}/history`)}
                >
                  <History className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">View Order History</span>
                </Button>
                
                {/* Track Order */}
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => navigate(`/m/${menuSlug}/q/${token}/order/${orderId}`)}
                >
                  <Clock className="w-5 h-5 mr-2" />
                  Track Order Status
                </Button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
