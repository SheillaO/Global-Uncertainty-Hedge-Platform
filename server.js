import "dotenv/config";
import http from "node:http";
import { serveStatic } from "./serveStatic.js";
// FIX: Path references updated to point to the controllers directory
import {
  handleGetPrice,
  handlePost,
  handleNews,
} from "./controllers/routeHandlers.js";

const PORT = 5500;
const __dirname = import.meta.dirname;

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url.startsWith("/price/")) {
    const symbol = req.url.split("/")[2];
    return handleGetPrice(res, symbol);
  }

  if (req.method === "POST" && req.url === "/trade") {
    console.log("Incoming trade request...");
    return handlePost(res, req);
  }

  if (req.method === "GET" && req.url === "/news") {
    return handleNews(req, res);
  }

  serveStatic(req, res, __dirname);
});

// FIX: Added missing listen call to make the node server run locally
server.listen(PORT, () => {
  console.log(`🚀 Market Dashboard Server active on http://localhost:${PORT}`);
});
