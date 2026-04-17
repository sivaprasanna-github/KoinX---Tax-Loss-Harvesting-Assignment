import { useState } from "react";
import type { Holding } from "../types/types";

interface Props {
  data: Holding[];
  onSelect: (selected: Holding[]) => void;
}

const formatCrypto = (val: number) => {
  if (val === 0) return "0.00";
  return val > 1 ? val.toFixed(4) : val.toExponential(4);
};

export default function HoldingsTable({ data, onSelect }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (coin: string) => {
    const updated = selected.includes(coin)
      ? selected.filter((c) => c !== coin)
      : [...selected, coin];
    updateSelection(updated);
  };

  const toggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = e.target.checked ? data.map((d) => d.coin) : [];
    updateSelection(updated);
  };

  const updateSelection = (updated: string[]) => {
    setSelected(updated);
    const selectedItems = data.filter((d) => updated.includes(d.coin));
    onSelect(selectedItems);
  };

  return (
    <div className="mt-10 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs">
            <tr>
              <th className="p-4 w-12 text-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  checked={selected.length === data.length && data.length > 0}
                  onChange={toggleAll}
                />
              </th>
              <th className="p-4 font-semibold">Asset</th>
              <th className="p-4 font-semibold text-right">Holdings <span className="block font-normal text-slate-400">Avg Buy Price</span></th>
              <th className="p-4 font-semibold text-right">Current Price</th>
              <th className="p-4 font-semibold text-right">Short-Term Gain <span className="block font-normal text-slate-400">Balance</span></th>
              <th className="p-4 font-semibold text-right">Long-Term Gain <span className="block font-normal text-slate-400">Balance</span></th>
              <th className="p-4 font-semibold text-right text-blue-600">Amount to Sell</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item) => {
              const isSelected = selected.includes(item.coin);
              return (
                <tr key={item.coin} className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-blue-50/50' : ''}`}>
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                      checked={isSelected}
                      onChange={() => toggle(item.coin)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {/* FIX: Force image to stay 40x40 pixels */}
                      <img src={item.logo} alt={item.coinName} className="w-10 h-10 min-w-[40px] rounded-full bg-slate-100 object-contain p-1" />
                      <div>
                        <div className="font-bold text-slate-900">{item.coinName}</div>
                        <div className="text-slate-500 text-xs font-medium">{item.coin}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="font-semibold text-slate-900">{formatCrypto(item.totalHolding)}</div>
                    <div className="text-xs text-slate-500">₹{item.averageBuyPrice.toFixed(2)}</div>
                  </td>
                  <td className="p-4 text-right font-semibold text-slate-900">₹{item.currentPrice.toLocaleString()}</td>
                  
                  <td className="p-4 text-right">
                    <div className={`font-semibold ${item.stcg.gain >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {item.stcg.gain >= 0 ? '+' : ''}₹{item.stcg.gain.toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-500">{formatCrypto(item.stcg.balance)}</div>
                  </td>

                  <td className="p-4 text-right">
                    <div className={`font-semibold ${item.ltcg.gain >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {item.ltcg.gain >= 0 ? '+' : ''}₹{item.ltcg.gain.toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-500">{formatCrypto(item.ltcg.balance)}</div>
                  </td>

                  <td className="p-4 text-right font-bold text-blue-600">
                    {isSelected ? formatCrypto(item.totalHolding) : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}