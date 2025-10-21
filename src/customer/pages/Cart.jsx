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
      toast.success('Order placed successfully!')
      clearCart()
      navigate(`/m/${menuSlug}/q/${token}/order/${response.data.orderId}`)
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
    <div className="max-w-4xl mx-auto px-4 py-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6"
      >
        Checkout
      </motion.h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column - Cart Items */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 space-y-4"
        >
          {/* Customer Details */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Customer Details
              </h2>
              <div className="space-y-4">
                <Input
                  label="Name"
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  error={errors.name}
                  leftIcon={<User className="w-5 h-5" />}
                  required
                />
                <Input
                  label="Phone Number"
                  placeholder="Enter your phone number"
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
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">{item.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {formatCurrency(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm mt-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Right Column - Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-1"
        >
          <Card className="sticky top-20">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Bill Summary
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(getTotalAmount())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxes & Fees</span>
                  <span>Included</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-primary-600">
                      {formatCurrency(getTotalAmount())}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  💰 <strong>Cash Payment</strong>
                  <br />
                  Pay when your order is ready
                </p>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handlePlaceOrder}
                loading={loading}
              >
                Place Order
              </Button>
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
