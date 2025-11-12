import { ShoppingBag, ChevronLeft, Moon, Sun } from 'lucide-react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '@shared/contexts/CartContext'
import { useTheme } from '@shared/contexts/ThemeContext'
import { CartDrawer } from '../components/CartDrawer'
import { motion, AnimatePresence } from 'framer-motion'

export const CustomerLayout = () => {
  const { openCart, getTotalItems } = useCart()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const totalItems = getTotalItems()

  // Don't show cart on cart and order status pages
  const showCart = !location.pathname.includes('/cart') && !location.pathname.includes('/order/')

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-950 transition-colors duration-300">
      {/* Colorful Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b-2 border-purple-100 dark:border-purple-900/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-900 dark:text-white hover:opacity-70 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>

          <div className="flex items-center gap-3">
            {/* Theme Toggle - Enhanced Visibility */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center hover:scale-110 transition-transform"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {theme === 'dark' ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <Sun className="w-5 h-5 text-yellow-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <Moon className="w-5 h-5 text-gray-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Vibrant Cart Button */}
            {showCart && totalItems > 0 && (
              <button
                onClick={openCart}
                className="relative w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center hover:scale-110 transition-all shadow-lg hover:shadow-xl"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-gray-950">
                  {totalItems}
                </span>
              </button>
            )}
          </div>
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
