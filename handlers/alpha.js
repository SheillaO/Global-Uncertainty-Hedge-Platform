const API_KEY = "3DG5915PZ8Y0JUHW";

async function getGoldData() {
  const response = await fetch(
    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=GLD&apikey=${API_KEY}`,
  );

  const data = await response.json();

  const commodityData = {
    customer: customerDetails,
    commodity: "Gold",
    price: data["Global Quote"]["05. price"],
    market: "NYSE",
    currency: "USD",
  };

  marketRequestEmitter.emit("commodityRequest", commodityData);
}

getGoldData();


