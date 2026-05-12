// server.js
import "dotenv/config";
import http from "node:http";
import { serveStatic } from "./serveStatic.js";
// 1. ADD handleNews TO THE IMPORT
import {
  handleGetPrice,
  handlePost,
  handleNews,
} from "./handlers/routeHandlers.js";

const PORT = 5500;
const __dirname = import.meta.dirname;

const server = http.createServer((req, res) => {
  // 2. LIVE TICKER ROUTE
  if (req.method === "GET" && req.url.startsWith("/price/")) {
    const symbol = req.url.split("/")[2];
    return handleGetPrice(res, symbol);
  }

  // 3. TRADE EXECUTION ROUTE
  if (req.method === "POST" && req.url === "/trade") {
    return handlePost(res, req);
  }

  // 4. ADD THE NEWS ROUTE HERE
  if (req.method === "GET" && req.url === "/news") {
    return handleNews(req, res);
  }

  // 5. STATIC FILES (HTML, CSS, JS)
  serveStatic(req, res, __dirname);
});

server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
