// saveTrade.js
import path from "node:path";
import fs from "node:fs/promises";
import { getData } from "./getData.js";

export async function saveTrade(newTrade) {
  try {
    const trades = await getData();
    trades.push({ ...newTrade, timestamp: new Date() }); // Add a timestamp for logs

    const pathJSON = path.join("data", "data.json");
    await fs.writeFile(pathJSON, JSON.stringify(trades, null, 2), "utf8");
  } catch (err) {
    throw new Error("Failed to save trade record: " + err.message);
  }
}
