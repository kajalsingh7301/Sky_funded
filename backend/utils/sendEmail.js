const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or use 'smtp.ethereal.email' or your provider
      auth: {
        user: 'yourgmail@gmail.com', // replace with your email
        pass: 'your-app-password',   // replace with app password (not regular password)
      },
    });

    const mailOptions = {
      from: '"SkyFunded" <yourgmail@gmail.com>',
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully to", to);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;
