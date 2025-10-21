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
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {menu?.restaurant?.name}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {menu?.restaurant?.description}
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Input
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-5 h-5" />}
          className="w-full"
        />
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 overflow-x-auto"
      >
        <div className="flex gap-2 pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 sm:px-4 py-2 rounded-full font-medium text-xs sm:text-sm whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="hidden sm:inline">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
              <span className="sm:hidden">{category.slice(0, 1).toUpperCase()}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Menu Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <ItemCard item={item} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">No items found</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      )}
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
