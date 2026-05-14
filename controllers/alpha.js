import sanitizehtml from "sanitize-html";

export async function getAlphaPrice(symbol) {
  const API_KEY = process.env.ALPHA_VANTAGE_KEY;

  const alphaFunctionMap = {
    NATURAL_GAS: "NATURAL_GAS",
    COPPER: "COPPER",
    WHEAT: "WHEAT",
    CORN: "CORN",
  };

  const functionName = alphaFunctionMap[symbol];
  if (!functionName) {
    throw new Error(
      `Unsupported Alpha Vantage commodity token requested: ${symbol}`,
    );
  }

  try {
    // FIX: Implemented canonical template literal parameter tags (${})
    const url = `alphavantage.co{functionName}&interval=monthly&apikey=${API_KEY}`;

    const response = await fetch(url);
    const json = await response.json();

    const latestData = json["data"] ? json["data"][0] : null;

    if (!latestData && !json["Realtime Commodity Exchange Rate"]) {
      throw new Error(`No data found for ${symbol}. Check your API limits.`);
    }

    const rawPrice = latestData
      ? latestData.value
      : json["Realtime Commodity Exchange Rate"]["5. Exchange Rate"];

    return {
      price: parseFloat(rawPrice),
      market: "Alpha Vantage Global",
      currency: "USD",
      unit: json.unit || "unit",
    };
  } catch (error) {
    console.error("Alpha Vantage API Error:", error.message);
    throw new Error("Failed to fetch data from Alpha Vantage.");
  }
}
