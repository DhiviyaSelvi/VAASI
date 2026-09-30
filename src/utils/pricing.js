export const PRICING = {
  minPrice: 40,
  smallMrpThreshold: 150,
  maxMrpMultiple: 1.0,
  roundingMultiple: 10,
  ranges: {
    like_new:  { label: "Like New",  range: "60–70%", minPct: 0.60, maxPct: 0.70, midPct: 0.65 },
    good:      { label: "Good",      range: "45–55%", minPct: 0.45, maxPct: 0.55, midPct: 0.50 },
    fair:      { label: "Fair",      range: "30–40%", minPct: 0.30, maxPct: 0.40, midPct: 0.35 },
    well_read: { label: "Well Read", range: "15–25%", minPct: 0.15, maxPct: 0.25, midPct: 0.20 },
  },
  editionDiscountPct: 0.30,
};

function roundTo10(num) {
  return Math.round(num / PRICING.roundingMultiple) * PRICING.roundingMultiple;
}

/**
 * Returns a price suggestion object, or null for Rare & Vintage / invalid inputs.
 * For MRP < PRICING.smallMrpThreshold, returns an approximate suggestion only
 * (no min/max range). For MRP >= threshold, returns full min/max/recommended.
 */
export function suggestPrice(mrp, conditionId, isOlderEdition = false, category = "") {
  if (!mrp || mrp <= 0 || category === "Rare & Vintage") return null;

  const conf = PRICING.ranges[conditionId];
  if (!conf) return null;

  const factor = isOlderEdition ? 1 - PRICING.editionDiscountPct : 1.0;

  const recRaw = roundTo10(mrp * conf.midPct * factor);
  const rec = Math.max(PRICING.minPrice, recRaw);

  // Small MRP: return approximate suggestion only, no range
  if (mrp < PRICING.smallMrpThreshold) {
    return { approximate: true, recommended: rec, rangeText: null };
  }

  let minP = roundTo10(mrp * conf.minPct * factor);
  let maxP = roundTo10(mrp * conf.maxPct * factor);
  minP = Math.max(PRICING.minPrice, minP);
  maxP = Math.max(PRICING.minPrice, maxP);

  return { approximate: false, min: minP, max: maxP, recommended: rec, rangeText: conf.range };
}

/**
 * Validates a seller-entered price. Returns { valid, error?, warning? }.
 */
export function checkPrice(price, mrp, category = "") {
  const p = Number(price);
  const m = Number(mrp);

  if (category === "Rare & Vintage") {
    if (isNaN(p) || p <= 0) return { valid: false, error: "Please enter a valid price." };
    if (p < PRICING.minPrice) return { valid: false, error: `Minimum price is ₹${PRICING.minPrice}.` };
    return { valid: true, warning: null };
  }

  if (isNaN(p) || p <= 0) return { valid: false, error: "Please enter a valid price." };
  if (p < PRICING.minPrice) return { valid: false, error: `Minimum price is ₹${PRICING.minPrice}.` };
  if (m && p > m) return { valid: false, error: "Price cannot be higher than the Original MRP." };

  // Above the usual range (above 70% of MRP) -> warning, still valid
  if (m && p > m * 0.70) {
    return { valid: true, warning: "Above the usual range, so it may take longer to sell." };
  }

  // Below the usual range (below 15% of MRP) -> warning, still valid
  if (m && p < m * 0.15) {
    return { valid: true, warning: "Below the usual range. You may be leaving money on the table." };
  }

  return { valid: true, warning: null };
}
