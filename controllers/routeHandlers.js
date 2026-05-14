import { getYahooPrice } from "./yahoo.js";
import { getAlphaPrice } from "./alpha.js";
import { sendResponse } from "../utils/sendResponse.js";
import { parseJSONBody } from "../utils/parseJSONBody.js";
import { saveTrade } from "../utils/saveTrade.js";
import { marketRequestEmitter } from "../events/marketEvents.js";
import { stories } from "../data/stories.js";

async function fetchPrice(commodity) {
  if (["GOLD", "WTI", "SILVER"].includes(commodity)) {
    return await getYahooPrice(commodity);
  } else {
    return await getAlphaPrice(commodity);
  }
}

// 1. GET: The Live Ticker
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

// 2. POST: The "Invest Now" button
export async function handlePost(res, req) {
  try {
    const body = await parseJSONBody(req);
    const { commodity, currency, amount } = body;

    const liveData = await fetchPrice(commodity);

    const tradeData = {
      customer: { fullName: "Olly Olly", email: "nairobiolga@gmail.com" },
      commodity,
      price: liveData.price,
      currency,
      amount: parseFloat(amount), // FIX: Force number formatting on incoming payload data values
      market: liveData.market || "Global Market",
    };

    await saveTrade(tradeData);
    marketRequestEmitter.emit("commodityRequest", tradeData);

    sendResponse(
      res,
      201,
      "application/json",
      JSON.stringify({ status: "Success", data: tradeData }),
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

// 3. GET: The Live News Stream (SSE)
export async function handleNews(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const intervalId = setInterval(() => {
    let randomIndex = Math.floor(Math.random() * stories.length);
    res.write(
      `data: ${JSON.stringify({
        event: "news-update",
        story: stories[randomIndex],
      })}\n\n`,
    );
  }, 5000);

  // FIX: Added missing block syntax closing characters to resolve runtime crash
  req.on("close", () => {
    clearInterval(intervalId);
    res.end();
  });
}
