import http from "node:http";
import { serveStatic } from "./serveStatic.js"; // Adjust path if needed

const PORT = 5500;
const __dirname = import.meta.dirname;

const server = http.createServer((req, res) => {
  // Pass the request to your static file handler
  // baseDir is __dirname where your 'public' folder lives
  serveStatic(req, res, __dirname);
});

server.listen(PORT, () => {
  console.log(`✅ Global Trade Server running at http://localhost:${PORT}`);
});
