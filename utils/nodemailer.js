import nodemailer from "nodemailer";

async function generateEmail(data) {
  // Use 'data' to match your event emitter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your@gmail.com",
      // FIX 1: Remove quotes. quotes make it a string, not a variable.
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: "your@gmail.com",
    to: data.customer.email,
    // FIX 2: Use backticks (`) for template literals, not quotes (").
    subject: `${data.commodity} Trade Confirmation`,
    // FIX 3: Make the body dynamic so it's not always saying Gold
    text: `Your trade for ${data.commodity} at £${data.price} has been processed.`,
  });

  console.log("Email sent successfully");
}
