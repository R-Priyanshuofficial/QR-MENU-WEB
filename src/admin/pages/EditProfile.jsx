import { useState } from 'react'
import { Save, Camera, Mail, Phone, MapPin, Building } from 'lucide-react'
import { Button } from '@shared/components/Button'
import { Input, TextArea } from '@shared/components/Input'
import { Card } from '@shared/components/Card'
import { useAuth } from '@shared/contexts/AuthContext'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export const EditProfile = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    restaurantName: user?.restaurantName || '',
    address: user?.address || '',
    description: user?.description || '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Profile updated successfully!')
      // In real app, call API: await profileAPI.update(formData)
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Edit Profile
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Update your profile and restaurant information
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Picture Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Profile Picture
              </h2>

              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-4xl font-bold">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                    <Camera className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </button>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Click camera icon to upload new photo
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  JPG, PNG or GIF (max. 2MB)
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2"
        >
          <Card>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Personal Information
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      leftIcon={<Mail className="w-5 h-5" />}
                      required
                    />

                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      leftIcon={<Mail className="w-5 h-5" />}
                      required
                    />

                    <Input
                      label="Phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      leftIcon={<Phone className="w-5 h-5" />}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Restaurant Information
                  </h2>

                  <div className="space-y-4">
                    <Input
                      label="Restaurant Name"
                      name="restaurantName"
                      value={formData.restaurantName}
                      onChange={handleChange}
                      leftIcon={<Building className="w-5 h-5" />}
                      required
                    />

                    <Input
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      leftIcon={<MapPin className="w-5 h-5" />}
                      placeholder="Enter restaurant address"
                    />

                    <TextArea
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Tell customers about your restaurant..."
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  leftIcon={<Save className="w-5 h-5" />}
                  loading={loading}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>

      {/* Additional Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Account Settings
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Change Password</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Update your password to keep your account secure
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Email Notifications</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive notifications about new orders
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div>
                  <h3 className="font-medium text-red-900 dark:text-red-400">Delete Account</h3>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="danger" size="sm">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
