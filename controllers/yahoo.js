import yahooFinance from "yahoo-finance2";

/**
 * Fetches live quotes from Yahoo Finance
 * @param {string} commodity - The UI name (e.g., "GOLD")
 */
export async function getYahooPrice(commodity) {
  const tickerMap = {
    GOLD: "GC=F",
    WTI: "CL=F",
    SILVER: "SI=F",
  };

  const ticker = tickerMap[commodity];

  if (!ticker) {
    throw new Error(`Ticker not found for commodity: ${commodity}`);
  }

  try {
    const result = await yahooFinance.quote(ticker);

    // FIX: Enforced strict parsing float safety bounds on regularMarketPrice responses
    return {
      price: parseFloat(result.regularMarketPrice),
      market: result.fullExchangeName || "Yahoo Finance",
      currency: result.currency,
    };
  } catch (error) {
    console.error("Yahoo Finance API Error:", error.message);
    throw new Error("Failed to fetch data from Yahoo Finance.");
  }
}
