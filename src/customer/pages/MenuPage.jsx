import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Search, Filter } from 'lucide-react'
import { ItemCard } from '../components/ItemCard'
import { Skeleton, PageLoader } from '@shared/components/Spinner'
import { Input } from '@shared/components/Input'
import { Badge } from '@shared/components/Badge'
import { menuAPI } from '@shared/api/endpoints'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export const MenuPage = () => {
  const { menuSlug, token } = useParams()
  const [loading, setLoading] = useState(true)
  const [menu, setMenu] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchMenu()
  }, [])

  const fetchMenu = async () => {
    try {
      const response = await menuAPI.getPublicMenu(menuSlug, token)
      setMenu(response.data)
    } catch (error) {
      toast.error('Failed to load menu')
      console.error('Menu fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter items based on search and category
  const filteredItems = menu?.items?.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  }) || []

  // Get unique categories
  const categories = ['all', ...new Set(menu?.items?.map((item) => item.category) || [])]

  if (loading) {
    return <PageLoader message="Loading menu..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-6">

      {/* Vibrant Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 py-4"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-2">
          {menu?.restaurant?.name}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {menu?.restaurant?.description || 'Browse our delicious menu'}
        </p>
      </motion.div>

      {/* Compact Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-gray-900 border-2 border-purple-100 dark:border-purple-900/30 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all shadow-sm focus:shadow-lg"
          />
        </div>
      </motion.div>

      {/* Refined Category Slider - Hidden Scrollbar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 -mx-4 px-4"
      >
        <div 
          className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory"
          style={{
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none', /* IE and Edge */
          }}
        >
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`snap-start flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-2 border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700 hover:scale-105'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </motion.div>

      {/* Menu Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-400 dark:text-gray-600 text-lg">No items found</p>
        </div>
      )}
      </div>
    </div>
  )
}

// Skeleton loader for menu items
const MenuSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
        <Skeleton className="h-48 w-full" />
        <div className="p-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-4" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>
    ))}
  </div>
)
