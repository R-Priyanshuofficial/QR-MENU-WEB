import { Clock, User, Phone, CheckCircle } from 'lucide-react'
import { Card } from '@shared/components/Card'
import { Button } from '@shared/components/Button'
import { Badge } from '@shared/components/Badge'
import { formatCurrency, getRelativeTime } from '@shared/utils/formatters'
import { motion } from 'framer-motion'

export const OrderCard = ({ order, onMarkReady, onMarkCompleted }) => {
  const getStatusVariant = (status) => {
    const variants = {
      pending: 'warning',
      preparing: 'info',
      ready: 'success',
      completed: 'gray',
    }
    return variants[status] || 'gray'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                Order #{order.id.slice(-8).toUpperCase()}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                <Clock className="w-4 h-4" />
                {getRelativeTime(order.createdAt)}
              </p>
            </div>
            <Badge variant={getStatusVariant(order.status)}>
              {order.status.toUpperCase()}
            </Badge>
          </div>

          {/* Customer Info */}
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-2 text-xs sm:text-sm mb-1">
              <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-gray-100">{order.customerName}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Phone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">{order.customerPhone}</span>
            </div>
            {order.tableNumber && (
              <div className="mt-2">
                <Badge variant="info" className="text-xs">
                  Table {order.tableNumber}
                </Badge>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="mb-4">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Items:</h4>
            <div className="space-y-1">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-700 dark:text-gray-300">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600 flex justify-between text-sm font-bold">
              <span className="text-gray-900 dark:text-gray-100">Total</span>
              <span className="text-primary-600 dark:text-primary-400">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {order.status === 'pending' && (
              <Button
                size="sm"
                className="flex-1"
                onClick={() => onMarkReady(order.id)}
              >
                Mark Ready
              </Button>
            )}
            {order.status === 'ready' && (
              <Button
                size="sm"
                variant="secondary"
                className="flex-1"
                leftIcon={<CheckCircle className="w-4 h-4" />}
                onClick={() => onMarkCompleted(order.id)}
              >
                Mark Completed
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
