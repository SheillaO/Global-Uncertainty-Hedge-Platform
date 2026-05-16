import { getAlphaPrice } from "./alpha.js"; 
import { sendResponse } from "../utils/sendResponse.js";
import { parseJSONBody } from "../utils/parseJSONBody.js";
import { saveTrade } from "../utils/saveTrade.js";
import { marketRequestEmitter } from "../events/marketEvents.js";
import { stories } from "../data/stories.js";


async function fetchPrice(commodity) {
  return await getAlphaPrice(commodity);
}


export async function handleGetPrice(res, symbol) {
  try {
    if (typeof symbol !== "string") {
      throw new Error(
        `Invalid symbol data structure passed: ${JSON.stringify(symbol)}`,
      );
    }

    const cleanSymbol = symbol.trim().toUpperCase();
    const data = await fetchPrice(cleanSymbol);

    sendResponse(res, 200, "application/json", JSON.stringify(data));
  } catch (err) {
    console.error("Ticker Exception Triggered:", err.message);
    sendResponse(
      res,
      500,
      "application/json",
      JSON.stringify({ error: err.message }),
    );
  }
}

// 2. POST: The "Invest Now" Button Handler
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
      amount: parseFloat(amount),
      market: liveData.market || "Alpha Vantage Global Feed",
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

  req.on("close", () => {
    clearInterval(intervalId);
    res.end();
  });
}
