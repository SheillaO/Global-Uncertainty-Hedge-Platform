import "dotenv/config";
import http from "node:http";
import { serveStatic } from "./serveStatic.js";
import {
  handleGetPrice,
  handlePost,
  handleNews,
} from "./controllers/routeHandlers.js";

// FIX: Dynamically binding port for deployment environments, fallback to 5500 locally
const PORT = process.env.PORT || 5500;
const __dirname = import.meta.dirname;

const server = http.createServer((req, res) => {
  // Inject global CORS headers to allow cross-origin traffic from your Netlify domain safely
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle browser pre-flight validation checks gracefully
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  // --- API Routes Execution ---
  if (req.method === "GET" && req.url.startsWith("/price/")) {
    const URLParts = req.url.split("/");
    const symbol = URLParts[2]; // ✅ FIXED: Explicitly captures clean index 2 string token ("GOLD", "WTI")

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
