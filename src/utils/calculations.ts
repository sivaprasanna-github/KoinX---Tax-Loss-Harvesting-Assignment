import type { Holding, CapitalGains } from "../types/types"; // <-- Add "type" here

export const updateGains = (base: CapitalGains, selected: Holding[]): CapitalGains => {
  // Deep clone to avoid mutating state directly
  const updated: CapitalGains = JSON.parse(JSON.stringify(base));

  selected.forEach((item) => {
    // Calculate STCG logic
    if (item.stcg.gain > 0) {
      updated.stcg.profits += item.stcg.gain;
    } else if (item.stcg.gain < 0) {
      updated.stcg.losses += Math.abs(item.stcg.gain); // Add absolute value to losses
    }

    // Calculate LTCG logic
    if (item.ltcg.gain > 0) {
      updated.ltcg.profits += item.ltcg.gain;
    } else if (item.ltcg.gain < 0) {
      updated.ltcg.losses += Math.abs(item.ltcg.gain); // Add absolute value to losses
    }
  });

  return updated;
};

export const getRealisedGains = (data: CapitalGains) => {
  const netSTCG = data.stcg.profits - data.stcg.losses;
  const netLTCG = data.ltcg.profits - data.ltcg.losses;
  return netSTCG + netLTCG;
};