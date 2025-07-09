import transporter from "../config/nodemailer.js";

export const sendJobApplicationEmail = async ({
  to,
  jobTitle,
  applicantName,
  applicantEmail,
  applicantPhone,
  resumeLink,
}) => {
  const safeName = applicantName || "Not available";
  const safePhone = applicantPhone || "Not provided";
  const safeEmail = applicantEmail || "Not provided";

  const resumeHtml = resumeLink
    ? `<a href="${resumeLink}" target="_blank" style="color: #2557a7; text-decoration: none;">View Resume</a>`
    : "Not uploaded";

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `📩 New Application for "${jobTitle}"`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e4e4e4; border-radius: 8px; max-width: 600px; margin: auto;">
        <h2 style="color: #2557a7;">New Job Application Received</h2>
        <p><strong>Job Title:</strong> ${jobTitle}</p>
        <p><strong>Applicant Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Phone:</strong> ${safePhone}</p>
        <p><strong>Resume:</strong> ${resumeHtml}</p>

        <hr style="margin: 20px 0;" />
        <p style="font-size: 12px; color: gray;">
          This is an automated message from <strong>Indeed Clone</strong>.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
