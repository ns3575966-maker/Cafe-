import React from 'react';
import { useCafe } from '../context/CafeContext';
import { ShoppingBag, Stamp, Star, Send, LayoutDashboard, Coffee, Sparkles } from 'lucide-react';
import { TabType } from '../types/cafe';

export const DesktopSidebar: React.FC = () => {
  const { activeTab, setActiveTab, role, isFirebaseConnected } = useCafe();

  const navItems: { id: TabType; label: string; desc: string; icon: React.FC<{ className?: string }>; roles: string[] }[] = [
    {
      id: 'ordering',
      label: 'QR Table Ordering',
      desc: 'Menu catalog, active cart & orders',
      icon: ShoppingBag,
      roles: ['Owner', 'Staff', 'Customer']
    },
    {
      id: 'stamp',
      label: 'Customer Stamp Card',
      desc: '5-stamp loyalty & free coffee',
      icon: Stamp,
      roles: ['Owner', 'Staff', 'Customer']
    },
    {
      id: 'rewards',
      label: 'Rewards & Reviews',
      desc: 'Google Review links & codes',
      icon: Star,
      roles: ['Owner', 'Staff', 'Customer']
    },
    {
      id: 'campaigns',
      label: 'Comeback Campaigns',
      desc: 'Re-engage 21+ day inactive guests',
      icon: Send,
      roles: ['Owner']
    },
    {
      id: 'dashboard',
      label: 'Owner Dashboard',
      desc: 'Sales analytics, INR stats & KPIs',
      icon: LayoutDashboard,
      roles: ['Owner', 'Staff']
    }
  ];

  const filteredItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#F5EFE6] border-r border-[#E8D5C4] p-4 shrink-0 min-h-[calc(100vh-65px)]">
      <div className="space-y-1 mb-6">
        <p className="px-3 text-[11px] font-bold tracking-wider text-[#8C6D58] uppercase">
          {role} Workspace
        </p>
      </div>

      <nav className="space-y-1.5 flex-1">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 border ${
                isActive
                  ? 'bg-[#3D2314] text-[#FAF7F2] border-[#3D2314] shadow-sm'
                  : 'bg-transparent text-[#523B2B] border-transparent hover:bg-[#EAE0D3] hover:border-[#DFD2C2]'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isActive ? 'bg-[#4E2E1A] text-[#C89D7C]' : 'bg-[#EAE0D3] text-[#6F4E37]'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold leading-tight">{item.label}</div>
                <div className={`text-[10px] mt-0.5 line-clamp-1 ${isActive ? 'text-[#D8C2B0]' : 'text-[#8C6D58]'}`}>
                  {item.desc}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Persistence indicator card */}
      <div className="mt-auto pt-4 border-t border-[#E8D5C4]">
        <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E8D5C4] flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <div className="text-[11px]">
            <span className="font-semibold text-[#3D2314] block">
              {isFirebaseConnected ? 'Firebase Sync Active' : 'Demo Mode Mode'}
            </span>
            <span className="text-[#7C5A43] text-[10px] block">
              {isFirebaseConnected ? 'Cloud Firestore connected' : 'Local state fallback active'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
