// utils/statusUpdateMailer.js

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // your gmail
    pass: process.env.EMAIL_PASS, // your app password
  },
});

const sendStatusUpdateEmail = async ({ to, applicantName, jobTitle, newStatus }) => {
  let subject = "";
  let message = "";

  switch (newStatus) {
    case "finalist":
      subject = "🎉 You're a Finalist!";
      message = `Hi ${applicantName},\n\nGreat news! You’ve been selected as a finalist for the job: "${jobTitle}". Stay tuned for further updates.`;
      break;
    case "reject":
      subject = "Job Application Update";
      message = `Hi ${applicantName},\n\nThank you for applying. Unfortunately, your application for "${jobTitle}" was not selected. We wish you the best!`;
      break;
    case "ready for interview":
      subject = "Interview Opportunity!";
      message = `Hi ${applicantName},\n\nYou’ve been shortlisted and are ready for the interview stage for the job: "${jobTitle}". We’ll reach out to schedule it.`;
      break;
    default:
      return; // Do nothing for pending
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: message,
  };

  await transporter.sendMail(mailOptions);
};

export default sendStatusUpdateEmail;
