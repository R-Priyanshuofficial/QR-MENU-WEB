import { ShoppingBag, ChevronLeft } from 'lucide-react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '@shared/contexts/CartContext'
import { CartDrawer } from '../components/CartDrawer'
import { motion } from 'framer-motion'

export const CustomerLayout = () => {
  const { openCart, getTotalItems } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const totalItems = getTotalItems()

  // Don't show cart on cart and order status pages
  const showCart = !location.pathname.includes('/cart') && !location.pathname.includes('/order/')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>

          {showCart && totalItems > 0 && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={openCart}
              className="relative p-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              <motion.span
                key={totalItems}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
              >
                {totalItems}
              </motion.span>
            </motion.button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  )
}
