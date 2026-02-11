import "dotenv/config.js";
import { createTransport } from "nodemailer";

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send an email using async/await
const sendRealMail = async ({ email = "author@email.com" } = {}) => {
  const info = await transporter.sendMail({
    from: '"Blog Website" <blog@email.com>',
    to: email,
    subject: "Hello ✔",
    text: "Hello world?", // Plain-text version of the message
    html: "<b>Hello world?</b>", // HTML version of the message
  });

  console.log("Message sent:", info.messageId);
};

const sendOtpMail = async ({ email, otp, expiry, resetURL } = {}) => {
  const info = await transporter.sendMail({
    from: '"Blog Website <blog@email.com>"',
    to: email,
    subject: "Your otp code",
    text: `Your otp code is \n ${otp}`,
    html: `
    <div>
        <div>
            <b>Your otp code is \n ${otp}<b>
        </div>
        <p>Enter this otp code to the link below.</p>
        <div>
            <a href="${resetURL}">Password Change Link</a>
        </div>
    </div>
    `,
  });
  console.log("Otp email sent:", info.messageId);
  return true;
};

const sendMail = async (ctx) => {
  const { email } = ctx.request.body;
  console.log(`Sending mail to ${email}`);

  await sendRealMail();
};

export { sendMail, sendOtpMail };
