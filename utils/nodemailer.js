import nodemailer from "nodemailer";

// FIX: Added explicit module export tracking keyword
export async function generateEmail(data) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your@gmail.com",
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: "your@gmail.com",
    to: data.customer.email,
    subject: `${data.commodity} Trade Confirmation`,
    text: `Your trade for ${data.commodity} at ${data.currency} ${data.price} has been processed.`,
  });

  console.log("Email sent successfully");
}
