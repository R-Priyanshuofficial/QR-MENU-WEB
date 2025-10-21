import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShoppingBag,
  TrendingUp,
  QrCode,
  Users,
  ArrowRight,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent } from '@shared/components/Card'
import { Button } from '@shared/components/Button'
import { PageLoader } from '@shared/components/Spinner'
import { formatCurrency } from '@shared/utils/formatters'
import { dashboardAPI } from '@shared/api/endpoints'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export const Dashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard stats from backend API
      const statsRes = await dashboardAPI.getStats()
      
      // Extract stats from response
      setStats(statsRes.data.stats)
      
      // For now, mock recent orders (will be implemented when orders API is ready)
      setRecentOrders([])
    } catch (error) {
      console.error('Dashboard API error:', error)
      
      // Fallback to mock data if backend not available
      setStats({
        totalQRCodes: 0,
        activeQRCodes: 0,
        totalScans: 0,
        recentScans: 0,
        scanGrowth: '0%',
        todayOrders: 0,
        todayRevenue: 0,
        totalCustomers: 0,
      })
      toast.error('Backend not connected. Showing placeholder data.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <PageLoader message="Loading dashboard..." />

  const statCards = [
    {
      title: 'Total QR Codes',
      value: stats?.totalQRCodes || 0,
      icon: QrCode,
      color: 'bg-purple-500',
      change: `${stats?.activeQRCodes || 0} active`,
    },
    {
      title: 'Total Scans',
      value: stats?.totalScans || 0,
      icon: TrendingUp,
      color: 'bg-blue-500',
      change: stats?.scanGrowth || '0%',
    },
    {
      title: 'Recent Scans',
      value: stats?.recentScans || 0,
      icon: ShoppingBag,
      color: 'bg-green-500',
      change: 'Last 7 days',
    },
    {
      title: 'Total Orders',
      value: stats?.todayOrders || 0,
      icon: Users,
      color: 'bg-orange-500',
      change: 'Coming soon',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening today.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                    {stat.change && (
                      <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 mt-1">{stat.change}</p>
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">Pending Orders</h2>
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => navigate('/owner/orders')}
              >
                View All
              </Button>
            </div>

            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => navigate('/owner/orders')}
                  >
                    <div>
                      <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm sm:text-base font-semibold text-primary-600 dark:text-primary-400">
                        {formatCurrency(order.totalAmount)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{order.items.length} items</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">No pending orders</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            hover
            className="cursor-pointer"
            onClick={() => navigate('/owner/menu')}
          >
            <CardContent className="flex items-center gap-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">Edit Menu</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Update your items</p>
              </div>
            </CardContent>
          </Card>

          <Card
            hover
            className="cursor-pointer"
            onClick={() => navigate('/owner/qr')}
          >
            <CardContent className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <QrCode className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">Generate QR</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Create new codes</p>
              </div>
            </CardContent>
          </Card>

          <Card
            hover
            className="cursor-pointer"
            onClick={() => navigate('/owner/analytics')}
          >
            <CardContent className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">View Analytics</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Check performance</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
