// backend/config/mailConfig.js

const nodemailer = require('nodemailer');

// Crear el transporter de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Función para enviar correos
const sendMail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"SiegTrack Sistema" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log('Correo enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error al enviar correo:', error);
    return false;
  }
};

module.exports = { sendMail };