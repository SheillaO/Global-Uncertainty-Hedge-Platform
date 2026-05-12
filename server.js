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
  // ALWAYS check API routes FIRST
  if (req.method === "GET" && req.url.startsWith("/price/")) {
    const symbol = req.url.split("/")[2];
    return handleGetPrice(res, symbol);
  }

  if (req.method === "POST" && req.url === "/trade") {
    console.log("Incoming trade request..."); // Add this to debug
    return handlePost(res, req);
  }

  if (req.method === "GET" && req.url === "/news") {
    return handleNews(req, res);
  }

  // ONLY IF it's not an API route, try to serve a file
  serveStatic(req, res, __dirname);
});