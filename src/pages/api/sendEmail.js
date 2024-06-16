// pages/api/sendEmail.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method === 'POST') {
    const { to, subject, text, html } = req.body;

    // SMTP認証情報を設定
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;

    const transporter = nodemailer.createTransport({
        host: 'email-smtp.ap-northeast-3.amazonaws.com',
        port: 587,
        secure: false,
        auth: {
        user: smtpUser,
        pass: smtpPassword,
        },
    });

    const mailOptions = {
        from: 'your-email@example.com',
        to: to,
        subject: subject,
        text: text,
        html: html,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email: ', error);
      res.status(500).json({ error: 'Error sending email' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
