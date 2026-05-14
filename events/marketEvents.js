import { EventEmitter } from "events";
import { generatePDF } from "../utils/pdfKit.js";
import { generateEmail } from "../utils/nodemailer.js";
import { createAlert } from "../utils/createAlert.js";

export const marketRequestEmitter = new EventEmitter();

// Handle cross-utility execution whenever a trade successfully fires
marketRequestEmitter.on("commodityRequest", async (tradeData) => {
  try {
    // 1. Log transaction parameters locally to console log
    createAlert(tradeData);

    // 2. Generate receipt PDF file confirmation records
    generatePDF(tradeData);

    // 3. Dispatch confirmation notifications via SMTP mail servers
    await generateEmail(tradeData);
  } catch (error) {
    console.error("Background Worker Sequence Fault:", error.message);
  }
});
