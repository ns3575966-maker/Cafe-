import React, { useState } from 'react';
import { useCafe } from '../context/CafeContext';
import { Customer, Campaign } from '../types/cafe';
import { Send, MessageSquare, CheckSquare, Square, Calendar, UserCheck, ShieldOff, Sparkles, AlertCircle, Phone } from 'lucide-react';

export const ComebackCampaigns: React.FC = () => {
  const {
    customers,
    campaigns,
    sendWhatsAppCampaign,
    markCampaignReturned,
    toggleOptOut,
    settings,
    updateSettings
  } = useCafe();

  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [templateMessage, setTemplateMessage] = useState<string>(settings.whatsappTemplate);

  // Filter customers inactive for >= 21 days and opted in
  const now = Date.now();
  const TWENTY_ONE_DAYS_MS = 21 * 24 * 60 * 60 * 1000;

  const inactiveCustomers = customers.filter((c) => {
    const lastVisitMs = new Date(c.lastVisit).getTime();
    const daysInactive = Math.floor((now - lastVisitMs) / (1000 * 60 * 60 * 24));
    return daysInactive >= 21;
  });

  const handleSelectAll = () => {
    if (selectedCustomerIds.length === inactiveCustomers.length) {
      setSelectedCustomerIds([]);
    } else {
      setSelectedCustomerIds(inactiveCustomers.map((c) => c.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedCustomerIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getPersonalizedMessage = (cust: Customer) => {
    return templateMessage
      .replace('{name}', cust.name || 'Friend')
      .replace('{cafeName}', settings.cafeName);
  };

  const handleSendIndividualWhatsApp = (cust: Customer) => {
    const msg = getPersonalizedMessage(cust);
    const campaignId = `camp-${cust.id}-${Date.now()}`;
    sendWhatsAppCampaign(campaignId, cust.phone, msg);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Top Banner */}
      <div className="bg-[#3D2314] text-[#FAF7F2] p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="bg-[#C89D7C]/20 text-[#E8D5C4] px-2.5 py-0.5 rounded-full text-xs font-semibold">
            Re-engagement CRM
          </span>
          <h2 className="text-xl font-bold font-['Outfit'] mt-1">
            Customer Comeback WhatsApp Campaigns 📲
          </h2>
          <p className="text-xs text-[#D8C2B0] mt-0.5">
            Identify guests inactive for 21+ days and re-engage them with personalized WhatsApp offers.
          </p>
        </div>

        <div className="bg-[#FAF7F2]/10 border border-[#FAF7F2]/20 p-3 rounded-xl text-center">
          <div className="text-2xl font-bold font-mono text-[#C89D7C] leading-none">
            {inactiveCustomers.length}
          </div>
          <div className="text-[10px] text-[#D8C2B0] mt-0.5">Inactive Guests (21+ Days)</div>
        </div>
      </div>

      {/* Main Grid: WhatsApp Template & Inactive List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Customer Target List Column */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#FAF7F2] border border-[#E8D5C4] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8D5C4]">
              <div>
                <h3 className="font-bold text-[#3D2314] text-sm font-['Outfit']">
                  Inactive Guests (21+ Days Since Last Visit)
                </h3>
                <p className="text-[11px] text-[#7C5A43]">
                  Select customers to send click-to-chat WhatsApp offer messages.
                </p>
              </div>

              {inactiveCustomers.length > 0 && (
                <button
                  onClick={handleSelectAll}
                  className="px-3 py-1.5 bg-[#EFE7DC] hover:bg-[#E4D7C7] text-[#3D2314] rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0"
                >
                  {selectedCustomerIds.length === inactiveCustomers.length ? (
                    <CheckSquare className="w-4 h-4 text-[#3D2314]" />
                  ) : (
                    <Square className="w-4 h-4 text-[#7C5A43]" />
                  )}
                  <span>
                    {selectedCustomerIds.length === inactiveCustomers.length
                      ? 'Deselect All'
                      : 'Select All Eligible'}
                  </span>
                </button>
              )}
            </div>

            {inactiveCustomers.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <Sparkles className="w-10 h-10 text-[#C89D7C] mx-auto opacity-70" />
                <p className="text-xs font-semibold text-[#523B2B]">
                  No inactive customers (21+ days) found right now!
                </p>
                <p className="text-[11px] text-[#8C6D58]">
                  Great job keeping your cafe guests engaged regularly!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {inactiveCustomers.map((cust) => {
                  const isSelected = selectedCustomerIds.includes(cust.id);
                  const daysInactive = Math.floor(
                    (now - new Date(cust.lastVisit).getTime()) / (1000 * 60 * 60 * 24)
                  );

                  const existingCampaign = campaigns.find(
                    (c) => c.customerPhone.replace(/\D/g, '') === cust.phone.replace(/\D/g, '')
                  );

                  return (
                    <div
                      key={cust.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                        isSelected
                          ? 'bg-[#F5EFE6] border-[#3D2314] shadow-sm'
                          : 'bg-[#FAF7F2] border-[#E8D5C4]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggleSelect(cust.id)}
                          className="mt-0.5 text-[#3D2314]"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-[#3D2314]" />
                          ) : (
                            <Square className="w-5 h-5 text-[#8C6D58]" />
                          )}
                        </button>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#3D2314] text-sm">{cust.name}</span>
                            <span className="text-[10px] font-mono text-[#7C5A43]">
                              +91 {cust.phone}
                            </span>
                            {cust.optOutMarketing && (
                              <span className="text-[9px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                                <ShieldOff className="w-3 h-3" /> Opted Out
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#7C5A43] mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" /> Last Visit: {daysInactive} days ago
                            </span>
                            <span>·</span>
                            <span>Total Visits: {cust.totalVisits}</span>
                          </div>

                          {/* Campaign Status */}
                          {existingCampaign && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-[10px] bg-blue-100 text-blue-900 border border-blue-200 px-2 py-0.5 rounded font-semibold">
                                {existingCampaign.status}
                              </span>
                              {existingCampaign.returned ? (
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                                  <UserCheck className="w-3 h-3" /> Customer Returned!
                                </span>
                              ) : (
                                <button
                                  onClick={() => markCampaignReturned(existingCampaign.id)}
                                  className="text-[10px] text-emerald-700 hover:text-emerald-900 font-semibold underline"
                                >
                                  Mark Customer Returned
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => toggleOptOut(cust.id)}
                          className="px-2.5 py-1 text-[10px] font-medium text-[#7C5A43] hover:text-[#3D2314] underline"
                          title="Toggle marketing consent"
                        >
                          {cust.optOutMarketing ? 'Opt-In' : 'Opt-Out'}
                        </button>

                        <button
                          disabled={cust.optOutMarketing}
                          onClick={() => handleSendIndividualWhatsApp(cust)}
                          className="py-2 px-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send WhatsApp Offer</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* WhatsApp Message Customizer Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#FAF7F2] border border-[#E8D5C4] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#3D2314]">
              <MessageSquare className="w-5 h-5 text-[#C89D7C]" />
              <h3 className="font-bold text-sm font-['Outfit']">WhatsApp Offer Message</h3>
            </div>
            <p className="text-xs text-[#7C5A43]">
              Personalize your outreach template. Use <code>{'{name}'}</code> and <code>{'{cafeName}'}</code> as dynamic tags.
            </p>

            <div className="space-y-2 text-xs">
              <label className="block font-semibold text-[#3D2314]">Template Message:</label>
              <textarea
                rows={5}
                value={templateMessage}
                onChange={(e) => {
                  setTemplateMessage(e.target.value);
                  updateSettings({ whatsappTemplate: e.target.value });
                }}
                className="w-full p-3 bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl text-xs leading-relaxed focus:ring-2 focus:ring-[#3D2314] outline-none"
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-[11px] text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>WhatsApp Click-to-Chat</span>
              </div>
              <p>
                Uses WhatsApp official <code>wa.me</code> click-to-chat link. Pre-fills message directly in WhatsApp desktop or mobile app.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
