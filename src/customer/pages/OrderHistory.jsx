import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Clock, CheckCircle, Package, Receipt, Calendar } from 'lucide-react'
import { Card } from '@shared/components/Card'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { Badge } from '@shared/components/Badge'
import { formatCurrency, formatDateTime } from '@shared/utils/formatters'
import { ordersAPI } from '@shared/api/endpoints'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const STATUS_CONFIG = {
  pending: { label: 'Pending', icon: Clock, variant: 'warning', color: 'text-yellow-600' },
  preparing: { label: 'Preparing', icon: Package, variant: 'info', color: 'text-blue-600' },
  ready: { label: 'Ready', icon: CheckCircle, variant: 'success', color: 'text-green-600' },
  completed: { label: 'Completed', icon: CheckCircle, variant: 'success', color: 'text-green-600' },
}

export const OrderHistory = () => {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!phone || phone.length < 10) {
      toast.error('Please enter a valid 10-digit phone number')
      return
    }

    setLoading(true)
    setSearched(true)
    
    try {
      const response = await ordersAPI.getCustomerOrders(phone)
      setOrders(response.data)
      
      if (response.data.length === 0) {
        toast.info('No orders found for today')
      }
    } catch (error) {
      toast.error('Failed to fetch orders')
      console.error('Order fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center"
          >
            <Receipt className="w-8 h-8 text-white" />
          </motion.div>
          
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
            My Orders Today
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4 inline mr-1" />
            View your order history for today
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Enter Your Phone Number
            </h2>
            <div className="flex gap-3">
              <Input
                placeholder="Enter 10-digit phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                onKeyPress={handleKeyPress}
                leftIcon={<Search className="w-5 h-5" />}
                className="flex-1"
                maxLength={10}
              />
              <Button
                onClick={handleSearch}
                loading={loading}
                className="bg-gradient-to-r from-primary-600 to-primary-700"
              >
                Search
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              We'll show you all orders placed today with this phone number
            </p>
          </Card>
        </motion.div>

        {/* Orders List */}
        <AnimatePresence mode="wait">
          {searched && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order, index) => {
                    const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
                    const StatusIcon = statusInfo.icon

                    return (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card hover className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                  {order.restaurantName}
                                </h3>
                                {order.tableNumber && (
                                  <Badge variant="gray" className="text-xs">
                                    Table {order.tableNumber}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Order #{order.id.slice(-8).toUpperCase()}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                {formatDateTime(order.createdAt)}
                              </p>
                            </div>
                            
                            <div className="text-right">
                              <div className="flex items-center gap-2 mb-2">
                                <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                                <Badge variant={statusInfo.variant}>
                                  {statusInfo.label}
                                </Badge>
                              </div>
                              <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
                                {formatCurrency(order.totalAmount)}
                              </p>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                              Items Ordered:
                            </h4>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span className="text-gray-600 dark:text-gray-400">
                                    {item.name} × {item.quantity}
                                  </span>
                                  <span className="font-medium text-gray-900 dark:text-gray-100">
                                    {formatCurrency(item.price * item.quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Payment Method */}
                          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                Payment Method
                              </span>
                              <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                                {order.paymentMethod}
                              </span>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No Orders Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    You haven't placed any orders today
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Searching for your orders...</p>
          </div>
        )}
      </div>
    </div>
  )
}
