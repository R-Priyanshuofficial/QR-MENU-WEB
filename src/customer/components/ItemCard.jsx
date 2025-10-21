import { Plus, Minus } from 'lucide-react'
import { Card } from '@shared/components/Card'
import { Button } from '@shared/components/Button'
import { Badge } from '@shared/components/Badge'
import { formatCurrency } from '@shared/utils/formatters'
import { useCart } from '@shared/contexts/CartContext'
import { motion } from 'framer-motion'

export const ItemCard = ({ item }) => {
  const { items, addItem, updateQuantity } = useCart()
  const cartItem = items.find((i) => i.id === item.id)
  const quantity = cartItem?.quantity || 0

  const handleAdd = () => {
    if (quantity === 0) {
      addItem(item)
    } else {
      updateQuantity(item.id, quantity + 1)
    }
  }

  const handleDecrease = () => {
    updateQuantity(item.id, quantity - 1)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card hover className="overflow-hidden">
        {/* Item Image */}
        {item.image && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            />
            {item.badge && (
              <div className="absolute top-2 left-2">
                <Badge variant={item.badge.variant}>{item.badge.text}</Badge>
              </div>
            )}
          </div>
        )}

        <div className="p-4">
          {/* Item Info */}
          <div className="mb-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {item.name}
            </h3>
            {item.description && (
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {item.description}
              </p>
            )}
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {item.tags.map((tag, index) => (
                <Badge key={index} variant="gray" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Price and Add Button */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary-600">
              {formatCurrency(item.price)}
            </span>

            {quantity === 0 ? (
              <Button size="sm" onClick={handleAdd} leftIcon={<Plus className="w-4 h-4" />}>
                Add
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDecrease}
                  className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center hover:bg-primary-200 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-semibold w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={handleAdd}
                  className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
