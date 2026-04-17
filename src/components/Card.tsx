import type { CapitalGains } from "../types/types";

interface Props {
  title: string;
  data: CapitalGains;
  variant: "dark" | "blue";
}

const formatCurrency = (val: number) => 
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

export default function Card({ title, data, variant }: Props) {
  const netSTCG = data.stcg.profits - data.stcg.losses;
  const netLTCG = data.ltcg.profits - data.ltcg.losses;
  const realisedGains = netSTCG + netLTCG;

  // Premium UI styling matching KoinX brand
  const bgStyles = variant === "dark" 
    ? "bg-slate-900 text-white border border-slate-800" 
    : "bg-blue-600 text-white border border-blue-500 shadow-blue-500/20";

  const labelColor = variant === "dark" ? "text-slate-400" : "text-blue-200";
  const borderColor = variant === "dark" ? "border-slate-700" : "border-blue-400/50";

  return (
    <div className={`p-6 md:p-8 rounded-2xl shadow-xl ${bgStyles}`}>
      <h2 className="text-xl font-bold mb-6">{title}</h2>

      {/* Grid prevents squishing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        
        {/* STCG Column */}
        <div className="space-y-3">
          <p className={`text-xs font-bold uppercase tracking-wider ${labelColor}`}>Short-Term (STCG)</p>
          <div className="flex justify-between items-center text-sm">
            <span className={labelColor}>Profits</span> 
            <span className="font-medium">{formatCurrency(data.stcg.profits)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className={labelColor}>Losses</span> 
            <span className="font-medium">{formatCurrency(data.stcg.losses)}</span>
          </div>
          <div className={`flex justify-between items-center font-bold pt-3 border-t ${borderColor}`}>
            <span>Net STCG</span> 
            <span className={netSTCG >= 0 ? "text-emerald-400" : "text-rose-400"}>
              {formatCurrency(netSTCG)}
            </span>
          </div>
        </div>

        {/* LTCG Column */}
        <div className="space-y-3">
          <p className={`text-xs font-bold uppercase tracking-wider ${labelColor}`}>Long-Term (LTCG)</p>
          <div className="flex justify-between items-center text-sm">
            <span className={labelColor}>Profits</span> 
            <span className="font-medium">{formatCurrency(data.ltcg.profits)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className={labelColor}>Losses</span> 
            <span className="font-medium">{formatCurrency(data.ltcg.losses)}</span>
          </div>
          <div className={`flex justify-between items-center font-bold pt-3 border-t ${borderColor}`}>
            <span>Net LTCG</span> 
            <span className={netLTCG >= 0 ? "text-emerald-400" : "text-rose-400"}>
              {formatCurrency(netLTCG)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`pt-5 border-t ${borderColor} flex flex-col md:flex-row justify-between items-start md:items-center gap-2`}>
        <span className={`text-sm md:text-base font-medium ${labelColor}`}>Realised Capital Gains</span>
        <span className="text-2xl md:text-3xl font-extrabold tracking-tight">{formatCurrency(realisedGains)}</span>
      </div>
    </div>
  );
}