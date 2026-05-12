import EventEmitter from "node:events";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import fs from "node:fs/promises";

const customerDetails = {
  fullName: "Olly Olly",
  email: "nairobiolga@gmail.com",
};

const marketRequestEmitter = new EventEmitter();

// EMAIL FUNCTION
async function generateEmail(data) {
  const { customer, commodity, price, market, currency } = data;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your@gmail.com",
      pass: "your-app-password",
    },
  });

  await transporter.sendMail({
    from: "your@gmail.com",
    to: customer.email,
    subject: `${commodity} Market Rates`,
    text: `
Hello ${customer.fullName},

Here is your latest commodity market report.

Commodity: ${commodity}
Current Price: ${price}
Market: ${market}
Currency: ${currency}

Thank you for using our market alert service.
    `,
  });

  console.log("✅ Email sent successfully");
}

// PDF FUNCTION
function generatePDF(data) {
  const { customer, commodity, price, market, currency } = data;

  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(`${commodity.toLowerCase()}-report.pdf`));

  // TITLE
  doc.fontSize(25).text("Commodity Market Report", {
    align: "center",
  });

  doc.moveDown();

  // CUSTOMER INFO
  doc.fontSize(16).text(`Customer: ${customer.fullName}`);
  doc.text(`Email: ${customer.email}`);

  doc.moveDown();

  // MARKET DATA
  doc.text(`Commodity: ${commodity}`);
  doc.text(`Current Price: ${price}`);
  doc.text(`Market: ${market}`);
  doc.text(`Currency: ${currency}`);

  doc.moveDown();

  // FOOTER
  doc
    .fontSize(12)
    .text("Generated automatically by the Commodity Alert System.", {
      align: "center",
    });

  doc.end();

  console.log("✅ PDF generated successfully");
}

// DATABASE LOG FUNCTION
function logRequest(data) {
  console.log("✅ Request saved to database");

  console.log({
    customer: data.customer.fullName,
    commodity: data.commodity,
    price: data.price,
    requestedAt: new Date(),
  });
}

// EVENT LISTENERS
marketRequestEmitter.on("commodityRequest", generateEmail);

marketRequestEmitter.on("commodityRequest", generatePDF);

marketRequestEmitter.on("commodityRequest", logRequest);

setTimeout(() => {
  marketRequestEmitter.emit("commodityRequest", {
    customer: customerDetails,
    commodity: "Gold",
    price: "$3,400",
    market: "NYSE",
    currency: "USD",
  });
}, 3000);