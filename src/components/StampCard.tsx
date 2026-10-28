import React, { useState } from 'react';
import { useCafe } from '../context/CafeContext';
import { Customer, Reward } from '../types/cafe';
import { Stamp, Coffee, Search, CheckCircle, Gift, Sparkles, User, Award, ShieldAlert, Plus } from 'lucide-react';

export const StampCard: React.FC = () => {
  const {
    customers,
    addStampToCustomer,
    rewards,
    redeemReward,
    role,
    settings,
    customerPhone,
    setCustomerPhone
  } = useCafe();

  const [searchPhone, setSearchPhone] = useState(customerPhone || '9876543210');
  const [stampSuccessMessage, setStampSuccessMessage] = useState<string | null>(null);

  const activeCustomer: Customer | undefined = customers.find(
    (c) => c.phone.replace(/\D/g, '') === searchPhone.replace(/\D/g, '')
  );

  const customerRewards: Reward[] = rewards.filter(
    (r) => r.customerPhone.replace(/\D/g, '') === searchPhone.replace(/\D/g, '')
  );

  const handleStaffAddStamp = async () => {
    if (!searchPhone || searchPhone.length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    const res = await addStampToCustomer(searchPhone);
    if (res.rewardUnlocked) {
      setStampSuccessMessage(`🎉 5th Stamp Completed! 1x FREE Coffee reward code issued for +91 ${res.customer.phone}!`);
    } else {
      setStampSuccessMessage(`☕ Stamp added! Current stamps: ${res.customer.stamps}/5 for +91 ${res.customer.phone}.`);
    }
    setTimeout(() => setStampSuccessMessage(null), 5000);
  };

  const currentStamps = activeCustomer ? activeCustomer.stamps : 0;

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Banner */}
      <div className="bg-[#3D2314] text-[#FAF7F2] p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="bg-[#C89D7C]/20 text-[#E8D5C4] px-2.5 py-0.5 rounded-full text-xs font-semibold">
            Digital Loyalty Program
          </span>
          <h2 className="text-xl font-bold font-['Outfit'] mt-1">
            Buy 4 Coffees, Get 5th FREE! ☕
          </h2>
          <p className="text-xs text-[#D8C2B0] mt-0.5">
            Every coffee order earns 1 stamp. Collect 5 stamps to unlock a free coffee reward code.
          </p>
        </div>

        {/* Phone Lookup for Staff/Customer */}
        <div className="w-full sm:w-auto">
          <label className="block text-[11px] text-[#D8C2B0] mb-1 font-medium">
            Customer Phone Lookup:
          </label>
          <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-[#E8D5C4]">
            <Search className="w-4 h-4 text-[#8C6D58] ml-2 shrink-0" />
            <input
              type="tel"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              placeholder="Search Phone (e.g. 9876543210)"
              className="w-full sm:w-48 bg-transparent text-xs font-mono font-semibold text-[#3D2314] px-1 py-1.5 outline-none"
            />
          </div>
        </div>
      </div>

      {stampSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl text-xs font-semibold text-emerald-900 flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{stampSuccessMessage}</span>
        </div>
      )}

      {/* Grid: Visual Stamp Card + Rewards / Staff Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Customer Stamp Card View */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-gradient-to-br from-[#FAF7F2] via-[#F5EFE6] to-[#EFE7DC] border-2 border-[#D8C2B0] rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3D2314]/5 rounded-full blur-2xl" />

            <div className="flex items-center justify-between pb-4 border-b border-[#E8D5C4]">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#8C6D58]">
                  {settings.cafeName}
                </span>
                <h3 className="text-lg font-bold text-[#3D2314] font-['Outfit']">
                  {activeCustomer ? activeCustomer.name : 'Valued Guest'}
                </h3>
                <p className="text-xs font-mono text-[#7C5A43]">
                  +91 {searchPhone || '----------'}
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-[#3D2314] text-[#FAF7F2] flex items-center justify-center shadow-sm">
                <Stamp className="w-6 h-6 text-[#C89D7C]" />
              </div>
            </div>

            {/* 5 Stamp Slots Grid */}
            <div className="py-6">
              <div className="text-xs font-semibold text-[#3D2314] mb-3 flex items-center justify-between">
                <span>Stamp Progress ({currentStamps} of 5 collected)</span>
                <span className="text-[11px] text-[#7C5A43]">
                  {5 - currentStamps === 0 ? '🎉 Free Coffee Unlocked!' : `${5 - currentStamps} stamps away`}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {[1, 2, 3, 4, 5].map((slot) => {
                  const isStamped = slot <= currentStamps;
                  const isRewardSlot = slot === 5;

                  return (
                    <div
                      key={slot}
                      className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 border-2 transition-all relative ${
                        isStamped
                          ? 'bg-[#3D2314] border-[#3D2314] text-[#FAF7F2] shadow-md scale-105'
                          : isRewardSlot
                          ? 'bg-amber-50 border-amber-300 border-dashed text-amber-800'
                          : 'bg-[#FAF7F2] border-[#E8D5C4] text-[#8C6D58]'
                      }`}
                    >
                      {isStamped ? (
                        <div className="text-center space-y-1">
                          <Coffee className="w-6 h-6 text-[#C89D7C] mx-auto animate-bounce" />
                          <span className="text-[10px] font-bold block text-[#FAF7F2]">
                            Stamp {slot}
                          </span>
                        </div>
                      ) : isRewardSlot ? (
                        <div className="text-center space-y-1">
                          <Gift className="w-6 h-6 text-amber-600 mx-auto" />
                          <span className="text-[9px] font-bold block text-amber-900">
                            FREE
                          </span>
                        </div>
                      ) : (
                        <div className="text-center">
                          <span className="text-xs font-mono font-bold text-[#A88B77] block">
                            #{slot}
                          </span>
                          <span className="text-[9px] text-[#A88B77]">Slot</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="w-full h-2.5 bg-[#E2D4C3] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#6F4E37] to-[#3D2314] transition-all duration-500 rounded-full"
                  style={{ width: `${(currentStamps / 5) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#7C5A43] font-medium pt-1">
                <span>Start</span>
                <span>2 Stamps</span>
                <span>4 Stamps</span>
                <span className="font-bold text-[#3D2314]">5th Free Coffee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Staff / Customer Control Sidebar */}
        <div className="lg:col-span-5 space-y-4">
          {/* Staff 1-Tap Stamp Action */}
          {role !== 'Customer' && (
            <div className="bg-[#FAF7F2] border border-[#E8D5C4] rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-[#3D2314]">
                <Award className="w-5 h-5 text-[#C89D7C]" />
                <h3 className="font-bold text-sm font-['Outfit']">Staff Stamp Management</h3>
              </div>
              <p className="text-xs text-[#7C5A43]">
                Add 1 stamp for phone <strong>+91 {searchPhone}</strong> upon order verification.
              </p>

              <button
                onClick={handleStaffAddStamp}
                className="w-full py-3 bg-[#3D2314] hover:bg-[#2A170C] text-[#FAF7F2] rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all"
              >
                <Plus className="w-4 h-4 text-[#C89D7C]" />
                <span>+1 Tap Add Stamp</span>
              </button>
            </div>
          )}

          {/* Active Rewards List */}
          <div className="bg-[#FAF7F2] border border-[#E8D5C4] rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-[#3D2314] text-xs font-['Outfit'] uppercase tracking-wider flex items-center justify-between">
              <span>Customer Rewards ({customerRewards.length})</span>
              <span className="text-[10px] font-normal text-[#7C5A43]">Code Redemption</span>
            </h3>

            {customerRewards.length === 0 ? (
              <div className="py-6 text-center space-y-1.5 text-xs text-[#8C6D58]">
                <Gift className="w-8 h-8 text-[#C89D7C] mx-auto opacity-70" />
                <p className="font-semibold">No active rewards yet</p>
                <p className="text-[11px] text-[#A88B77]">
                  Collect 5 stamps to generate a unique reward code.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {customerRewards.map((rw) => (
                  <div
                    key={rw.id}
                    className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                      rw.isRedeemed
                        ? 'bg-gray-50 border-gray-200 text-gray-500 opacity-80'
                        : 'bg-amber-50 border-amber-300 text-amber-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#3D2314]">{rw.title}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          rw.isRedeemed ? 'bg-gray-200 text-gray-700' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {rw.isRedeemed ? 'Redeemed' : 'Ready to Claim'}
                      </span>
                    </div>

                    <div className="bg-white p-2 rounded-lg font-mono font-bold text-center border border-amber-200 text-sm tracking-wider">
                      {rw.rewardCode}
                    </div>

                    {!rw.isRedeemed && (
                      <button
                        onClick={() => redeemReward(rw.id)}
                        className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg text-xs transition-colors"
                      >
                        Redeem Free Coffee Now
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
