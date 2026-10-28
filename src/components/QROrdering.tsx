import React, { useState } from 'react';
import { useCafe } from '../context/CafeContext';
import { CategoryType, MenuItem, OrderStatus } from '../types/cafe';
import {
  Coffee,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  CheckCircle2,
  Clock,
  QrCode,
  Smartphone,
  ChefHat,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const QROrdering: React.FC = () => {
  const {
    menuItems,
    selectedCategory,
    setSelectedCategory,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    tableNumber,
    setTableNumber,
    customerPhone,
    setCustomerPhone,
    customerName,
    setCustomerName,
    placeOrder,
    orders,
    updateOrderStatus,
    role,
    settings,
    setQrModalOpen,
    activeOrderConfirmation,
    setActiveOrderConfirmation,
    qrTableContext
  } = useCafe();

  const [placing, setPlacing] = useState(false);
  const categories: CategoryType[] = ['All', 'Coffee', 'Tea', 'Cold Drinks', 'Snacks', 'Desserts'];

  const filteredItems = menuItems.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const subtotal = cart.reduce((acc, ci) => acc + ci.menuItem.price * ci.quantity, 0);
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      await placeOrder();
    } finally {
      setPlacing(false);
    }
  };

  const currentTable = qrTableContext || tableNumber;

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Top Header Banner / Context Banner */}
      <div className="bg-gradient-to-r from-[#3D2314] to-[#5C3A24] text-[#FAF7F2] p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#C89D7C]/20 text-[#E8D5C4] px-2.5 py-0.5 rounded-full text-xs font-semibold">
              {currentTable} Active
            </span>
            <span className="text-xs text-[#D8C2B0]">· Instant QR Table Service</span>
          </div>
          <h2 className="text-xl font-bold font-['Outfit'] mt-1">
            {settings.cafeName} Digital Menu
          </h2>
          <p className="text-xs text-[#D8C2B0] mt-0.5">
            Select items, enter mobile number to earn 1 stamp towards a free coffee!
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Table Selector */}
          <div className="bg-[#FAF7F2]/10 p-1.5 rounded-xl border border-[#FAF7F2]/20 flex items-center gap-2">
            <span className="text-xs font-medium text-[#FAF7F2] pl-2">Table:</span>
            <select
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="bg-[#FAF7F2] text-[#3D2314] text-xs font-semibold px-2.5 py-1 rounded-lg border-none focus:ring-2 focus:ring-[#C89D7C]"
            >
              {Array.from({ length: settings.totalTables }, (_, i) => `Table ${i + 1}`).map((tbl) => (
                <option key={tbl} value={tbl}>
                  {tbl}
                </option>
              ))}
            </select>
          </div>

          {role !== 'Customer' && (
            <button
              onClick={() => setQrModalOpen(true)}
              className="p-2 bg-[#C89D7C] hover:bg-[#B58A6A] text-[#3D2314] rounded-xl transition-colors font-medium text-xs flex items-center gap-1"
              title="Show Table QR Standees"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">QR Standee</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Menu Catalog + Cart Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Menu Catalog Column */}
        <div className="lg:col-span-7 space-y-4">
          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-medium rounded-xl transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#3D2314] text-[#FAF7F2] shadow-sm font-semibold'
                      : 'bg-[#FAF7F2] text-[#6F4E37] border border-[#E8D5C4] hover:bg-[#F2E8DC]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Menu Items Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#FAF7F2] border border-[#E8D5C4] rounded-2xl overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="relative h-40 bg-[#EFE7DC] overflow-hidden group">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback visual
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {item.popular && (
                    <span className="absolute top-2 left-2 bg-[#3D2314] text-[#C89D7C] text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-3 h-3" /> Popular
                    </span>
                  )}
                  <span className="absolute bottom-2 right-2 bg-[#FAF7F2]/90 backdrop-blur-md text-[#3D2314] text-xs font-bold px-2.5 py-1 rounded-lg border border-[#E8D5C4] shadow-sm font-mono">
                    ₹{item.price}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-[#3D2314] text-sm leading-tight font-['Outfit']">
                        {item.name}
                      </h3>
                      <span className="text-[10px] text-[#7C5A43] bg-[#EFE7DC] px-2 py-0.5 rounded-full font-medium shrink-0">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-[#7C5A43] mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <button
                    onClick={() => addToCart(item)}
                    className="w-full py-2 px-3 bg-[#3D2314] hover:bg-[#2A170C] text-[#FAF7F2] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm active:scale-[0.98]"
                  >
                    <Plus className="w-4 h-4 text-[#C89D7C]" />
                    <span>Add to Order</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shopping Cart & Checkout Drawer Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#FAF7F2] border border-[#E8D5C4] rounded-2xl p-5 shadow-sm space-y-4 sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8D5C4]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#3D2314] text-[#FAF7F2] flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-[#C89D7C]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#3D2314] text-sm font-['Outfit']">Your Order Cart</h3>
                  <p className="text-[11px] text-[#7C5A43]">
                    {currentTable} · {cart.length} unique items
                  </p>
                </div>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={() => addToCart(menuItems[0])}
                  className="text-xs text-[#8C6D58] hover:text-[#3D2314] underline"
                >
                  Quick Add
                </button>
              )}
            </div>

            {/* Cart Items List */}
            {cart.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#EFE7DC] text-[#7C5A43] flex items-center justify-center mx-auto">
                  <Coffee className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-[#523B2B]">Your cart is currently empty</p>
                <p className="text-[11px] text-[#8C6D58]">Select items from the menu to build your table order.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((ci) => (
                  <div
                    key={ci.menuItem.id}
                    className="flex items-center justify-between bg-[#F5EFE6] p-3 rounded-xl border border-[#E8D5C4] text-xs"
                  >
                    <div className="flex-1 pr-2">
                      <div className="font-bold text-[#3D2314]">{ci.menuItem.name}</div>
                      <div className="text-[#7C5A43] text-[11px] font-mono">
                        ₹{ci.menuItem.price} x {ci.quantity} = ₹{ci.menuItem.price * ci.quantity}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => updateCartQuantity(ci.menuItem.id, -1)}
                        className="w-6 h-6 rounded-lg bg-[#EAE0D3] hover:bg-[#DFD2C2] text-[#3D2314] flex items-center justify-center"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-5 text-center font-bold font-mono text-[#3D2314]">
                        {ci.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(ci.menuItem.id, 1)}
                        className="w-6 h-6 rounded-lg bg-[#3D2314] hover:bg-[#2A170C] text-[#FAF7F2] flex items-center justify-center"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeFromCart(ci.menuItem.id)}
                        className="w-6 h-6 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 flex items-center justify-center ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Customer Contact Input for Loyalty & Status */}
            {cart.length > 0 && (
              <div className="pt-3 border-t border-[#E8D5C4] space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3D2314] mb-1">
                    Mobile Number (Earn Loyalty Stamp) <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-semibold text-[#7C5A43]">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full pl-11 pr-3 py-2 text-xs font-mono font-semibold bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl focus:ring-2 focus:ring-[#3D2314] outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-[#7C5A43] mt-1">
                    Used for SMS/WhatsApp order update & automatic loyalty stamp card.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D2314] mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl focus:ring-2 focus:ring-[#3D2314] outline-none"
                  />
                </div>

                {/* Bill Breakdown */}
                <div className="bg-[#EFE7DC] p-3 rounded-xl text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between text-[#7C5A43]">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#7C5A43]">
                    <span>5% GST Tax</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#3D2314] font-bold text-sm pt-1 border-t border-[#DFD2C2]">
                    <span>Grand Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="w-full py-3 bg-[#3D2314] hover:bg-[#2A170C] text-[#FAF7F2] rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <ChefHat className="w-4 h-4 text-[#C89D7C]" />
                  <span>{placing ? 'Sending to Kitchen...' : `Place Order (₹${total})`}</span>
                </button>
              </div>
            )}
          </div>

          {/* Active Live Orders Feed for Staff or Customer */}
          <div className="bg-[#FAF7F2] border border-[#E8D5C4] rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-[#3D2314] text-xs font-['Outfit'] uppercase tracking-wider flex items-center justify-between">
              <span>Live Kitchen Orders ({orders.length})</span>
              <span className="text-[10px] font-normal text-[#7C5A43]">Real-time Status</span>
            </h3>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {orders.slice(0, 5).map((ord) => {
                const statusColors: Record<OrderStatus, string> = {
                  Received: 'bg-amber-100 text-amber-800 border-amber-300',
                  Preparing: 'bg-blue-100 text-blue-800 border-blue-300',
                  Ready: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                  Served: 'bg-gray-100 text-gray-700 border-gray-300',
                  Cancelled: 'bg-red-100 text-red-800 border-red-300'
                };

                return (
                  <div
                    key={ord.id}
                    className="p-3 bg-[#F5EFE6] rounded-xl border border-[#E8D5C4] text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-[#3D2314] flex items-center gap-2">
                        <span>{ord.orderNumber}</span>
                        <span className="text-[10px] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E8D5C4] text-[#7C5A43]">
                          {ord.tableNumber}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          statusColors[ord.status]
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#6F4E37] line-clamp-1">
                      {ord.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(', ')}
                    </div>

                    {/* Staff status update controls */}
                    {role !== 'Customer' && (
                      <div className="flex items-center gap-1 pt-1 border-t border-[#E8D5C4]">
                        <span className="text-[10px] text-[#7C5A43] mr-1">Status:</span>
                        {(['Received', 'Preparing', 'Ready', 'Served'] as OrderStatus[]).map((st) => (
                          <button
                            key={st}
                            onClick={() => updateOrderStatus(ord.id, st)}
                            className={`px-2 py-0.5 text-[9px] font-semibold rounded ${
                              ord.status === st
                                ? 'bg-[#3D2314] text-[#FAF7F2]'
                                : 'bg-[#EAE0D3] text-[#523B2B] hover:bg-[#DFD2C2]'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      {activeOrderConfirmation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#FAF7F2] rounded-3xl p-6 max-w-sm w-full border border-[#E8D5C4] shadow-xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold text-[#C89D7C] uppercase tracking-wider">
                Order Sent to Kitchen!
              </span>
              <h3 className="text-xl font-bold text-[#3D2314] font-['Outfit'] mt-0.5">
                {activeOrderConfirmation.orderNumber}
              </h3>
              <p className="text-xs text-[#7C5A43] mt-1">
                {activeOrderConfirmation.tableNumber} · Total ₹{activeOrderConfirmation.total.toFixed(2)}
              </p>
            </div>

            <div className="bg-[#EFE7DC] p-3 rounded-2xl text-left text-xs space-y-1">
              <div className="font-semibold text-[#3D2314] mb-1">Items Prepared:</div>
              {activeOrderConfirmation.items.map((it) => (
                <div key={it.menuItem.id} className="flex justify-between text-[#6F4E37]">
                  <span>{it.quantity}x {it.menuItem.name}</span>
                  <span className="font-mono">₹{it.menuItem.price * it.quantity}</span>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-left text-xs space-y-1 text-amber-900">
              <div className="font-bold flex items-center gap-1 text-amber-800">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Loyalty Stamp Earned!</span>
              </div>
              <p className="text-[11px] leading-tight">
                1 stamp added for mobile +91 {activeOrderConfirmation.customerPhone}. Check the <strong>Stamp Card</strong> tab to see your progress toward a FREE Coffee!
              </p>
            </div>

            <button
              onClick={() => setActiveOrderConfirmation(null)}
              className="w-full py-2.5 bg-[#3D2314] text-[#FAF7F2] font-semibold text-xs rounded-xl hover:bg-[#2A170C] transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
