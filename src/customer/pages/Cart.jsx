import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ShoppingBag, User, Phone, Trash2 } from 'lucide-react'
import { useCart } from '@shared/contexts/CartContext'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { Card } from '@shared/components/Card'
import { ConfirmModal } from '@shared/components/Modal'
import { formatCurrency } from '@shared/utils/formatters'
import { isValidName, isValidPhone } from '@shared/utils/validators'
import { ordersAPI } from '@shared/api/endpoints'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { registerPushSubscription } from '@shared/utils/pushNotifications'

export const Cart = () => {
  const { menuSlug, token } = useParams()
  const navigate = useNavigate()
  const { items, getTotalAmount, clearCart, removeItem } = useCart()

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!isValidName(customerName)) {
      newErrors.name = 'Please enter a valid name (at least 2 characters)'
    }

    if (!isValidPhone(customerPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) return

    setShowConfirmModal(true)
  }

  const confirmOrder = async () => {
    setLoading(true)
    try {
      const orderData = {
        token,
        customerName,
        customerPhone,
        items: items.map((item) => ({
          itemId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: getTotalAmount(),
        paymentMethod: 'cash',
      }

      const response = await ordersAPI.createOrder(orderData)
      try { await registerPushSubscription({ phone: customerPhone }) } catch {}
      clearCart()
      // Navigate to success page with animation
      navigate(`/m/${menuSlug}/q/${token}/success/${response.data.orderId}`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
      setShowConfirmModal(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Your cart is empty</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">Add some items to get started</p>
          <Button onClick={() => navigate(-1)}>Browse Menu</Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-2">
          Checkout
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Complete your order details</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Customer Details & Order Items */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Customer Details */}
          <Card className="border-2 border-purple-100 dark:border-purple-900/30 bg-white dark:bg-gray-900 shadow-lg">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-t-xl">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <User className="w-6 h-6" />
                Your Details
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  error={errors.name}
                  leftIcon={<User className="w-5 h-5" />}
                  required
                />
                <Input
                  label="Phone Number"
                  placeholder="10-digit phone number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  error={errors.phone}
                  leftIcon={<Phone className="w-5 h-5" />}
                  required
                  maxLength={10}
                />
              </div>
            </div>
          </Card>

          {/* Order Items */}
          <Card className="border-2 border-purple-100 dark:border-purple-900/30 bg-white dark:bg-gray-900 shadow-lg">
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6 rounded-t-xl">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <ShoppingBag className="w-6 h-6" />
                Your Order ({items.length} {items.length === 1 ? 'item' : 'items'})
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700 transition-all"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl shadow-md"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">{item.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span className="font-semibold">{formatCurrency(item.price, item.currency)}</span>
                        <span>×</span>
                        <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{item.quantity}</span>
                      </div>
                      <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {formatCurrency(item.price * item.quantity, item.currency)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Right Column - Bill Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="sticky top-20 border-2 border-purple-100 dark:border-purple-900/30 bg-white dark:bg-gray-900 shadow-xl">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-t-xl">
              <h2 className="text-2xl font-bold text-white">
                Bill Summary
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(getTotalAmount())}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Taxes & Fees</span>
                  <span className="text-lg font-semibold text-green-600 dark:text-green-400">Included</span>
                </div>
                <div className="pt-4 pb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">Total Amount</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {formatCurrency(getTotalAmount())}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-5 mb-6 shadow-lg">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💰</span>
                  <div>
                    <p className="text-white font-bold text-lg mb-1">Cash Payment</p>
                    <p className="text-white/90 text-sm">Pay when your order is ready at the counter</p>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white font-bold text-lg py-4 shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                onClick={handlePlaceOrder}
                loading={loading}
              >
                Place Order Now
              </Button>
              
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                By placing order, you agree to our terms & conditions
              </p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmOrder}
        title="Confirm Order"
        message={`Place order for ${formatCurrency(getTotalAmount())}? You'll pay in cash when it's ready.`}
        confirmText="Confirm Order"
        loading={loading}
      />
    </div>
  )
}
