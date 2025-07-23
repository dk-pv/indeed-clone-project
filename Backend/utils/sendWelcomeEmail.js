import transporter from "../config/nodemailer.js";

export const sendWelcomeEmail = async (email, nameOrRole) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to Indeed Clone!",
    html: `
      <div style="font-family: 'Segoe UI', Roboto, sans-serif; background-color: #f7f8fa; padding: 40px 20px;">
        <div style="max-width: 560px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
          <div style="padding: 32px 40px 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #2557a7; line-height: 1.3;">
                Indeed 
              </h1>
            <h1 style="font-size: 24px; color: #2d3748;">Welcome ${nameOrRole || "User"}!</h1>
          </div>
          <div style="padding: 0 40px 32px;">
            <p style="font-size: 16px; color: #4a5568;">
              Thank you for signing up on Indeed Clone. We’re thrilled to have you on board!
            </p>
            <a href="https://your-domain.com" style="display:inline-block; margin: 20px 0; padding: 12px 24px; background-color:#2557a7; color:white; border-radius:6px; text-decoration:none;">
              Get Started
            </a>
          </div>
          <div style="background:#f7f8fa; padding:20px; text-align:center; font-size:12px; color:#a0aec0;">
            © ${new Date().getFullYear()} Indeed Clone. All rights reserved.
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}`);
  } catch (error) {
    console.error("❌ Failed to send welcome email:", error.message);
  }
};
