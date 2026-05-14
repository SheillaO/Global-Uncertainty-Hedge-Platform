import yahooFinance from "yahoo-finance2";

// Suppress library validation exception blocks during live production execution
yahooFinance.setGlobalConfig({ validation: { logErrors: false } });

export async function getYahooPrice(commodity) {
  const tickerMap = {
    GOLD: "GC=F",
    WTI: "CL=F",
    SILVER: "SI=F",
  };

  const ticker = tickerMap[commodity];

  if (!ticker) {
    throw new Error(`Invalid Yahoo commodity token requested: ${commodity}`);
  }

  try {
    const result = await yahooFinance.quote(ticker);

    // Safety fallback block if third-party metrics return empty objects
    if (!result) {
      throw new Error(
        `Yahoo Finance empty response payload returned for target ticker ${ticker}`,
      );
    }

    const resolvedPrice =
      result.regularMarketPrice ||
      result.preMarketPrice ||
      result.postMarketPrice;

    if (resolvedPrice === undefined || resolvedPrice === null) {
      throw new Error(
        `Unable to extract regularMarketPrice metrics for ${ticker}`,
      );
    }

    return {
      price: parseFloat(resolvedPrice),
      market: result.fullExchangeName || "Yahoo Finance Market Feed",
      currency: result.currency || "USD",
    };
  } catch (error) {
    console.error("Yahoo API Subsystem Fault:", error.message);
    throw new Error(`Subsystem Execution Failure: ${error.message}`);
  }
}
