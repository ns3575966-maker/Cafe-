import React from 'react';
import { useCafe } from '../context/CafeContext';
import { HelpCircle, X, Database, Star, MessageSquare, Shield, CheckCircle2 } from 'lucide-react';

export const SetupGuideModal: React.FC = () => {
  const { setupGuideOpen, setSetupGuideOpen, isFirebaseConnected } = useCafe();

  if (!setupGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#FAF7F2] rounded-3xl p-6 max-w-lg w-full border border-[#E8D5C4] shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8D5C4]">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#C89D7C]" />
            <h3 className="font-bold text-base text-[#3D2314] font-['Outfit']">
              CafeDesk Integration & Setup Guide
            </h3>
          </div>
          <button
            onClick={() => setSetupGuideOpen(false)}
            className="p-1.5 text-[#7C5A43] hover:text-[#3D2314] rounded-lg bg-[#EFE7DC]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Firebase Status Badge */}
        <div className="bg-[#F5EFE6] border border-[#E8D5C4] p-4 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-[#3D2314]" />
            <div>
              <span className="font-bold text-[#3D2314] block">Database Status</span>
              <span className="text-[#7C5A43] text-[11px]">
                {isFirebaseConnected
                  ? 'Firebase Firestore & Auth Connected'
                  : 'Demo Mode Active with Local Fallback'}
              </span>
            </div>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
              isFirebaseConnected
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            {isFirebaseConnected ? 'Live Firestore' : 'Demo State'}
          </span>
        </div>

        {/* Section 1: Firebase Configuration */}
        <div className="space-y-2 text-xs text-[#523B2B]">
          <h4 className="font-bold text-[#3D2314] flex items-center gap-1.5 text-sm">
            <Database className="w-4 h-4 text-[#C89D7C]" /> 1. Persistent Storage (Firebase)
          </h4>
          <p className="leading-relaxed text-[11px] text-[#7C5A43]">
            CafeDesk automatically provisions Google Cloud Firestore and Authentication via <code>firebase-applet-config.json</code>. When offline or during initial preview, the app operates seamlessly in Demo Mode with realistic Indian cafe sample data.
          </p>
        </div>

        {/* Section 2: Google Review Setup */}
        <div className="space-y-2 text-xs text-[#523B2B]">
          <h4 className="font-bold text-[#3D2314] flex items-center gap-1.5 text-sm">
            <Star className="w-4 h-4 text-amber-500" /> 2. Google Review Configuration
          </h4>
          <p className="leading-relaxed text-[11px] text-[#7C5A43]">
            To connect your actual Google Maps Business place, navigate to <strong>Reviews & Gifts</strong> tab, enter your cafe name and exact Google Review URL (e.g. <code>https://g.page/r/your-cafe/review</code>). Customers will be prompted politely post-checkout to leave an authentic 5-star Google review.
          </p>
        </div>

        {/* Section 3: WhatsApp Comeback Campaigns */}
        <div className="space-y-2 text-xs text-[#523B2B]">
          <h4 className="font-bold text-[#3D2314] flex items-center gap-1.5 text-sm">
            <MessageSquare className="w-4 h-4 text-emerald-600" /> 3. WhatsApp Click-to-Chat Integration
          </h4>
          <p className="leading-relaxed text-[11px] text-[#7C5A43]">
            Comeback campaigns use WhatsApp's official <code>wa.me</code> click-to-chat API. Clicking "Send WhatsApp Offer" pre-fills personalized offer messages for 21+ day inactive guests directly in WhatsApp.
          </p>
        </div>

        {/* Section 4: Security & Validation */}
        <div className="space-y-2 text-xs text-[#523B2B]">
          <h4 className="font-bold text-[#3D2314] flex items-center gap-1.5 text-sm">
            <Shield className="w-4 h-4 text-purple-600" /> 4. Security & Role Permissions
          </h4>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-[#7C5A43] pl-1">
            <li><strong>Owner:</strong> Full control over Menu, Orders, Dashboard, Campaigns & Settings.</li>
            <li><strong>Staff:</strong> POS live order status updates, 1-tap stamp issue & code redemption.</li>
            <li><strong>Customer:</strong> Public table QR menu view, cart checkout & stamp card tracking.</li>
          </ul>
        </div>

        <button
          onClick={() => setSetupGuideOpen(false)}
          className="w-full py-2.5 bg-[#3D2314] text-[#FAF7F2] font-semibold text-xs rounded-xl hover:bg-[#2A170C] transition-colors"
        >
          Got it, Close Guide
        </button>
      </div>
    </div>
  );
};
