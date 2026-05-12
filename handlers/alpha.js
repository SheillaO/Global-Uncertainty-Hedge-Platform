const API_KEY = "3DG5915PZ8Y0JUHW";

export async function getCommodityData(symbol, customer) {
  // We use symbols like WTI, GOLD, SILVER from your HTML
  const response = await fetch(
    `https://alphavantage.co{symbol}&apikey=${API_KEY}`,
  );

  const data = await response.json();
  const quote = data["Global Quote"];

  if (!quote) throw new Error("Market data not found");

  const tradeData = {
    customer: customer,
    commodity: symbol,
    price: quote["05. price"],
    market: "Global Exchange",
    currency: "USD", // You can update this based on your currency selector
  };

  // Trigger the emails and PDFs
  marketRequestEmitter.emit("commodityRequest", tradeData);
}
