import { suggestPrice, checkPrice, PRICING } from './pricing.js';

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Test Failed: ${message}`);
  }
}

console.log("Running pricing tests...\n");

// 1. ₹750 Good condition — above smallMrpThreshold (150), should give full range
//    Good: 45–55%, mid 50% -> min 340, max 410, rec 380
const res1 = suggestPrice(750, 'good');
assert(res1 !== null, "res1 should not be null");
assert(res1.approximate === false, `Expected approximate=false, got ${res1.approximate}`);
assert(res1.min === 340, `Expected min 340, got ${res1.min}`);
assert(res1.max === 410, `Expected max 410, got ${res1.max}`);
assert(res1.recommended === 380, `Expected rec 380, got ${res1.recommended}`);
console.log("✓ Test 1 passed: ₹750 Good -> full range { min:", res1.min, ", max:", res1.max, ", rec:", res1.recommended, "}");

// 2. Older edition ₹750 Good — factor 0.70 (30% discount)
//    mid = 750 * 0.50 * 0.70 = 262.5 -> 260
//    min = 750 * 0.45 * 0.70 = 236.25 -> 240
//    max = 750 * 0.55 * 0.70 = 288.75 -> 290
const res2 = suggestPrice(750, 'good', true);
assert(res2.approximate === false, `Expected approximate=false, got ${res2.approximate}`);
assert(res2.min === 240, `Expected min 240, got ${res2.min}`);
assert(res2.max === 290, `Expected max 290, got ${res2.max}`);
assert(res2.recommended === 260, `Expected rec 260, got ${res2.recommended}`);
console.log("✓ Test 2 passed: ₹750 Good older edition -> { min:", res2.min, ", max:", res2.max, ", rec:", res2.recommended, "}");

// 3. MRP 100 — below smallMrpThreshold (150), approximate only
//    Good mid = 100 * 0.50 = 50 -> 50
const res3 = suggestPrice(100, 'good');
assert(res3 !== null, "res3 should not be null");
assert(res3.approximate === true, `Expected approximate=true, got ${res3.approximate}`);
assert(res3.recommended === 50, `Expected rec 50, got ${res3.recommended}`);
assert(res3.min === undefined, "Expected no min for approximate suggestion");
assert(res3.max === undefined, "Expected no max for approximate suggestion");
console.log("✓ Test 3 passed: ₹100 Good (approx) -> rec:", res3.recommended, "no min/max");

// 4. MRP 200 — above smallMrpThreshold (150), should give full range
const res4 = suggestPrice(200, 'good');
assert(res4 !== null, "res4 should not be null");
assert(res4.approximate === false, `Expected approximate=false for MRP 200, got ${res4.approximate}`);
assert(res4.min !== undefined, "Expected min for MRP above threshold");
assert(res4.max !== undefined, "Expected max for MRP above threshold");
console.log("✓ Test 4 passed: ₹200 Good -> full range { min:", res4.min, ", max:", res4.max, ", rec:", res4.recommended, "}");

// 5. Rare & Vintage -> null
const res5 = suggestPrice(750, 'good', false, 'Rare & Vintage');
assert(res5 === null, "Rare & Vintage should return null");
console.log("✓ Test 5 passed: Rare & Vintage -> null");

// 6. checkPrice: price=20, below minPrice=40 -> error
const check1 = checkPrice(20, 750, 'College Textbooks');
assert(!check1.valid, "Price 20 should be invalid");
assert(check1.error === `Minimum price is ₹${PRICING.minPrice}.`, `Got: ${check1.error}`);
console.log("✓ Test 6 passed: price=20 error:", check1.error);

// 7. checkPrice: price above MRP -> error
const check2 = checkPrice(600, 500, 'College Textbooks');
assert(!check2.valid, "Price 600 > MRP 500 should be invalid");
assert(check2.error.includes("Original MRP"), `Got: ${check2.error}`);
console.log("✓ Test 7 passed: price=600 > MRP=500 error:", check2.error);

// 8. checkPrice: Rare & Vintage allows high price
const check3 = checkPrice(1500, 1000, 'Rare & Vintage');
assert(check3.valid, "Rare & Vintage high price should be valid");
assert(check3.warning === null, "No warning expected for Rare & Vintage");
console.log("✓ Test 8 passed: Rare & Vintage price=1500 valid");

// 9. checkPrice: price=700 on MRP=750 -> above 70% -> correct neutral warning
const check4 = checkPrice(700, 750, 'College Textbooks');
assert(check4.valid, "Price 700 should be valid (just a warning)");
assert(check4.warning === "Above the usual range, so it may take longer to sell.", `Got: ${check4.warning}`);
console.log("✓ Test 9 passed: price=700 MRP=750 warning:", check4.warning);

// 10. checkPrice: price well below 15% of MRP -> below range warning
const check5 = checkPrice(50, 750, 'College Textbooks');
assert(check5.valid, "Price 50 should be valid (below range warning)");
assert(check5.warning === "Below the usual range. You may be leaving money on the table.", `Got: ${check5.warning}`);
console.log("✓ Test 10 passed: price=50 MRP=750 below-range warning:", check5.warning);

console.log("\nAll pricing tests passed successfully!");
