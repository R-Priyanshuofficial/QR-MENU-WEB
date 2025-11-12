import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Clock,
  CreditCard,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  ChevronDown,
  Target,
  Zap,
  TrendingUp as Growth,
  Activity,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { Card } from '@shared/components/Card';
import { Button } from '@shared/components/Button';
import { PageLoader } from '@shared/components/Spinner';
import { formatCurrency } from '@shared/utils/formatters';
import { analyticsAPI } from '@shared/api/endpoints';
import toast from 'react-hot-toast';
import {
  exportRevenueReport,
  exportOrdersReport,
  exportMenuReport,
  exportCompleteReport
} from '../utils/pdfExports';

// Chart Colors
const CHART_COLORS = {
  primary: '#6366F1',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  purple: '#8B5CF6',
  pink: '#EC4899',
  blue: '#3B82F6',
  teal: '#14B8A6',
  orange: '#F97316'
};

const PIE_COLORS = ['#6366F1', '#8B5CF6', '#10B981', '#3B82F6', '#EF4444'];

// Helper function to convert 24-hour to 12-hour format
const formatTime12Hour = (hour) => {
  if (hour === 0) return '12:00 AM';
  if (hour < 12) return `${hour}:00 AM`;
  if (hour === 12) return '12:00 PM';
  return `${hour - 12}:00 PM`;
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100
    }
  }
};

export const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [period, setPeriod] = useState('week');
  const [refreshing, setRefreshing] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const periodOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
    { value: 'all', label: 'All Time' }
  ];

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true);
      const response = await analyticsAPI.getStats(period);
      const statsData = response.data?.data || response.data;
      
      if (statsData && statsData.orders) {
        setStats(statsData);
      } else {
        setStats({
          revenue: { total: 0, pending: 0, average: 0, daily: 0, today: 0, growth: 0 },
          orders: { total: 0, completed: 0, pending: 0, preparing: 0, ready: 0, cancelled: 0, today: 0, growth: 0, statusDistribution: {} },
          customers: { unique: 0, repeat: 0, repeatRate: 0 },
          popularItems: [],
          paymentMethods: {},
          peakHour: 0,
          hourlyDistribution: [],
          dayOfWeekData: [],
          topTables: [],
          revenueTrend: [],
          qrStats: { totalCodes: 0, totalScans: 0, averageScans: 0 }
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load analytics data');
      setStats({
        revenue: { total: 0, pending: 0, average: 0, daily: 0, today: 0, growth: 0 },
        orders: { total: 0, completed: 0, pending: 0, preparing: 0, ready: 0, cancelled: 0, today: 0, growth: 0, statusDistribution: {} },
        customers: { unique: 0, repeat: 0, repeatRate: 0 },
        popularItems: [],
        paymentMethods: {},
        peakHour: 0,
        hourlyDistribution: [],
        dayOfWeekData: [],
        topTables: [],
        revenueTrend: [],
        qrStats: { totalCodes: 0, totalScans: 0, averageScans: 0 }
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // PDF Export handlers
  const handleExportRevenue = () => {
    exportRevenueReport(stats, period, 'QR Menu Restaurant');
    toast.success('Revenue report downloaded!');
    setShowExportMenu(false);
  };

  const handleExportOrders = () => {
    exportOrdersReport(stats, period, 'QR Menu Restaurant');
    toast.success('Orders report downloaded!');
    setShowExportMenu(false);
  };

  const handleExportMenu = () => {
    exportMenuReport(stats, period, 'QR Menu Restaurant');
    toast.success('Menu report downloaded!');
    setShowExportMenu(false);
  };

  const handleExportComplete = () => {
    exportCompleteReport(stats, period, 'QR Menu Restaurant');
    toast.success('Complete report downloaded!');
    setShowExportMenu(false);
  };

  if (loading) return <PageLoader message="Loading analytics..." />;

  // Show empty state if no orders
  if (!stats || stats.orders.total === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Comprehensive insights into your restaurant's performance
            </p>
          </div>
        </div>
        <Card>
          <div className="p-12">
            <div className="text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No Analytics Data Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start receiving orders to see comprehensive analytics and insights about your restaurant's performance.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Analytics will automatically populate as customers place orders through your QR menu system.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Prepare pie chart data for order status
  const pieData = Object.entries(stats.orders.statusDistribution).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count
  })).filter(item => item.value > 0);

  // Calculate additional insights
  const completionRate = stats.orders.total > 0 
    ? ((stats.orders.completed / stats.orders.total) * 100).toFixed(1) 
    : 0;
  
  const cancellationRate = stats.orders.total > 0
    ? ((stats.orders.cancelled / stats.orders.total) * 100).toFixed(1)
    : 0;

  const avgRevenuePerCustomer = stats.customers.unique > 0
    ? stats.revenue.total / stats.customers.unique
    : 0;

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Comprehensive insights into your restaurant's performance
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Export Menu */}
          <div className="relative">
            <Button
              onClick={() => setShowExportMenu(!showExportMenu)}
              size="sm"
              className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Download className="w-4 h-4" />
              Export PDF
              <ChevronDown className="w-4 h-4" />
            </Button>
            
            <AnimatePresence>
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                >
                  <button
                    onClick={handleExportComplete}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                    Complete Report
                  </button>
                  <button
                    onClick={handleExportRevenue}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <DollarSign className="w-4 h-4 text-green-600" />
                    Revenue Report
                  </button>
                  <button
                    onClick={handleExportOrders}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                    Orders Report
                  </button>
                  <button
                    onClick={handleExportMenu}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Award className="w-4 h-4 text-pink-600" />
                    Menu Performance
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Refresh Button */}
          <Button
            onClick={() => fetchAnalytics()}
            size="sm"
            variant="outline"
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          {/* Period Selector */}
          <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
            {periodOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setPeriod(option.value)}
                disabled={refreshing}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  period === option.value
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                } disabled:opacity-50`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Key Performance Insights - New Section */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Key Performance Insights
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
                <p className="text-2xl font-bold text-green-600">{completionRate}%</p>
                <p className="text-xs text-gray-500 mt-1">Orders successfully completed</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Cancellation Rate</p>
                <p className="text-2xl font-bold text-red-600">{cancellationRate}%</p>
                <p className="text-xs text-gray-500 mt-1">Orders cancelled</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Revenue/Customer</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(avgRevenuePerCustomer)}</p>
                <p className="text-xs text-gray-500 mt-1">Average spend per customer</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Growth Trend</p>
                <p className={`text-2xl font-bold ${stats.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.revenue.growth >= 0 ? '+' : ''}{stats.revenue.growth}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Compared to previous period</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Continue with rest of the analytics... (due to length, splitting into parts) */}
      {/* Will add remaining sections in next part */}
    </motion.div>
  );
};
