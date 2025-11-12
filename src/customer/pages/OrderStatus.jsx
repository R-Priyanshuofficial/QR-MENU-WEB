import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle, Clock, ChefHat, Bell } from 'lucide-react'
import { Card } from '@shared/components/Card'
import { Badge } from '@shared/components/Badge'
import { Button } from '@shared/components/Button'
import { PageLoader } from '@shared/components/Spinner'
import { formatCurrency, formatDateTime } from '@shared/utils/formatters'
import { ordersAPI } from '@shared/api/endpoints'
import { useSocket } from '@shared/contexts/SocketContext'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { registerPushSubscription } from '@shared/utils/pushNotifications'

const ORDER_STATUS = {
  pending: { label: 'Pending', icon: Clock, variant: 'warning', color: 'text-yellow-600' },
  preparing: { label: 'Preparing', icon: ChefHat, variant: 'info', color: 'text-blue-600' },
  ready: { label: 'Ready', icon: Bell, variant: 'success', color: 'text-green-600' },
  completed: { label: 'Completed', icon: CheckCircle, variant: 'success', color: 'text-green-600' },
}

export const OrderStatus = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState(null)
  const { socket, joinOrderRoom } = useSocket()

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  useEffect(() => {
    // Join order room for real-time updates
    if (order && socket) {
      joinOrderRoom(orderId, order.customerPhone)

      // Ensure web push subscription for this customer's phone
      if (order.customerPhone) {
        registerPushSubscription({ phone: order.customerPhone }).catch(() => {})
      }

      // Listen for order status updates
      const handleNotification = (notification) => {
        if (notification.data?.orderId === orderId) {
          setOrder((prev) => ({ ...prev, status: notification.data.status }))
        }
      }

      socket.on('notification', handleNotification)

      return () => {
        socket.off('notification', handleNotification)
      }
    }
  }, [order, socket, orderId, joinOrderRoom])

  const fetchOrder = async () => {
    try {
      const response = await ordersAPI.getOrder(orderId)
      setOrder(response.data)
    } catch (error) {
      toast.error('Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <PageLoader message="Loading order details..." />

  const statusInfo = ORDER_STATUS[order?.status] || ORDER_STATUS.pending
  const StatusIcon = statusInfo.icon

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Order Placed!</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Order #{order?.id?.slice(-8).toUpperCase()}</p>
      </motion.div>

      <Card className="mb-6">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 bg-gray-100 rounded-full ${statusInfo.color}`}>
              <StatusIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">Order Status</h2>
              <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Order Details</h2>
          <div className="space-y-3 mb-4">
            {order?.items?.map((item, i) => (
              <div key={i} className="flex justify-between">
                <div>
                  <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between text-base sm:text-lg font-bold">
              <span className="text-gray-900 dark:text-gray-100">Total</span>
              <span className="text-primary-600 dark:text-primary-400">{formatCurrency(order?.totalAmount)}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
