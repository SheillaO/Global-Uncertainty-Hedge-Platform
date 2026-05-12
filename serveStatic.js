import path from "node:path";
import fs from "node:fs/promises";
import { sendResponse } from "./utils/sendResponse.js";
import { getContentType } from "./utils/getContentType.js";

export async function serveStatic(req, res, baseDir) {
  const publicDir = path.join(baseDir, "public");

  // If URL is '/', serve index.html, otherwise serve the requested file
  const relativePath = req.url === "/" ? "index.html" : req.url;
  const filePath = path.join(publicDir, relativePath);

  const ext = path.extname(filePath);
  const contentType = getContentType(ext);

  try {
    const content = await fs.readFile(filePath);
    sendResponse(res, 200, contentType, content);
  } catch (err) {
    if (err.code === "ENOENT") {
      // Professional 404 handling
      try {
        const errorContent = await fs.readFile(
          path.join(publicDir, "404.html"),
        );
        sendResponse(res, 404, "text/html", errorContent);
      } catch (fourOhFourErr) {
        sendResponse(res, 404, "text/plain", "404 - Page Not Found");
      }
    } else {
      sendResponse(res, 500, "text/html", `<h1>Server Error: ${err.code}</h1>`);
    }
  }
}
