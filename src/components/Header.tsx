import React from 'react';
import { useCafe } from '../context/CafeContext';
import { Coffee, QrCode, HelpCircle, Shield, User, Store } from 'lucide-react';
import { UserRole } from '../types/cafe';

export const Header: React.FC = () => {
  const { role, setRole, setQrModalOpen, setSetupGuideOpen, cart, setActiveTab, activeTab } = useCafe();

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8D5C4] px-4 md:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#3D2314] text-[#FAF7F2] flex items-center justify-center shadow-sm">
            <Coffee className="w-5 h-5 text-[#C89D7C]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#3D2314] font-['Outfit'] whitespace-nowrap">
              CafeDesk
            </h1>
            <p className="text-[11px] font-medium text-[#7C5A43] leading-none hidden sm:block">
              India Cafe OS & Loyalty
            </p>
          </div>
        </div>

        {/* Zone 2: Role Switcher Segmented Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-[#EFE7DC] rounded-xl border border-[#E2D4C3]">
          {(['Owner', 'Staff', 'Customer'] as UserRole[]).map((r) => {
            const isActive = role === r;
            return (
              <button
                key={r}
                onClick={() => {
                  setRole(r);
                  if (r === 'Customer') setActiveTab('ordering');
                  else if (r === 'Staff' && activeTab === 'campaigns') setActiveTab('ordering');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#3D2314] text-[#FAF7F2] shadow-sm'
                    : 'text-[#6F4E37] hover:text-[#3D2314] hover:bg-[#E4D7C7]'
                }`}
              >
                {r === 'Owner' && <Store className="w-3.5 h-3.5 text-[#C89D7C]" />}
                {r === 'Staff' && <Shield className="w-3.5 h-3.5 text-[#C89D7C]" />}
                {r === 'Customer' && <User className="w-3.5 h-3.5 text-[#C89D7C]" />}
                <span>{r}</span>
              </button>
            );
          })}
        </div>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Setup Guide Modal Trigger */}
          <button
            onClick={() => setSetupGuideOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#523B2B] bg-[#EFE7DC] hover:bg-[#E4D7C7] border border-[#E2D4C3] rounded-xl transition-colors"
            title="Cafe Desk Setup & Firebase Guide"
          >
            <HelpCircle className="w-4 h-4 text-[#7C5A43]" />
            <span className="hidden md:inline">Setup Guide</span>
          </button>

          {/* QR Code Trigger for Owners/Staff */}
          {role !== 'Customer' && (
            <button
              onClick={() => setQrModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#FAF7F2] bg-[#3D2314] hover:bg-[#2A170C] rounded-xl transition-colors shadow-sm"
            >
              <QrCode className="w-4 h-4 text-[#C89D7C]" />
              <span className="hidden sm:inline">Table QR Codes</span>
            </button>
          )}

          {/* Quick Cart count for Customer */}
          {role === 'Customer' && totalCartItems > 0 && (
            <button
              onClick={() => setActiveTab('ordering')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#FAF7F2] bg-[#3D2314] rounded-xl shadow-sm"
            >
              <span>Cart ({totalCartItems})</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
