import React from 'react';
import { CafeProvider, useCafe } from './context/CafeContext';
import { Header } from './components/Header';
import { DesktopSidebar } from './components/DesktopSidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { QROrdering } from './components/QROrdering';
import { StampCard } from './components/StampCard';
import { RewardsAndReviews } from './components/RewardsAndReviews';
import { ComebackCampaigns } from './components/ComebackCampaigns';
import { OwnerDashboard } from './components/OwnerDashboard';
import { QRModal } from './components/QRModal';
import { SetupGuideModal } from './components/SetupGuideModal';

const MainContent: React.FC = () => {
  const { activeTab, role } = useCafe();

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'ordering':
        return <QROrdering />;
      case 'stamp':
        return <StampCard />;
      case 'rewards':
        return <RewardsAndReviews />;
      case 'campaigns':
        return role === 'Owner' ? <ComebackCampaigns /> : <QROrdering />;
      case 'dashboard':
        return role !== 'Customer' ? <OwnerDashboard /> : <QROrdering />;
      default:
        return <QROrdering />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <Header />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <DesktopSidebar />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-full overflow-x-hidden">
          {renderActiveSection()}
        </main>
      </div>

      <MobileBottomNav />
      <QRModal />
      <SetupGuideModal />
    </div>
  );
};

export default function App() {
  return (
    <CafeProvider>
      <MainContent />
    </CafeProvider>
  );
}
