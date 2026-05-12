import { getYahooPrice } from "./yahoo.js";
import { getAlphaPrice } from "./alpha.js";
import { sendResponse } from "../utils/sendResponse.js";
import { parseJSONBody } from "../utils/parseJSONBody.js";
import { saveTrade } from "../utils/saveTrade.js";
import { marketRequestEmitter } from "../events/marketEvents.js";

// Helper function to decide which API to call
async function fetchPrice(commodity) {
  // Metals and Oil go to Yahoo, everything else (Ag/Gas) goes to Alpha
  if (["GOLD", "WTI", "SILVER"].includes(commodity)) {
    return await getYahooPrice(commodity);
  } else {
    return await getAlphaPrice(commodity);
  }
}

// 1. GET Handle: The Live Ticker (called every 30s by frontend)
export async function handleGetPrice(res, symbol) {
  try {
    const data = await fetchPrice(symbol);
    sendResponse(res, 200, "application/json", JSON.stringify(data));
  } catch (err) {
    console.error("Ticker Error:", err.message);
    sendResponse(
      res,
      500,
      "application/json",
      JSON.stringify({ error: err.message }),
    );
  }
}

// 2. POST Handle: The "Invest Now" button
export async function handlePost(res, req) {
  try {
    const body = await parseJSONBody(req);
    const { commodity, currency, amount } = body;

    // Fetch the latest live price for the trade
    const liveData = await fetchPrice(commodity);

    const tradeData = {
      customer: { fullName: "Olly Olly", email: "nairobiolga@gmail.com" },
      commodity,
      price: liveData.price,
      currency,
      amount,
      market: liveData.market || "Global Market",
    };

    // Professional Sequence: Save to JSON -> PDF -> Email -> Logs
    await saveTrade(tradeData);
    marketRequestEmitter.emit("commodityRequest", tradeData);

    // Send success back to the frontend
    sendResponse(
      res,
      201,
      "application/json",
      JSON.stringify({
        status: "Success",
        data: tradeData,
      }),
    );
  } catch (err) {
    console.error("Trade Error:", err.message);
    sendResponse(
      res,
      500,
      "application/json",
      JSON.stringify({ error: err.message }),
    );
  }
}
