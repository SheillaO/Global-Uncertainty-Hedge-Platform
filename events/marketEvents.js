import { EventEmitter } from "events";
import { generatePDF } from "../utils/pdfKit.js";
import { generateEmail } from "../utils/nodemailer.js";
import { createAlert } from "../utils/createAlert.js";

export const marketRequestEmitter = new EventEmitter();

// Central background execution pipe tracking order sequences
marketRequestEmitter.on("commodityRequest", async (tradeData) => {
  try {
    // 1. Log transaction details locally to your console terminal
    createAlert(tradeData);

    // 2. Generate a unique, timestamped filename indicator string
    const uniqueFilename = `trade-${Date.now()}.pdf`;

    // 3. Build and save the file to Render's disk
    generatePDF(tradeData, uniqueFilename);

    // 4. Send the email with the newly created PDF attached
    await generateEmail(tradeData, uniqueFilename);
  } catch (error) {
    console.error("❌ Background Worker Pipeline Exception:", error.message);
  }
});
