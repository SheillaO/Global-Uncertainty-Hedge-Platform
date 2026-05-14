import PDFDocument from "pdfkit";
import { createWriteStream } from "node:fs"; // FIX: Required synchronous stream generator

// FIX: Added explicit export declaration to the module
export function generatePDF(data) {
  const doc = new PDFDocument();

  // FIX: Fixed string variable interpolation with proper backticks (`)
  doc.pipe(createWriteStream(`trade-${Date.now()}.pdf`));

  doc.fontSize(25).text("Commodity Report", 100, 100);
  doc.fontSize(14).text(`Customer: ${data.customer.fullName}`);
  doc.text(`${data.commodity} Rate: ${data.price}`);

  doc.end();
  console.log("PDF created successfully");
}
