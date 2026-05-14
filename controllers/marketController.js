import { getAlphaPrice } from "./alpha.js";
import { sendResponse } from "../utils/sendResponse.js";
import { parseJSONBody } from "../utils/parseJSONBody.js";
import { saveTrade } from "../utils/saveTrade.js";
import { getData } from "../utils/getData.js";
import { sanitizeInput } from "../utils/sanitizeInput.js";
import { marketRequestEmitter } from "../events/marketEvents.js";
import { stories } from "../data/stories.js";
// 1. GET: Fetch complete local trade history from data.json
export async function handleGet(res) {
  try {
    const data = await getData();
    sendResponse(res, 200, "application/json", JSON.stringify(data));
  } catch (err) {
    console.error("History Load Error:", err.message);
    sendResponse(
      res,
      500,
      "application/json",
      JSON.stringify({ error: "Failed to load trade history logs" }),
    );
  }
}

// 2. GET: Fetch single asset live prices via Yahoo Finance
export async function handleGetPrice(res, symbol) {
  try {
    if (typeof symbol !== "string") {
      throw new Error(
        `Invalid symbol data structure passed: ${JSON.stringify(symbol)}`,
      );
    }

    const cleanSymbol = symbol.trim().toUpperCase();
    const data = await getYahooPrice(cleanSymbol);

    sendResponse(res, 200, "application/json", JSON.stringify(data));
  } catch (err) {
    console.error("Ticker Feed Error:", err.message);
    sendResponse(
      res,
      500,
      "application/json",
      JSON.stringify({ error: err.message }),
    );
  }
}

// 3. POST: Process an investment order execution
export async function handlePost(res, req) {
  try {
    const body = await parseJSONBody(req);
    const sanitizedBody = sanitizeInput(body);
    const { commodity, currency, amount } = sanitizedBody;

    const liveData = await getYahooPrice(commodity);

    const tradeData = {
      customer: { fullName: "Olly Olly", email: "nairobiolga@gmail.com" },
      commodity,
      price: liveData.price,
      currency,
      amount: parseFloat(amount),
      market: liveData.market || "Yahoo Finance Futures",
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
    console.error("Trade Execution Error:", err.message);
    sendResponse(
      res,
      500,
      "application/json",
      JSON.stringify({ error: err.message }),
    );
  }
}

// 4. GET: Handle the Server-Sent Events (SSE) live breaking news ticker stream
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
