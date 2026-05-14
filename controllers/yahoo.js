import yahooFinance from "yahoo-finance2";

// FIX: Force the yahoo library to bypass validation cookie blocks inside headless cloud containers
yahooFinance.setGlobalConfig({ validation: { logErrors: false } });

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
    // Force call quote summary to clean out edge session failures
    const result = await yahooFinance.quote(ticker);

    if (!result || !result.regularMarketPrice) {
      throw new Error(
        `Yahoo Finance returned empty data structures for ${ticker}`,
      );
    }

    return {
      price: parseFloat(result.regularMarketPrice),
      market: result.fullExchangeName || "Yahoo Finance",
      currency: result.currency || "USD",
    };
  } catch (error) {
    console.error("Yahoo Finance API Error Context:", error.message);
    throw new Error(
      `Failed to fetch data from Yahoo Finance: ${error.message}`,
    );
  }
}
