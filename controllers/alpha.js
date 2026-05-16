import fs from "node:fs/promises";
import path from "node:path";

/**
 * High-Frequency Market Emulation Algorithm
 * @param {string} commodity - The UI selection name (e.g., "GOLD", "WTI")
 */
export async function getAlphaPrice(commodity) {
  const API_KEY = process.env.ALPHA_VANTAGE_KEY;
  const USE_LIVE_API = process.env.USE_LIVE_API === "true";

  const alphaFunctionMap = {
    WTI: "CRUDE_OIL",
    NATURAL_GAS: "NATURAL_GAS",
    GOLD: "GOLD",
    SILVER: "SILVER",
    COPPER: "COPPER",
    WHEAT: "WHEAT",
    CORN: "CORN",
  };

  const functionName = alphaFunctionMap[commodity.toUpperCase()];

  
  if (USE_LIVE_API && functionName && API_KEY) {
    try {
      const url = `alphavantage.co{functionName}&interval=monthly&apikey=${API_KEY}`;
      const response = await fetch(url);
      const json = await response.json();

      if (json && json.data && json.data[0]) {
        return {
          price: parseFloat(json.data[0].value),
          market: "Alpha Vantage Live Exchange Feed",
          currency: "USD",
        };
      }
    } catch (apiError) {
      console.error("Live API Network Failure:", apiError.message);
    }
  }

  
  try {
    const historyPath = path.join(process.cwd(), "data", "marketHistory.json");
    const rawData = await fs.readFile(historyPath, "utf8");
    const marketHistory = JSON.parse(rawData);

    const priceTimeline = marketHistory[commodity.toUpperCase()];
    if (!priceTimeline || priceTimeline.length === 0) {
      throw new Error(`Asset key metadata timeline missing for: ${commodity}`);
    }

    
    const now = new Date();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();

    // Cycle through your 14 data points array smoothly every 14 minutes
    const targetIndex = currentMinute % priceTimeline.length;
    const historicalBasePrice = priceTimeline[targetIndex];

    
    const waveFactor = Math.sin((currentSecond * Math.PI) / 30); // Generates smooth values between -1 and +1

    
    const maxTickVariance = historicalBasePrice * 0.0025;
    const randomNoise =
      (Math.random() * 2 - 1) * (historicalBasePrice * 0.0005); // Noise modifier
    const computedFluctuation = waveFactor * maxTickVariance + randomNoise;

    const calculatedLivePrice = historicalBasePrice + computedFluctuation;

    return {
      price: parseFloat(calculatedLivePrice.toFixed(2)),
      market: "Global Hedge High-Frequency Matching Engine",
      currency: "USD",
    };
  } catch (error) {
    console.error("Historical Algorithm Engine Exception:", error.message);
    const EMERGENCY_PRICES = {
      WTI: 75.0,
      NATURAL_GAS: 2.2,
      GOLD: 2350.0,
      SILVER: 28.0,
      COPPER: 4.5,
      WHEAT: 6.0,
      CORN: 4.4,
    };
    return {
      price: EMERGENCY_PRICES[commodity.toUpperCase()] || 100.0,
      market: "Engine Backup Failure Loop",
      currency: "USD",
    };
  }
}
