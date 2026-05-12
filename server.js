// server.js
import "dotenv/config";
import http from "node:http";
import { serveStatic } from "./serveStatic.js";
// Adjust the path to match your "handlers" folder
import { handleGetPrice, handlePost } from "./handlers/routeHandlers.js";

const PORT = 5500;
const __dirname = import.meta.dirname;

const server = http.createServer((req, res) => {
  // Logic for /price/ and /trade...
  if (req.method === "GET" && req.url.startsWith("/price/")) {
    const symbol = req.url.split("/")[2];
    return handleGetPrice(res, symbol);
  }

  if (req.method === "POST" && req.url === "/trade") {
    return handlePost(res, req);
  }

  serveStatic(req, res, __dirname);
});

server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
