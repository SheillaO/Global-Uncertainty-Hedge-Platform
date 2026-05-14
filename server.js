import "dotenv/config";
import http from "node:http";
import { serveStatic } from "./serveStatic.js";
import {
  handleGetPrice,
  handlePost,
  handleNews,
} from "./controllers/routeHandlers.js";

// FIX: Dynamically read Render's runtime port assignment or default to 5500 locally
const PORT = process.env.PORT || 5500;
const __dirname = import.meta.dirname;

const server = http.createServer((req, res) => {
  // FIX: Inject global CORS headers to allow cross-origin connection traffic from your Netlify domain
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // FIX: Handle browser pre-flight validation checks to prevent connection timeout errors
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  // --- API Routes Execution ---
 if (req.method === "GET" && req.url.startsWith("/price/")) {
   const symbol = req.url.split("/")[2]; // ✅ FIXED: Captures the raw string text ("COPPER")
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
