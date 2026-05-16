import { EventEmitter } from "events";
import { generatePDF } from "../utils/pdfKit.js";
import { generateEmail } from "../utils/nodemailer.js";
import { createAlert } from "../utils/createAlert.js";

export const marketRequestEmitter = new EventEmitter();


marketRequestEmitter.on("commodityRequest", async (tradeData) => {
  try {
   
    createAlert(tradeData);

    
    const uniqueFilename = `trade-${Date.now()}.pdf`;

    
    generatePDF(tradeData, uniqueFilename);

    // Send the email with the newly created PDF attached
    await generateEmail(tradeData, uniqueFilename);
  } catch (error) {
    console.error("❌ Background Worker Pipeline Exception:", error.message);
  }
});
