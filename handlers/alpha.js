/**
 * Fetches live commodity data from Alpha Vantage
 * @param {string} symbol - The commodity function (e.g., "NATURAL_GAS", "WHEAT")
 */
export async function getAlphaPrice(symbol) {
  // Using the API key from your environment variables for security
  const API_KEY = process.env.ALPHA_VANTAGE_KEY;

  try {
    // 1. Correct Alpha Vantage URL structure for Commodities
    const url = `https://alphavantage.co{symbol}&interval=monthly&apikey=${API_KEY}`;

    const response = await fetch(url);
    const json = await response.json();

    // 2. Alpha Vantage commodity data is usually in json.data[0]
    // Some endpoints use "Realtime Commodity Exchange Rate"
    const latestData = json.data ? json.data[0] : null;

    if (!latestData && !json["Realtime Commodity Exchange Rate"]) {
      throw new Error(`No data found for ${symbol}. Check your API limits.`);
    }

    // 3. Return a clean object for the route handler
    return {
      price: latestData
        ? latestData.value
        : json["Realtime Commodity Exchange Rate"]["5. Exchange Rate"],
      market: "Alpha Vantage Global",
      currency: "USD", // Alpha Vantage commodities are typically USD-based
      unit: json.unit || "unit",
    };
  } catch (error) {
    console.error("Alpha Vantage API Error:", error.message);
    throw new Error("Failed to fetch data from Alpha Vantage.");
  }
}
