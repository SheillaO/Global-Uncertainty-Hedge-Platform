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

// 2. GET: Fetch single asset live prices via Alpha Vantage Simulation
export async function handleGetPrice(res, symbol) {
  try {
    if (typeof symbol !== "string") {
      throw new Error(
        `Invalid symbol data structure passed: ${JSON.stringify(symbol)}`,
      );
    }

    const cleanSymbol = symbol.trim().toUpperCase();
    const data = await getAlphaPrice(cleanSymbol);

    sendResponse(res, 200, "application/json", JSON.stringify(data));
  } catch (err) {
    console.error("Ticker Feed Error:", err.message);
    sendResponse(
      res,
      500,
      "application/json",
      JSON.stringify({ error: "Ticker resolution internal error" }),
    );
  }
}

// 3. POST: Process an investment order execution
export async function handlePost(res, req) {
  try {
    const body = await parseJSONBody(req);
    const sanitizedBody = sanitizeInput(body);
    const { commodity, currency, amount } = sanitizedBody;

    const liveData = await getAlphaPrice(commodity);

    const tradeData = {
      customer: { fullName: "Olly Olly", email: "nairobiolga@gmail.com" },
      commodity,
      price: liveData.price,
      currency,
      amount: parseFloat(amount),
      market: liveData.market || "Global Commodities Feed",
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
  // Clear and configure the continuous streaming content response channel
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform", // FIX: added 'no-transform' to block proxy compression filters
    Connection: "keep-alive",
    "X-Accel-Buffering": "no", // FIX: directly orders corporate proxies (like Nginx/Cloudflare) to disable buffering
  });

  // ✅ CRITICAL FIX: Forces Render's proxy buffer to open its channel gate immediately
  if (typeof res.flushHeaders === "function") {
    res.flushHeaders();
  }

  // Immediately push a starting data connection ping down the text line
  res.write(
    `data: ${JSON.stringify({ event: "news-update", story: "Connected to global marketplace news feed..." })}\n\n`,
  );

  const intervalId = setInterval(() => {
    let randomIndex = Math.floor(Math.random() * stories.length);

    // Explicit double trailing newline characters (\n\n) required by browser standard listeners
    res.write(
      `data: ${JSON.stringify({
        event: "news-update",
        story: stories[randomIndex],
      })}\n\n`,
    );
  }, 5000);

  // Clear memory timers immediately when a client tab closes or leaves the page
  req.on("close", () => {
    clearInterval(intervalId);
    res.end();
  });
}
