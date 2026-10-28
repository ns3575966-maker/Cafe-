import React, { useState } from 'react';
import { useCafe } from '../context/CafeContext';
import { QrCode, X, Printer, Download, ExternalLink, Sparkles } from 'lucide-react';

export const QRModal: React.FC = () => {
  const { qrModalOpen, setQrModalOpen, settings, setQrTableContext } = useCafe();
  const [selectedTable, setSelectedTable] = useState('Table 1');

  if (!qrModalOpen) return null;

  const currentAppUrl = window.location.origin;
  const qrTargetUrl = `${currentAppUrl}?table=${encodeURIComponent(selectedTable)}`;

  const handlePrint = () => {
    window.print();
  };

  const handleOpenCustomerView = () => {
    setQrTableContext(selectedTable);
    setQrModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#FAF7F2] rounded-3xl p-6 max-w-md w-full border border-[#E8D5C4] shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8D5C4]">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#C89D7C]" />
            <h3 className="font-bold text-base text-[#3D2314] font-['Outfit']">
              Table QR Code Standee
            </h3>
          </div>
          <button
            onClick={() => setQrModalOpen(false)}
            className="p-1.5 text-[#7C5A43] hover:text-[#3D2314] rounded-lg bg-[#EFE7DC]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Table Selector */}
        <div>
          <label className="block text-xs font-semibold text-[#3D2314] mb-1">Select Table:</label>
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8D5C4] rounded-xl text-xs font-semibold text-[#3D2314]"
          >
            {Array.from({ length: settings.totalTables }, (_, i) => `Table ${i + 1}`).map((tbl) => (
              <option key={tbl} value={tbl}>
                {tbl}
              </option>
            ))}
          </select>
        </div>

        {/* Generated Printable QR Standee Card */}
        <div className="bg-gradient-to-b from-[#FAF7F2] via-[#F5EFE6] to-[#EFE7DC] border-2 border-[#3D2314] rounded-2xl p-6 text-center space-y-4 shadow-md">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#7C5A43]">
              Welcome To
            </span>
            <h4 className="text-lg font-bold text-[#3D2314] font-['Outfit']">{settings.cafeName}</h4>
            <div className="inline-block bg-[#3D2314] text-[#C89D7C] text-xs font-bold px-3 py-1 rounded-full font-mono mt-1">
              {selectedTable}
            </div>
          </div>

          {/* SVG QR Representation */}
          <div className="w-44 h-44 bg-white p-3 rounded-2xl mx-auto shadow-sm border border-[#E8D5C4] flex items-center justify-center relative">
            <div className="w-full h-full bg-[#3D2314] p-2 rounded-xl flex items-center justify-center">
              {/* Simulated QR Pattern */}
              <div className="w-full h-full grid grid-cols-5 gap-1.5 p-1 bg-white rounded">
                {Array.from({ length: 25 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`rounded-sm ${
                      idx % 2 === 0 || idx % 5 === 0 ? 'bg-[#3D2314]' : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white p-1.5 rounded-full shadow-md">
                <QrCode className="w-6 h-6 text-[#3D2314]" />
              </div>
            </div>
          </div>

          <p className="text-xs text-[#6F4E37] font-semibold">
            Scan to view Digital Menu & earn free coffee stamps!
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 bg-[#3D2314] hover:bg-[#2A170C] text-[#FAF7F2] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4 text-[#C89D7C]" />
            <span>Print Standee</span>
          </button>
          <button
            onClick={handleOpenCustomerView}
            className="flex-1 py-2.5 bg-[#EFE7DC] hover:bg-[#E4D7C7] text-[#3D2314] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-[#7C5A43]" />
            <span>Test Customer View</span>
          </button>
        </div>
      </div>
    </div>
  );
};
