import React, { useState } from 'react';
import { useCafe } from '../context/CafeContext';
import { Star, Copy, ExternalLink, Check, Gift, Settings, MessageSquare, Sparkles } from 'lucide-react';

export const RewardsAndReviews: React.FC = () => {
  const { rewards, settings, updateSettings, role } = useCafe();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [cafeNameInput, setCafeNameInput] = useState(settings.cafeName);
  const [reviewUrlInput, setReviewUrlInput] = useState(settings.googleReviewUrl);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      cafeName: cafeNameInput,
      googleReviewUrl: reviewUrlInput
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Top Banner */}
      <div className="bg-[#3D2314] text-[#FAF7F2] p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="bg-[#C89D7C]/20 text-[#E8D5C4] px-2.5 py-0.5 rounded-full text-xs font-semibold">
            Google Reviews & Rewards
          </span>
          <h2 className="text-xl font-bold font-['Outfit'] mt-1">
            Grow 5-Star Reputation & Loyalty 🌟
          </h2>
          <p className="text-xs text-[#D8C2B0] mt-0.5">
            Encourage happy cafe guests to leave authentic Google reviews and claim earned rewards.
          </p>
        </div>

        <a
          href={settings.googleReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 bg-[#C89D7C] hover:bg-[#B58A6A] text-[#3D2314] font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap shrink-0"
        >
          <Star className="w-4 h-4 fill-[#3D2314]" />
          <span>Leave Google Review</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Grid: Unlocked Rewards + Google Review Card + Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Unlocked Customer Rewards Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#FAF7F2] border border-[#E8D5C4] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#3D2314] text-[#FAF7F2] flex items-center justify-center">
                  <Gift className="w-4 h-4 text-[#C89D7C]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#3D2314] text-sm font-['Outfit']">Active Customer Rewards</h3>
                  <p className="text-[11px] text-[#7C5A43]">
                    Copy reward codes to redeem at POS or digital order checkout.
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#3D2314] bg-[#EFE7DC] px-2.5 py-1 rounded-lg">
                {rewards.length} Total
              </span>
            </div>

            {rewards.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <Gift className="w-10 h-10 text-[#C89D7C] mx-auto opacity-60" />
                <p className="text-xs font-semibold text-[#523B2B]">No reward codes issued yet</p>
                <p className="text-[11px] text-[#8C6D58]">
                  Complete 5 stamps on your coffee card to receive a free coffee code here!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {rewards.map((rw) => (
                  <div
                    key={rw.id}
                    className="p-4 bg-[#F5EFE6] border border-[#E8D5C4] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#3D2314] text-sm">{rw.title}</span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                            rw.isRedeemed ? 'bg-gray-200 text-gray-700' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {rw.isRedeemed ? 'Redeemed' : 'Active Code'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7C5A43] mt-0.5">
                        Guest: <strong>{rw.customerName}</strong> (+91 {rw.customerPhone})
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="bg-[#FAF7F2] px-3 py-1.5 rounded-lg border border-[#E8D5C4] font-mono font-bold text-[#3D2314] text-xs tracking-wider select-all">
                        {rw.rewardCode}
                      </div>

                      <button
                        onClick={() => handleCopyCode(rw.rewardCode)}
                        className="px-3 py-1.5 bg-[#3D2314] text-[#FAF7F2] hover:bg-[#2A170C] rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0"
                      >
                        {copiedCode === rw.rewardCode ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#C89D7C]" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Polite Google Review Invitation Prompt Card */}
          <div className="bg-gradient-to-r from-[#FAF7F2] to-[#F5EFE6] border-2 border-amber-300 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-900">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
              <h3 className="font-bold text-sm font-['Outfit']">
                Polite Guest Review Invitation Prompt
              </h3>
            </div>
            <p className="text-xs text-[#6F4E37] leading-relaxed">
              "Did you enjoy your coffee at <strong>{settings.cafeName}</strong>? Help our small cafe grow by sharing a quick 5-star Google review!"
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={settings.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Star className="w-4 h-4 fill-white" />
                <span>Open Google Review Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-[11px] text-[#8C6D58]">
                Note: Reviews are authentic customer submissions on Google Maps.
              </span>
            </div>
          </div>
        </div>

        {/* Cafe Owner Review Settings Sidebar */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#FAF7F2] border border-[#E8D5C4] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#3D2314]">
              <Settings className="w-5 h-5 text-[#C89D7C]" />
              <h3 className="font-bold text-sm font-['Outfit']">Google Review Link Configuration</h3>
            </div>
            <p className="text-xs text-[#7C5A43]">
              Configure your Google Maps Business Place review link. Customers clicking review buttons will open your exact Google Maps page.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#3D2314] mb-1">Cafe Name</label>
                <input
                  type="text"
                  value={cafeNameInput}
                  onChange={(e) => setCafeNameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl focus:ring-2 focus:ring-[#3D2314] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D2314] mb-1">
                  Google Maps Review URL
                </label>
                <input
                  type="url"
                  value={reviewUrlInput}
                  onChange={(e) => setReviewUrlInput(e.target.value)}
                  placeholder="https://g.page/r/your-cafe/review"
                  className="w-full px-3 py-2 font-mono text-xs bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl focus:ring-2 focus:ring-[#3D2314] outline-none"
                  required
                />
              </div>

              {savedSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Cafe Review settings saved successfully!</span>
                </div>
              )}

              {role === 'Owner' ? (
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#3D2314] hover:bg-[#2A170C] text-[#FAF7F2] font-semibold rounded-xl text-xs transition-colors"
                >
                  Save Review URL Configuration
                </button>
              ) : (
                <p className="text-[11px] text-[#8C6D58] italic">
                  Switch to Owner role to edit Google Review settings.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
