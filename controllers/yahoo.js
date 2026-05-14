import yahooFinance from "yahoo-finance2";

/**
 * Fetches live quotes from Yahoo Finance for all commodities
 * @param {string} commodity - The UI selection name (e.g., "GOLD", "CORN")
 */
export async function getYahooPrice(commodity) {
  const tickerMap = {
    WTI: "CL=F",
    NATURAL_GAS: "NG=F",
    GOLD: "GC=F",
    SILVER: "SI=F",
    COPPER: "HG=F",
    WHEAT: "ZW=F",
    CORN: "ZC=F",
  };

  const ticker = tickerMap[commodity];

  if (!ticker) {
    throw new Error(`Ticker mapping not discovered for asset: ${commodity}`);
  }

  try {
    // FIX: Deactivate internal runtime validation rules entirely
    const result = await yahooFinance.quote(
      ticker,
      {},
      {
        validateResult: false,
      },
    );

    if (!result) {
      throw new Error(`Yahoo Finance returned an empty payload for ${ticker}`);
    }

    // Capture standard market price fields with structural safety fallbacks
    const resolvedPrice =
      result.regularMarketPrice ||
      result.preMarketPrice ||
      result.postMarketPrice ||
      result.regularMarketPreviousClose;

    if (resolvedPrice === undefined || resolvedPrice === null) {
      throw new Error(`Unable to extract price data for ${ticker}`);
    }

    return {
      price: parseFloat(resolvedPrice),
      market: result.fullExchangeName || "Yahoo Finance Futures Feed",
      currency: result.currency || "USD",
    };
  } catch (error) {
    console.error(`Yahoo Engine Error for ${ticker}:`, error.message);
    throw new Error(`Market Feed Exception: ${error.message}`);
  }
}
