import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // your gmail
    pass: process.env.EMAIL_PASS, // your app password
  },
});

const sendStatusUpdateEmail = async ({
  to,
  applicantName,
  jobTitle,
  newStatus,
}) => {
  let subject = "";
  let htmlContent = "";
  let textContent = "";

  // Indeed-style email templates
  const getEmailTemplate = (status, name, job) => {
    const baseStyle = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background-color: #2557a7; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Indeed</h1>
        </div>
        <div style="padding: 30px 20px; line-height: 1.6; color: #333333;">
    `;

    const footerStyle = `
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
          <p style="margin: 0; font-size: 14px; color: #6c757d;">
            This email was sent by Indeed on behalf of the employer.
          </p>
          <p style="margin: 10px 0 0 0; font-size: 12px; color: #6c757d;">
            © 2025 Indeed. All rights reserved.
          </p>
        </div>
      </div>
    `;

    switch (status) {
      case "finalist":
        return {
          subject: "🎉 You're a Finalist!",
          html:
            baseStyle +
            `
            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <h2 style="color: #155724; margin: 0 0 10px 0; font-size: 20px;">Congratulations!</h2>
              <p style="margin: 0; color: #155724; font-weight: 500;">You've been selected as a finalist</p>
            </div>
            <p style="font-size: 16px; margin-bottom: 15px;">Hi <strong>${name}</strong>,</p>
            <p style="font-size: 16px; margin-bottom: 20px;">
              Great news! You've been selected as a finalist for the position:
            </p>
            <div style="background-color: #f8f9fa; border-left: 4px solid #2557a7; padding: 15px; margin: 20px 0;">
              <h3 style="margin: 0; color: #2557a7; font-size: 18px;">${job}</h3>
            </div>
            <p style="font-size: 16px; margin-bottom: 20px;">
              You're now in the final selection process. We'll be in touch soon with next steps.
            </p>
            <p style="font-size: 16px; margin-bottom: 5px;">Best regards,</p>
            <p style="font-size: 16px; margin: 0; color: #2557a7; font-weight: 500;">The Hiring Team</p>
          ` +
            footerStyle,
          text: `Hi ${name},\n\nGreat news! You've been selected as a finalist for the job: "${job}". Stay tuned for further updates.\n\nBest regards,\nThe Hiring Team`,
        };

      case "reject":
        return {
          subject: "Job Application Update",
          html:
            baseStyle +
            `
            <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <h2 style="color: #721c24; margin: 0 0 10px 0; font-size: 20px;">Application Update</h2>
              <p style="margin: 0; color: #721c24; font-weight: 500;">Regarding your recent application</p>
            </div>
            <p style="font-size: 16px; margin-bottom: 15px;">Hi <strong>${name}</strong>,</p>
            <p style="font-size: 16px; margin-bottom: 20px;">
              Thank you for your interest in the position:
            </p>
            <div style="background-color: #f8f9fa; border-left: 4px solid #6c757d; padding: 15px; margin: 20px 0;">
              <h3 style="margin: 0; color: #495057; font-size: 18px;">${job}</h3>
            </div>
            <p style="font-size: 16px; margin-bottom: 20px;">
              After careful consideration, we have decided to move forward with other candidates whose experience more closely matches our current needs.
            </p>
            <p style="font-size: 16px; margin-bottom: 20px;">
              We encourage you to continue applying for positions that match your skills and experience. We wish you the best of luck in your job search.
            </p>
            <p style="font-size: 16px; margin-bottom: 5px;">Best regards,</p>
            <p style="font-size: 16px; margin: 0; color: #2557a7; font-weight: 500;">The Hiring Team</p>
          ` +
            footerStyle,
          text: `Hi ${name},\n\nThank you for applying. Unfortunately, your application for "${job}" was not selected. We wish you the best!\n\nBest regards,\nThe Hiring Team`,
        };

      case "ready for interview":
        return {
          subject: "🎯 Interview Opportunity!",
          html:
            baseStyle +
            `
            <div style="background-color: #cce5ff; border: 1px solid #99d6ff; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <h2 style="color: #0056b3; margin: 0 0 10px 0; font-size: 20px;">Interview Invitation</h2>
              <p style="margin: 0; color: #0056b3; font-weight: 500;">Next step in your application process</p>
            </div>
            <p style="font-size: 16px; margin-bottom: 15px;">Hi <strong>${name}</strong>,</p>
            <p style="font-size: 16px; margin-bottom: 20px;">
              Congratulations! You've been shortlisted for an interview for the position:
            </p>
            <div style="background-color: #f8f9fa; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
              <h3 style="margin: 0; color: #28a745; font-size: 18px;">${job}</h3>
            </div>
            <p style="font-size: 16px; margin-bottom: 20px;">
              We were impressed with your application and would like to learn more about your experience and qualifications.
            </p>
            <div style="background-color: #e7f3ff; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; font-size: 16px; color: #0056b3;">
                <strong>Next Steps:</strong> Our team will reach out to you within the next 2-3 business days to schedule your interview.
              </p>
            </div>
            <p style="font-size: 16px; margin-bottom: 5px;">Best regards,</p>
            <p style="font-size: 16px; margin: 0; color: #2557a7; font-weight: 500;">The Hiring Team</p>
          ` +
            footerStyle,
          text: `Hi ${name},\n\nYou've been shortlisted and are ready for the interview stage for the job: "${job}". We'll reach out to schedule it.\n\nBest regards,\nThe Hiring Team`,
        };

      default:
        return null; // Do nothing for pending
    }
  };

  const emailTemplate = getEmailTemplate(newStatus, applicantName, jobTitle);

  if (!emailTemplate) {
    return; // Do nothing for pending status
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: emailTemplate.subject,
    text: emailTemplate.text,
    html: emailTemplate.html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendStatusUpdateEmail;
