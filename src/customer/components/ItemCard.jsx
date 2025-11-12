import { Plus, Minus } from 'lucide-react'
import { formatCurrency } from '@shared/utils/formatters'
import { useCart } from '@shared/contexts/CartContext'
import { playClickSound, playAddToCartSound } from '@shared/utils/soundEffects'

export const ItemCard = ({ item }) => {
  const { items, addItem, updateQuantity } = useCart()
  const cartItem = items.find((i) => i.id === item.id)
  const quantity = cartItem?.quantity || 0

  const handleAdd = () => {
    if (quantity === 0) {
      playAddToCartSound()
      addItem(item)
    } else {
      playClickSound()
      updateQuantity(item.id, quantity + 1)
    }
  }

  const handleDecrease = () => {
    playClickSound()
    updateQuantity(item.id, quantity - 1)
  }

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-white dark:bg-gray-900 hover:shadow-2xl transition-all border-2 border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700">

      {/* Item Image */}
      {item.image && (
        <div className="aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-gray-800">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Title & Description */}
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
            {item.description}
          </p>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price & Controls */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {formatCurrency(item.price, item.currency)}
          </span>

          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center hover:scale-110 hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={handleDecrease}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-white flex items-center justify-center hover:scale-110 transition-all shadow-md"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent w-6 text-center">
                {quantity}
              </span>
              <button
                onClick={handleAdd}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white flex items-center justify-center hover:scale-110 transition-all shadow-md"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
