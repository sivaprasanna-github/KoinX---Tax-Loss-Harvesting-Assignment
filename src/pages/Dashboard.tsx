import { useEffect, useState } from "react";
import { fetchHoldings, fetchCapitalGains } from "../api/api";
import Card from "../components/Card";
import HoldingsTable from "../components/HoldingsTable";
import { updateGains, getRealisedGains } from "../utils/calculations";
import type { Holding, CapitalGains } from "../types/types"; 

export default function Dashboard() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [baseGains, setBaseGains] = useState<CapitalGains | null>(null);
  const [updatedGains, setUpdatedGains] = useState<CapitalGains | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchHoldings(), fetchCapitalGains()]).then(
      ([holdingsRes, gainsRes]: any) => {
        setHoldings(holdingsRes);
        setBaseGains(gainsRes.capitalGains);
        setUpdatedGains(gainsRes.capitalGains);
        setLoading(false);
      }
    );
  }, []);

  const handleSelect = (selected: Holding[]) => {
    if (!baseGains) return;
    const newData = updateGains(baseGains, selected);
    setUpdatedGains(newData);
  };

  if (loading || !baseGains || !updatedGains) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
          <p className="text-slate-500 font-medium">Loading Portfolio Data...</p>
        </div>
      </div>
    );
  }

  const preRealised = getRealisedGains(baseGains);
  const postRealised = getRealisedGains(updatedGains);
  const gainsReduced = preRealised - postRealised;
  const taxSavings = gainsReduced * 0.30; 

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Tax Loss Harvesting</h1>
            <p className="text-slate-500 mt-2 text-lg">Offset your realized capital gains with unrealized losses.</p>
          </div>
          
          {preRealised > postRealised && taxSavings > 0 && (
            <div className="bg-emerald-50 text-emerald-800 px-6 py-4 rounded-2xl border border-emerald-200 shadow-sm flex items-center gap-4 transition-all duration-500">
              <span className="text-3xl">✨</span>
              <div>
                <span className="text-sm font-semibold block text-emerald-600/80 uppercase tracking-wider">Estimated Tax Savings (30%)</span>
                <span className="text-2xl font-black">You save ₹{taxSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          )}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card title="Pre Harvesting" data={baseGains} variant="dark" />
          <Card title="After Harvesting" data={updatedGains} variant="blue" />
        </div>

        {/* Table */}
        <HoldingsTable data={holdings} onSelect={handleSelect} />
      </div>
    </div>
  );
}