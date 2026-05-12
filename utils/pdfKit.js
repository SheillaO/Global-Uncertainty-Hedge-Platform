import PDFDocument from "pdfkit";
import fs from "node:fs/promises";

function generatePDF(data) {
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream("report.pdf"));

  doc.fontSize(25).text("Commodity Report", 100, 100);

  doc.text(`Customer: ${data.customer.fullName}`);
  doc.text(`${data.commodity} Rate: ${data.price}`);

  doc.end();

  console.log("PDF created");
}