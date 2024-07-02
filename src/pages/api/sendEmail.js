// pages/api/sendEmail.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { to, subject, text, html } = req.body;

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.AWS_SES_HOST,
        port: 587,
        auth: {
          user: process.env.AWS_SES_USER,
          pass: process.env.AWS_SES_PASS,
        },
      });

      const mailOptions = {
        from: 'noreply@yu-cco.com',//process.env.AWS_SES_FROM_EMAIL,
        to:'recipient@yu-cco.com',
        subject,
        text,
        html,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
