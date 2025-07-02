import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); 

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Indeed Clone verification code",
    html: `
      <div style="font-family: 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f7f8fa; padding: 40px 20px; margin: 0;">
        <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: #ffffff; padding: 32px 40px 24px; border-bottom: 1px solid #e4e6ea;">
            <div style="text-align: center;">
              <img src="https://1000logos.net/wp-content/uploads/2023/01/Indeed-logo-500x281.jpg" alt="Indeed Clone" style="height: 32px; margin-bottom: 16px;" />
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #2d3748; line-height: 1.3;">
                Verify your email address
              </h1>
            </div>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 40px 40px 32px;">
            <p style="margin: 0 0 24px; font-size: 16px; color: #4a5568; line-height: 1.5;">
              Hi there,
            </p>
            
            <p style="margin: 0 0 32px; font-size: 16px; color: #4a5568; line-height: 1.5;">
              To continue with your Indeed Clone account, please verify your email address by entering this verification code:
            </p>
            
            <!-- OTP Code Box -->
            <div style="background: #f7f8fa; border: 2px solid #e4e6ea; border-radius: 8px; padding: 24px; text-align: center; margin: 32px 0;">
              <div style="font-size: 36px; font-weight: 700; color: #2557a7; letter-spacing: 4px; font-family: 'Courier New', monospace;">
                ${otp}
              </div>
            </div>
            
            <p style="margin: 32px 0 0; font-size: 14px; color: #718096; line-height: 1.5;">
              This verification code will expire in <strong>5 minutes</strong>. If you didn't request this code, you can safely ignore this email.
            </p>
          </div>
          
          <!-- Divider -->
          <div style="border-top: 1px solid #e4e6ea; margin: 0 40px;"></div>
          
          <!-- Footer -->
          <div style="padding: 32px 40px; background: #f7f8fa;">
            <div style="text-align: center;">
              <p style="margin: 0 0 16px; font-size: 14px; color: #718096; line-height: 1.5;">
                Need help? Visit our <a href="#" style="color: #2557a7; text-decoration: none;">Help Center</a> or contact <a href="#" style="color: #2557a7; text-decoration: none;">Support</a>
              </p>
              
              <div style="margin: 24px 0 16px;">
                <div style="border-top: 1px solid #e4e6ea; margin: 0 auto; width: 100px;"></div>
              </div>
              
              <p style="margin: 0; font-size: 12px; color: #a0aec0;">
                © ${new Date().getFullYear()} Indeed Clone. All rights reserved.
              </p>
              
              <p style="margin: 8px 0 0; font-size: 12px; color: #a0aec0;">
                This email was sent to ${email}. If you no longer wish to receive these emails, you can <a href="#" style="color: #a0aec0; text-decoration: underline;">unsubscribe</a>.
              </p>
            </div>
          </div>
          
        </div>
        
        <!-- Email Client Spacer -->
        <div style="height: 40px;"></div>
        
      </div>
    `,
  };
  
  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("OTP sent:", result.response);
  } catch (error) {
    console.error("Email Error:", error.message);
    throw new Error("Failed to send OTP");
  }
};
