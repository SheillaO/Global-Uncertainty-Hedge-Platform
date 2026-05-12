import yahooFinance from "yahoo-finance2";

/**
 * Fetches live quotes from Yahoo Finance
 * @param {string} commodity - The UI name (e.g., "GOLD")
 */
export async function getYahooPrice(commodity) {
  // 1. Map the UI name to the Yahoo Finance ticker symbol
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
    // 2. Fetch the quote from Yahoo Finance
    const result = await yahooFinance.quote(ticker);

    // 3. Return a clean object for our route handler to use
    return {
      price: result.regularMarketPrice,
      market: result.fullExchangeName || "Yahoo Finance",
      currency: result.currency,
    };
  } catch (error) {
    console.error("Yahoo Finance API Error:", error.message);
    throw new Error("Failed to fetch data from Yahoo Finance.");
  }
}
