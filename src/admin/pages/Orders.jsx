import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { OrderCard } from '../components/OrderCard'
import { PageLoader } from '@shared/components/Spinner'
import { ConfirmModal } from '@shared/components/Modal'
import { ordersAPI } from '@shared/api/endpoints'
import { useSocket } from '@shared/contexts/SocketContext'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export const Orders = () => {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('pending')
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, orderId: null, action: null })
  const { socket, connected } = useSocket()

  useEffect(() => {
    fetchOrders()
  }, [filter])

  useEffect(() => {
    // Listen for new order notifications
    if (socket && connected) {
      const handleNotification = (notification) => {
        if (notification.type === 'new_order') {
          // Refresh orders when new order arrives
          fetchOrders()
        }
      }

      socket.on('notification', handleNotification)

      return () => {
        socket.off('notification', handleNotification)
      }
    }
  }, [socket, connected])

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getOwnerOrders(filter)
      setOrders(response.data)
    } catch (error) {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkReady = (orderId) => {
    setConfirmModal({ isOpen: true, orderId, action: 'ready' })
  }

  const handleMarkCompleted = (orderId) => {
    setConfirmModal({ isOpen: true, orderId, action: 'completed' })
  }

  const confirmAction = async () => {
    const { orderId, action } = confirmModal
    try {
      if (action === 'ready') {
        await ordersAPI.markOrderReady(orderId)
        toast.success('Order marked as ready! Customer notified.')
      } else if (action === 'completed') {
        await ordersAPI.markOrderCompleted(orderId)
        toast.success('Order completed! Added to billing.', {
          duration: 4000,
          icon: '🧾'
        })
      }
      fetchOrders()
    } catch (error) {
      toast.error('Failed to update order')
    } finally {
      setConfirmModal({ isOpen: false, orderId: null, action: null })
    }
  }

  if (loading) return <PageLoader message="Loading orders..." />

  const filterTabs = [
    { value: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { value: 'ready', label: 'Ready', count: orders.filter(o => o.status === 'ready').length },
    { value: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'completed').length },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Orders</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Manage incoming orders in real-time</p>
        </div>
        <div className={`flex items-center gap-2 ${connected ? 'text-green-600' : 'text-gray-400'}`}>
          <Bell className="w-5 h-5" />
          <span className="text-xs sm:text-sm">
            {connected ? 'Real-time updates active' : 'Connecting...'}
          </span>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium whitespace-nowrap transition-all text-sm sm:text-base ${
              filter === tab.value
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`ml-1.5 sm:ml-2 px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-bold ${
                filter === tab.value ? 'bg-white text-primary-600' : 'bg-gray-200'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </motion.div>

      {/* Orders Grid */}
      {orders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onMarkReady={handleMarkReady}
                onMarkCompleted={handleMarkCompleted}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No {filter} orders</p>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, orderId: null, action: null })}
        onConfirm={confirmAction}
        title={confirmModal.action === 'ready' ? 'Mark Order Ready?' : 'Mark Order Completed?'}
        message={
          confirmModal.action === 'ready'
            ? 'The customer will be notified that their order is ready for pickup.'
            : 'This will move the order to completed status.'
        }
        confirmText="Confirm"
      />
    </div>
  )
}
