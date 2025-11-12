import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '@shared/contexts/CartContext'
import { Button } from '@shared/components/Button'
import { formatCurrency } from '@shared/utils/formatters'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export const CartDrawer = () => {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotalAmount, getTotalItems } = useCart()
  const navigate = useNavigate()

  const handleCheckout = () => {
    closeCart()
    navigate('cart')
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop - Solid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-40"
        onClick={closeCart}
      />

      {/* Drawer - Solid Background */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-950 shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-purple-100 dark:border-purple-900/30 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
          <h2 className="text-2xl font-bold">Cart ({getTotalItems()})</h2>
          <button
            onClick={closeCart}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center hover:scale-110 transition-all backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-20 h-20 text-gray-200 dark:text-gray-800 mb-4" />
              <p className="text-gray-400 dark:text-gray-600">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl p-4 border-2 border-purple-100 dark:border-purple-900/30 shadow-sm"
                  >
                    <div className="flex gap-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-xl"
                        />
                      )}

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-2">
                          {formatCurrency(item.price, item.currency)}
                        </p>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-white flex items-center justify-center hover:scale-110 transition-all shadow-md"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-base font-semibold w-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white flex items-center justify-center hover:scale-110 transition-all shadow-md"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-auto text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t-2 border-purple-100 dark:border-purple-900/30 p-6 bg-gray-50 dark:bg-gray-900">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg text-gray-600 dark:text-gray-400">Total</span>
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {formatCurrency(getTotalAmount())}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-bold hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </motion.div>
    </>
  )
}
