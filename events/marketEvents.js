import { getData } from "../utils/getData.js";
import { sendResponse } from "../utils/sendResponse.js";
import { parseJSONBody } from "../utils/parseJSONBody.js";
import { saveTrade } from "../utils/saveTrade.js";
import { sanitizeInput } from "../utils/sanitizeInput.js";
import { marketRequestEmitter } from "../events/marketEvents.js"; // Updated import
import { stories } from "../data/stories.js";

// Mock customer for now (In a real app, this comes from login/session)
const customerDetails = {
  fullName: "Olly Olly",
  email: "nairobiolga@gmail.com",
};

export async function handleGet(res) {
  const data = await getData();
  sendResponse(res, 200, "application/json", JSON.stringify(data));
}

export async function handlePost(res, req) {
  try {
    const parsedBody = await parseJSONBody(req);
    const sanitizedBody = sanitizeInput(parsedBody);

    // Ensure price/market data exists (Alpha Vantage or Yahoo would provide this)
    const fullTradeData = {
      customer: customerDetails,
      commodity: sanitizedBody.commodity || "Unknown",
      price: sanitizedBody.price || "0.00",
      market: sanitizedBody.market || "Global Exchange",
      currency: sanitizedBody.currency || "GBP",
    };

    // 1. Save to data.json
    await saveTrade(fullTradeData);

    // 2. Trigger the Email, PDF, and Logs
    marketRequestEmitter.emit("commodityRequest", fullTradeData);

    sendResponse(
      res,
      201,
      "application/json",
      JSON.stringify({ status: "Trade Processed", data: fullTradeData }),
    );
  } catch (err) {
    sendResponse(
      res,
      400,
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
      `data: ${JSON.stringify({ event: "news-update", story: stories[randomIndex] })}\n\n`,
    );
  }, 3000);

  req.on("close", () => clearInterval(intervalId));
}
