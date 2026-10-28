import React from 'react';
import { useCafe } from '../context/CafeContext';
import { ShoppingBag, Stamp, Star, Send, LayoutDashboard } from 'lucide-react';
import { TabType } from '../types/cafe';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, role } = useCafe();

  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }>; roles: string[] }[] = [
    { id: 'ordering', label: 'QR Ordering', icon: ShoppingBag, roles: ['Owner', 'Staff', 'Customer'] },
    { id: 'stamp', label: 'Stamp Card', icon: Stamp, roles: ['Owner', 'Staff', 'Customer'] },
    { id: 'rewards', label: 'Reviews & Gifts', icon: Star, roles: ['Owner', 'Staff', 'Customer'] },
    { id: 'campaigns', label: 'Comeback', icon: Send, roles: ['Owner'] },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Owner', 'Staff'] }
  ];

  const filteredTabs = tabs.filter((t) => t.roles.includes(role));

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E8D5C4] px-2 py-1.5 shadow-lg">
      <div className="grid grid-cols-4 sm:grid-cols-5 items-center max-w-md mx-auto">
        {filteredTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
                isActive ? 'text-[#3D2314] font-semibold' : 'text-[#8C6D58] hover:text-[#523B2B]'
              }`}
            >
              <div
                className={`w-9 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  isActive ? 'bg-[#3D2314] text-[#FAF7F2]' : 'bg-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#C89D7C]' : ''}`} />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-[64px]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
