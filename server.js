import "dotenv/config";
import http from "node:http";
import { serveStatic } from "./serveStatic.js";
import {
  handleGetPrice,
  handlePost,
  handleNews,
} from "./controllers/routeHandlers.js";

const PORT = process.env.PORT || 5500;
const __dirname = import.meta.dirname;

const server = http.createServer((req, res) => {
  // Inject global CORS protection settings cleanly
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  // --- API Routes Execution ---
  if (req.method === "GET" && req.url.startsWith("/price/")) {
    const URLParts = req.url.split("/");
    // FIX: Properly bind the isolated ticker value string to an immutable variable scope
    const symbol = URLParts[2];

    if (!symbol) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      return res.end(
        JSON.stringify({ error: "Missing commodity symbol token" }),
      );
    }

    return handleGetPrice(res, symbol);
  }

  if (req.method === "POST" && req.url === "/trade") {
    console.log("Incoming trade request...");
    return handlePost(res, req);
  }

  if (req.method === "GET" && req.url === "/news") {
    return handleNews(req, res);
  }

  // --- Static Asset Routing ---
  serveStatic(req, res, __dirname);
});

server.listen(PORT, () => {
  console.log(`🚀 Market Dashboard Server active on port ${PORT}`);
});
