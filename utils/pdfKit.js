import PDFDocument from "pdfkit";
import { createWriteStream } from "node:fs";

/**
 * Constructs official invoice transaction receipts on the local environment disk space
 * @param {Object} data - Core tradeData configuration tracking pricing metrics
 * @param {string} filename - Target output string variable passed by the event system
 */
export function generatePDF(data, filename) {
  const doc = new PDFDocument();

  // Pipe the live buffer array stream directly into a write file thread
  doc.pipe(createWriteStream(filename));

  // --- Header Panel Design Layout ---
  doc
    .fontSize(24)
    .fillColor("#cbd5e1")
    .text("GLOBAL TRADE DESK", { align: "center" });
  doc
    .fontSize(10)
    .fillColor("#94a3b8")
    .text("Official Asset Contract Agreement", { align: "center" });
  doc.moveDown(2);

  // --- Content Fields Specification Reading ---
  doc
    .fontSize(14)
    .fillColor("#ffffff")
    .text(`Investor Profile Name: ${data.customer.fullName}`);
  doc.text(`Target Asset Class: ${data.commodity}`);
  doc.text(`Execution Price Point: $${data.price.toFixed(2)}`);
  doc.text(
    `Allocated Principal Volume: ${data.currency} ${data.amount.toFixed(2)}`,
  );
  doc.text(`Clearing Marketplace Origin: ${data.market}`);
  doc.moveDown();

  doc
    .fontSize(10)
    .fillColor("#64748b")
    .text(`Transaction Stamp ID Reference: CONTRACT-${Date.now()}`);

  doc.end();
  console.log(
    `📄 PDF Contract Document [${filename}] constructed and saved to disk.`,
  );
}
