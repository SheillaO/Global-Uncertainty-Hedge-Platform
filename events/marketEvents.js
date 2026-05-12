import yahooFinance from "yahoo-finance2";
import { getData } from "../utils/getData.js";
import { sendResponse } from "../utils/sendResponse.js";
import { parseJSONBody } from "../utils/parseJSONBody.js";
import { saveTrade } from "../utils/saveTrade.js"; // Renamed from addNewSighting
import { sanitizeInput } from "../utils/sanitizeInput.js";
import { marketRequestEmitter } from "../events/marketEvents.js"; // Renamed from sightingEvents
import { stories } from "../data/stories.js";

const ALPHA_API_KEY = process.env.ALPHA_VANTAGE_KEY;

// 1. GET: Fetch trade history from data.json
export async function handleGet(res) {
  try {
    const data = await getData();
    sendResponse(res, 200, "application/json", JSON.stringify(data));
  } catch (err) {
    sendResponse(
      res,
      500,
      "application/json",
      JSON.stringify({ error: "Failed to load history" }),
    );
  }
}

// 2. POST: Process a live trade using Yahoo/Alpha Vantage
export async function handlePost(res, req) {
  try {
    const body = await parseJSONBody(req);
    const sanitizedBody = sanitizeInput(body);
    const { commodity, currency, amount } = sanitizedBody;

    let livePrice = 0;
    let marketName = "Global Market";

    // Logic: Use Yahoo for Metals/Oil (Futures), Alpha for others
    if (commodity === "GOLD" || commodity === "WTI" || commodity === "SILVER") {
      const tickerMap = { GOLD: "GC=F", WTI: "CL=F", SILVER: "SI=F" };
      const result = await yahooFinance.quote(tickerMap[commodity]);
      livePrice = result.regularMarketPrice;
      marketName = result.fullExchangeName || "Yahoo Finance";
    } else {
      // Corrected Alpha Vantage URL for Commodities
      const response = await fetch(
        `https://alphavantage.co{commodity}&apikey=${ALPHA_API_KEY}`,
      );
      const apiData = await response.json();

      // Alpha Vantage commodity endpoints return { "data": [{ "date": "...", "value": "..." }] }
      if (apiData.data && apiData.data[0]) {
        livePrice = apiData.data[0].value;
        marketName = "Alpha Vantage Data";
      } else {
        throw new Error("Could not fetch price from Alpha Vantage");
      }
    }

    const tradeData = {
      customer: { fullName: "Olly Olly", email: "nairobiolga@gmail.com" },
      commodity,
      price: livePrice,
      currency,
      amount: amount,
      market: marketName,
    };

    // Trigger the automatic PDF/Email/Save sequence
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

// 3. NEWS: Server-Sent Events for the ticker
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
  }, 5000); // 5 seconds is more professional for news tickers

  // Clean up when user leaves the page
  req.on("close", () => {
    clearInterval(intervalId);
    res.end();
  });
}
