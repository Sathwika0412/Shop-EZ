import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Order, Product } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  ShoppingBag, 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertTriangle,
  RefreshCw,
  Search
} from 'lucide-react';
import { motion } from 'motion/react';

export const SellerDashboard: React.FC = () => {
  const { fetchAllOrders, updateOrderStatus, products } = useShop();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadAllOrders = async () => {
    setLoading(true);
    try {
      const list = await fetchAllOrders();
      setOrders(list);
    } catch (error) {
      console.error('Failed to load orders in seller dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllOrders();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // 1. Calculate Metrics
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const completedOrdersCount = orders.filter((o) => o.status === 'Delivered').length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;
  const activeOrdersCount = orders.filter((o) => o.status === 'Pending' || o.status === 'Dispatched').length;

  const lowStockProducts = products.filter((p) => p.stock <= 5);

  // 2. Prepare charts data
  // Sales by Category
  const categorySalesMap: Record<string, number> = {
    Books: 0,
    Menwear: 0,
    Womenwear: 0,
    Accessories: 0,
    Electronics: 0,
    Skincare: 0,
    Gadgets: 0,
    'Home Appliances': 0
  };

  orders
    .filter((o) => o.status !== 'Cancelled')
    .forEach((o) => {
      o.items.forEach((item) => {
        // Find matching product category to accumulate correctly
        const matchedProd = products.find((p) => p.id === item.productId);
        const category = matchedProd?.category || 'Books';
        categorySalesMap[category] = (categorySalesMap[category] || 0) + (item.price * item.quantity);
      });
    });

  const categoryChartData = Object.entries(categorySalesMap).map(([name, value]) => ({
    name,
    Revenue: value
  }));

  // Weekly sales trend (Simulated based on last 7 days of orders or dates)
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dailySalesTrend = [
    { day: 'Mon', Sales: Math.round(totalRevenue * 0.1) || 2500 },
    { day: 'Tue', Sales: Math.round(totalRevenue * 0.15) || 5000 },
    { day: 'Wed', Sales: Math.round(totalRevenue * 0.12) || 4500 },
    { day: 'Thu', Sales: Math.round(totalRevenue * 0.2) || 8900 },
    { day: 'Fri', Sales: Math.round(totalRevenue * 0.18) || 7500 },
    { day: 'Sat', Sales: Math.round(totalRevenue * 0.25) || 12000 },
    { day: 'Sun', Sales: Math.round(totalRevenue * 0.3) || 15000 }
  ];

  // 3. Handle Status Updates
  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      // Update local state list
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (error) {
      alert('Failed to update status. Double check permissions.');
    }
  };

  // 4. Filtering list
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesQuery = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingAddress.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingAddress.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Seller Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-xs font-bold font-mono tracking-wider text-amber-600 uppercase">ShopEZ Seller Hub</span>
          <h1 className="font-sans font-extrabold text-2xl sm:text-3xl tracking-tight text-stone-900 mt-1">
            Order Administration & Business Growth
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">Manage handicraft inventory, approve deliveries, and analyze luxury trade trends.</p>
        </div>
        <button
          onClick={loadAllOrders}
          className="px-4 py-2 bg-stone-950 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-stone-800 transition-all cursor-pointer self-start sm:self-center"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* Analytics Dashboard Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Total Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] font-bold font-mono text-stone-400 uppercase tracking-wider">Gross Revenue</span>
            <span className="text-lg font-extrabold text-stone-900 font-mono">{formatCurrency(totalRevenue)}</span>
          </div>
        </div>

        {/* Metric 2: Completed Sales */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-green-500/10 text-green-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] font-bold font-mono text-stone-400 uppercase tracking-wider">Delivered Orders</span>
            <span className="text-lg font-extrabold text-stone-900 font-mono">{completedOrdersCount}</span>
          </div>
        </div>

        {/* Metric 3: Pending Shipment */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-blue-50/15 text-blue-600 rounded-xl">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="block text-[10px] font-bold font-mono text-stone-400 uppercase tracking-wider">Active Pipeline</span>
            <span className="text-lg font-extrabold text-stone-900 font-mono">{activeOrdersCount}</span>
          </div>
        </div>

        {/* Metric 4: Low Inventory Alert */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex items-center space-x-4">
          <div className={`p-3 rounded-xl ${lowStockProducts.length > 0 ? 'bg-rose-50 text-rose-500' : 'bg-green-50 text-green-500'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] font-bold font-mono text-stone-400 uppercase tracking-wider">Low Stock Products</span>
            <span className="text-lg font-extrabold text-stone-900 font-mono">{lowStockProducts.length} items</span>
          </div>
        </div>

      </div>

      {/* Visual Charts Grid using Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Revenue Trends (Area Chart) */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-sans font-bold text-sm text-stone-800">Weekly Revenue Timeline</h3>
            <p className="text-[10px] text-stone-400 font-mono">Gross Earnings in Indian Rupees (₹)</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailySalesTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
                <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                <Area type="monotone" dataKey="Sales" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Sales by Category (Bar Chart) */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-sans font-bold text-sm text-stone-800">Category Share breakdown</h3>
            <p className="text-[10px] text-stone-400 font-mono">Direct sales across creative cooperatives</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
                <Tooltip formatter={(value) => [`₹${value}`, 'Earnings']} />
                <Bar dataKey="Revenue" fill="#292524" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Inventory & Stock Tracking Quicklist */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 space-y-3">
          <div className="flex items-center space-x-1.5 text-amber-800">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h3 className="font-sans font-bold text-sm text-stone-800">Cooperative Restocking Warning</h3>
          </div>
          <p className="text-xs text-stone-600">The following hand-crafted items are running low on stock due to high seasonal customer orders. Please contact local weavers or sculptors to procure more lots.</p>
          <div className="flex flex-wrap gap-3 pt-1">
            {lowStockProducts.map((p) => (
              <span key={p.id} className="inline-flex items-center space-x-1 px-3 py-1 bg-white border border-amber-200 rounded-lg text-xs font-semibold text-stone-800 font-mono">
                <span>{p.name}:</span>
                <span className="text-red-500 font-bold">{p.stock} units left</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Orders Management Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden space-y-4 p-6">
        
        {/* Table Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-sans font-bold text-base text-stone-800">Pipeline Fulfillment Control</h3>
            <p className="text-xs text-stone-400 font-mono">Admin access to real-time customer transactions</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search orders, client name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-4 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            {/* Filter buttons */}
            {['All', 'Pending', 'Dispatched', 'Delivered', 'Cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Data List Table */}
        {loading ? (
          <div className="text-center py-12 font-mono text-xs text-stone-400">Syncing transaction data...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-stone-400 text-sm">No transactions match the filter criteria.</div>
        ) : (
          <div className="overflow-x-auto border border-stone-200 rounded-xl">
            <table className="w-full text-left text-xs text-stone-600 border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold font-mono uppercase tracking-wider text-stone-400">
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Customer & Address</th>
                  <th className="p-4">Ordered Treasures</th>
                  <th className="p-4">Total Price (₹)</th>
                  <th className="p-4 text-center">Fulfillment Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                    
                    {/* ID & Date */}
                    <td className="p-4 space-y-1">
                      <p className="font-mono font-bold text-stone-800 truncate max-w-28" title={order.id}>
                        {order.id.replace('order-', 'EZ-')}
                      </p>
                      <p className="text-[10px] text-stone-400 font-mono">
                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </td>

                    {/* Customer Info */}
                    <td className="p-4 space-y-1">
                      <p className="font-bold text-stone-800">{order.shippingAddress.name}</p>
                      <p className="text-[10px] text-stone-500 max-w-44 truncate" title={`${order.shippingAddress.address}, ${order.shippingAddress.city}`}>
                        {order.shippingAddress.city}, {order.shippingAddress.state} ({order.shippingAddress.pinCode})
                      </p>
                      <p className="text-[10px] font-mono text-stone-400">{order.shippingAddress.phone}</p>
                    </td>

                    {/* Items */}
                    <td className="p-4 space-y-1 max-w-44">
                      {order.items.map((item, idx) => (
                        <p key={idx} className="text-[10px] text-stone-700 truncate">
                          • <span className="font-semibold text-stone-800">{item.name}</span> x {item.quantity}
                        </p>
                      ))}
                    </td>

                    {/* Total */}
                    <td className="p-4 font-mono font-bold text-stone-900">
                      {formatCurrency(order.totalAmount)}
                    </td>

                    {/* Action Dropdown */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {order.status === 'Cancelled' ? (
                          <span className="px-2.5 py-1 bg-red-100 text-red-600 font-bold rounded-full text-[9px] uppercase tracking-wider font-mono">
                            Cancelled
                          </span>
                        ) : order.status === 'Delivered' ? (
                          <span className="px-2.5 py-1 bg-green-100 text-green-700 font-bold rounded-full text-[9px] uppercase tracking-wider font-mono">
                            Delivered
                          </span>
                        ) : (
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                            className="text-xs font-semibold p-1.5 bg-stone-100 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          >
                            <option value="Pending">Pending Approval</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Delivered">Delivered (Verify)</option>
                            <option value="Cancelled">Cancel Transaction</option>
                          </select>
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};
