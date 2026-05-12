import yahooFinance from "yahoo-finance2";


const result = await yahooFinance.quote("GC=F");

const commodityData = {
  customer: customerDetails,
  commodity: "Gold",
  price: result.regularMarketPrice,
  market: result.fullExchangeName,
  currency: result.currency,
};


marketRequestEmitter.emit("commodityRequest", commodityData);
