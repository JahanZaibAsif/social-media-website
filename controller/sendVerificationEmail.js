const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const secretKey = process.env.JWT_SECRET || 'default_secret_key';
const sendVerificationEmail = (first_name,email, verificationToken,userId) => {
  const token = jwt.sign({ verificationToken }, secretKey, { expiresIn: '1d' });
  const verificationLink = `http://localhost:4000/verify/?id=${userId}`;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'jahanzaibasif969@gmail.com',
      pass: 'jghi tent lwnq jzmc',
    },
  });

  // Define the email content
  const mailOptions = {
    from: 'jahanzaibasif969@gmail.com',
    to: email,
    subject: 'Email Verification',
    html: `<p> Hi ${first_name} to verify your email:</p><a href="${verificationLink}">verify</a>`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = sendVerificationEmail;
