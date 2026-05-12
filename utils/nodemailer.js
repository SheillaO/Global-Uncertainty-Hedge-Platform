import nodemailer from "nodemailer";

async function generateEmail(customer) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your@gmail.com",
      pass: "yourpassword",
    },
  });

  await transporter.sendMail({
    from: "your@gmail.com",
    to: customer.email,
    subject: "Gold Market Rates",
    text: "Gold today is $3400",
  });

  console.log("Email sent");
}
