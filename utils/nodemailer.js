import nodemailer from "nodemailer";
import path from "node:path";

export async function generateEmail(data, pdfFilename) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      // FIX 1: Replace this placeholder string with your real Gmail profile address
      user: "nairobiolga@gmail.com",
      pass: process.env.EMAIL_PASS,
    },
  });

  const absolutePdfPath = path.join(process.cwd(), pdfFilename);

  await transporter.sendMail({
    // FIX 2: Align the standard sender address parameters to match your login
    from: '"Global Trade Desk" <nairobiolga@gmail.com>',
    to: data.customer.email, // This sends it cleanly straight back to yourself!
    subject: `🚨 Trade Confirmation: Asset Allocation Verified (${data.commodity})`,
    text: `Hello ${data.customer.fullName},\n\nYour purchase order has been executed successfully.\n\nAsset: ${data.commodity}\nStrike Rate: $${data.price.toFixed(2)}\nInvested Principal: ${data.currency} ${data.amount.toFixed(2)}\n\nPlease find your official transaction contract PDF receipt attached to this message.`,
    attachments: [
      {
        filename: pdfFilename,
        path: absolutePdfPath,
      },
    ],
  });

  console.log(
    `📧 Transaction confirmation email with attachment ${pdfFilename} dispatched successfully.`,
  );
}
