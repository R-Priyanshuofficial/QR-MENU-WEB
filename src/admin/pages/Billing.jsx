import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Receipt,
  Printer,
  Search,
  Calendar,
  User,
  Phone,
  DollarSign,
  Download,
  Filter,
  X,
  Clock,
  ShoppingBag
} from 'lucide-react';
import { Card } from '@shared/components/Card';
import { Button } from '@shared/components/Button';
import { PageLoader } from '@shared/components/Spinner';
import { formatCurrency } from '@shared/utils/formatters';
import { calculateGST, formatGSTDetails, getRestaurantInfo } from '@shared/utils/gstHelper';
import { printBill, getPrinterSettings } from '@shared/utils/printerService';
import { ordersAPI } from '@shared/api/endpoints';
import toast from 'react-hot-toast';

export const Billing = () => {
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);
  const [dateFilter, setDateFilter] = useState('today');
  const printRef = useRef();

  useEffect(() => {
    fetchBills();
  }, [dateFilter]);

  useEffect(() => {
    filterBills();
  }, [searchTerm, bills]);

  const fetchBills = async () => {
    try {
      setLoading(true);
      // Fetch all completed orders
      const response = await ordersAPI.getOwnerOrders('completed');
      const completedOrders = response.data;

      // Apply date filter
      const filteredByDate = filterByDate(completedOrders);

      // Group orders by customer (name + phone)
      const groupedBills = groupOrdersByCustomer(filteredByDate);
      
      setBills(groupedBills);
      setFilteredBills(groupedBills);
    } catch (error) {
      toast.error('Failed to load billing data');
    } finally {
      setLoading(false);
    }
  };

  const filterByDate = (orders) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (dateFilter) {
      case 'today':
        return orders.filter(order => new Date(order.createdAt) >= today);
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return orders.filter(order => new Date(order.createdAt) >= weekAgo);
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return orders.filter(order => new Date(order.createdAt) >= monthAgo);
      default:
        return orders;
    }
  };

  const groupOrdersByCustomer = (orders) => {
    const grouped = {};

    orders.forEach(order => {
      const key = `${order.customerName}_${order.customerPhone}`;
      
      if (!grouped[key]) {
        grouped[key] = {
          id: key,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          orders: [],
          subtotal: 0,
          itemCount: 0,
          firstOrderDate: order.createdAt,
          lastOrderDate: order.createdAt
        };
      }

      grouped[key].orders.push(order);
      grouped[key].subtotal += order.totalAmount;
      grouped[key].itemCount += order.items.reduce((sum, item) => sum + item.quantity, 0);
      
      // Update dates
      if (new Date(order.createdAt) < new Date(grouped[key].firstOrderDate)) {
        grouped[key].firstOrderDate = order.createdAt;
      }
      if (new Date(order.createdAt) > new Date(grouped[key].lastOrderDate)) {
        grouped[key].lastOrderDate = order.createdAt;
      }
    });

    // Convert to array, calculate GST for each bill, and sort by last order date
    return Object.values(grouped).map(bill => {
      const gst = calculateGST(bill.subtotal);
      return {
        ...bill,
        gst,
        totalAmount: bill.subtotal + gst.total
      };
    }).sort((a, b) => 
      new Date(b.lastOrderDate) - new Date(a.lastOrderDate)
    );
  };

  const filterBills = () => {
    if (!searchTerm.trim()) {
      setFilteredBills(bills);
      return;
    }

    const filtered = bills.filter(bill => 
      bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.customerPhone.includes(searchTerm)
    );
    setFilteredBills(filtered);
  };

  const handlePrint = async (bill) => {
    try {
      const result = await printBill(bill);
      if (result.success) {
        const printerSettings = getPrinterSettings();
        if (printerSettings.mode === 'direct') {
          toast.success('Bill sent to thermal printer!', { icon: '🖨️' });
        }
      }
    } catch (error) {
      console.error('Print error:', error);
      toast.error('Failed to print bill');
    }
  };

  const handleDownloadReceipt = async (bill) => {
    // Same as print for now
    await handlePrint(bill);
  };

  if (loading) return <PageLoader message="Loading billing data..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Billing & Receipts
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Manage customer bills and generate receipts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={fetchBills}
            size="sm"
            variant="outline"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export All
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <div className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by customer name or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Date Filter */}
              <div className="flex gap-2">
                {['today', 'week', 'month', 'all'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setDateFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      dateFilter === filter
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Bills</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {filteredBills.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Receipt className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(filteredBills.reduce((sum, bill) => sum + bill.totalAmount, 0))}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Unique Customers</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {filteredBills.length}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg. Bill Value</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {filteredBills.length > 0 
                      ? formatCurrency(filteredBills.reduce((sum, bill) => sum + bill.totalAmount, 0) / filteredBills.length)
                      : formatCurrency(0)
                    }
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <ShoppingBag className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Bills List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {filteredBills.length === 0 ? (
          <Card>
            <div className="p-12 text-center">
              <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No Bills Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm ? 'Try adjusting your search terms' : 'Bills will appear here when orders are completed'}
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence>
              {filteredBills.map((bill, index) => (
                <BillCard
                  key={bill.id}
                  bill={bill}
                  index={index}
                  onPrint={handlePrint}
                  onDownload={handleDownloadReceipt}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const BillCard = ({ bill, index, onPrint, onDownload }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Flatten all items from all orders
  const allItems = bill.orders.flatMap(order => order.items);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card hover>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {bill.customerName}
                </h3>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded">
                  {bill.orders.length} {bill.orders.length === 1 ? 'Order' : 'Orders'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>{bill.customerPhone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(bill.lastOrderDate).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ShoppingBag className="w-4 h-4" />
                  <span>{bill.itemCount} items</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="space-y-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">Subtotal</p>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  {formatCurrency(bill.subtotal)}
                </p>
                {bill.gst.enabled && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    +GST ({bill.gst.totalRate}%): {formatCurrency(bill.gst.total)}
                  </p>
                )}
                <p className="text-2xl font-bold text-green-600 pt-1 border-t border-gray-200 dark:border-gray-600">
                  {formatCurrency(bill.totalAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* GST Breakdown (if enabled and expanded) */}
          {bill.gst.enabled && bill.gst.showBreakdown && expanded && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">GST Breakdown</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">CGST ({bill.gst.cgstRate}%):</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {formatCurrency(bill.gst.cgst)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">SGST ({bill.gst.sgstRate}%):</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {formatCurrency(bill.gst.sgst)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Items Preview */}
          <div className="mb-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {expanded ? 'Hide' : 'Show'} Items ({allItems.length})
            </button>
            
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3 space-y-2"
              >
                {allItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Qty: {item.quantity} × {formatCurrency(item.price)}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={() => onDownload(bill)}
              size="sm"
              className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Printer className="w-4 h-4" />
              Print Receipt
            </Button>
            <Button
              onClick={() => onDownload(bill)}
              size="sm"
              variant="outline"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
