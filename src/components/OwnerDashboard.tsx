import React, { useState } from 'react';
import { useCafe } from '../context/CafeContext';
import {
  IndianRupee,
  ShoppingBag,
  Users,
  Repeat,
  Gift,
  AlertTriangle,
  TrendingUp,
  Award,
  Calendar,
  ChevronRight,
  Coffee,
  CheckCircle2,
  Clock
} from 'lucide-react';

type DateFilterType = 'Today' | 'Yesterday' | 'Last 7 Days' | 'Last 30 Days';

export const OwnerDashboard: React.FC = () => {
  const { orders, customers, rewards, campaigns, menuItems, settings } = useCafe();
  const [dateFilter, setDateFilter] = useState<DateFilterType>('Last 7 Days');

  // Calculated Metrics
  const todayOrders = orders.length; // Active orders count
  const todaySales = orders.reduce((sum, o) => sum + o.total, 0);

  const totalCustomersCount = customers.length;
  const repeatCustomersCount = customers.filter((c) => c.totalVisits > 1).length;
  const repeatPercentage =
    totalCustomersCount > 0 ? Math.round((repeatCustomersCount / totalCustomersCount) * 100) : 0;

  const activeRewardsCount = rewards.filter((r) => !r.isRedeemed).length;

  const now = Date.now();
  const inactive21DaysCount = customers.filter((c) => {
    const lastVisitMs = new Date(c.lastVisit).getTime();
    return Math.floor((now - lastVisitMs) / (1000 * 60 * 60 * 24)) >= 21;
  }).length;

  const offersSentCount = campaigns.length;
  const returnedCount = campaigns.filter((c) => c.returned).length;

  // Most Popular Items
  const popularItems = [...menuItems]
    .sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0))
    .slice(0, 4);

  // Sales Chart Data (Last 7 Days sample calculations)
  const salesChartData = [
    { day: 'Mon', sales: 4200 },
    { day: 'Tue', sales: 5600 },
    { day: 'Wed', sales: 4800 },
    { day: 'Thu', sales: 6200 },
    { day: 'Fri', sales: 7900 },
    { day: 'Sat', sales: 11400 },
    { day: 'Sun', sales: 9800 }
  ];

  const maxChartSales = Math.max(...salesChartData.map((d) => d.sales), 10000);

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Top Banner & Date Filter */}
      <div className="bg-[#3D2314] text-[#FAF7F2] p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="bg-[#C89D7C]/20 text-[#E8D5C4] px-2.5 py-0.5 rounded-full text-xs font-semibold">
            {settings.cafeName} Overview
          </span>
          <h2 className="text-xl font-bold font-['Outfit'] mt-1">
            Cafe Executive Dashboard 📊
          </h2>
          <p className="text-xs text-[#D8C2B0] mt-0.5">
            Real-time analytics for QR orders, revenue in INR, loyalty cards, and campaign performance.
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center gap-1 bg-[#FAF7F2]/10 p-1 rounded-xl border border-[#FAF7F2]/20">
          {(['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days'] as DateFilterType[]).map((df) => (
            <button
              key={df}
              onClick={() => setDateFilter(df)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                dateFilter === df
                  ? 'bg-[#FAF7F2] text-[#3D2314] font-semibold shadow-sm'
                  : 'text-[#D8C2B0] hover:text-[#FAF7F2]'
              }`}
            >
              {df}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Sales */}
        <div className="bg-[#FAF7F2] border border-[#E8D5C4] p-4 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7C5A43]">Today's Sales</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#3D2314]">
            ₹{todaySales.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14.2% vs previous week
          </p>
        </div>

        {/* Today's Orders */}
        <div className="bg-[#FAF7F2] border border-[#E8D5C4] p-4 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7C5A43]">Today's Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#3D2314]">{todayOrders}</div>
          <p className="text-[10px] text-[#7C5A43]">Live QR table & takeaway</p>
        </div>

        {/* Repeat Customer Rate */}
        <div className="bg-[#FAF7F2] border border-[#E8D5C4] p-4 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7C5A43]">Repeat Guests</span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
              <Repeat className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#3D2314]">{repeatPercentage}%</div>
          <p className="text-[10px] text-[#7C5A43]">
            {repeatCustomersCount} of {totalCustomersCount} registered
          </p>
        </div>

        {/* Inactive 21+ Days */}
        <div className="bg-[#FAF7F2] border border-[#E8D5C4] p-4 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7C5A43]">Inactive 21+ Days</span>
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-800 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-red-700">{inactive21DaysCount}</div>
          <p className="text-[10px] text-red-600 font-medium">Ready for Comeback campaign</p>
        </div>
      </div>

      {/* Grid: Sales Chart + Popular Items & Campaign Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sales Chart SVG Column */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#FAF7F2] border border-[#E8D5C4] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#3D2314] text-sm font-['Outfit']">
                  Weekly Sales Breakdown (INR ₹)
                </h3>
                <p className="text-[11px] text-[#7C5A43]">Daily revenue recorded across table QR orders.</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#3D2314] bg-[#EFE7DC] px-2.5 py-1 rounded-lg">
                Total ₹{salesChartData.reduce((a, b) => a + b.sales, 0).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="pt-4 pb-2 px-2">
              <div className="h-44 flex items-end justify-between gap-3 border-b border-[#E8D5C4] pb-2">
                {salesChartData.map((d) => {
                  const heightPct = Math.round((d.sales / maxChartSales) * 100);
                  return (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono font-bold text-[#3D2314] bg-[#EFE7DC] px-1.5 py-0.5 rounded shadow-sm">
                        ₹{d.sales}
                      </div>
                      <div
                        className="w-full bg-gradient-to-t from-[#3D2314] to-[#6F4E37] rounded-t-lg group-hover:to-[#C89D7C] transition-all duration-300"
                        style={{ height: `${heightPct}%` }}
                      />
                      <span className="text-xs font-semibold text-[#7C5A43]">{d.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Orders List */}
          <div className="bg-[#FAF7F2] border border-[#E8D5C4] rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-[#3D2314] text-sm font-['Outfit'] flex items-center justify-between">
              <span>Recent Table Orders</span>
              <span className="text-xs font-normal text-[#7C5A43]">Live Activity</span>
            </h3>

            <div className="space-y-2">
              {orders.slice(0, 4).map((ord) => (
                <div
                  key={ord.id}
                  className="p-3 bg-[#F5EFE6] rounded-xl border border-[#E8D5C4] text-xs flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-[#3D2314] flex items-center gap-2">
                      <span>{ord.orderNumber}</span>
                      <span className="text-[10px] text-[#7C5A43]">{ord.tableNumber}</span>
                    </div>
                    <div className="text-[11px] text-[#6F4E37]">
                      {ord.customerName} ({ord.customerPhone})
                    </div>
                  </div>

                  <div className="text-right space-y-0.5 font-mono">
                    <div className="font-bold text-[#3D2314]">₹{ord.total.toFixed(2)}</div>
                    <div className="text-[10px] text-emerald-700 font-semibold">{ord.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Items & Campaign Conversion Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          {/* Most Popular Menu Items */}
          <div className="bg-[#FAF7F2] border border-[#E8D5C4] rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-[#3D2314] text-sm font-['Outfit']">
              Top Selling Menu Items
            </h3>

            <div className="space-y-2.5">
              {popularItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2.5 bg-[#F5EFE6] rounded-xl border border-[#E8D5C4] text-xs"
                >
                  <span className="w-5 font-bold font-mono text-[#7C5A43] text-center">
                    #{idx + 1}
                  </span>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#3D2314] truncate">{item.name}</div>
                    <div className="text-[10px] text-[#7C5A43] font-mono">₹{item.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Campaign Return Performance */}
          <div className="bg-[#FAF7F2] border border-[#E8D5C4] rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-[#3D2314] text-sm font-['Outfit']">
              WhatsApp Campaign Performance
            </h3>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-[#EFE7DC] rounded-xl border border-[#DFD2C2]">
                <div className="text-xl font-bold font-mono text-[#3D2314]">{offersSentCount}</div>
                <div className="text-[10px] text-[#7C5A43] mt-0.5">Offers Sent</div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="text-xl font-bold font-mono text-emerald-800">{returnedCount}</div>
                <div className="text-[10px] text-emerald-700 mt-0.5">Guests Returned</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
