import nodemailer from "nodemailer"

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (name, email, subject, html) => {
  const info = await transport.sendMail({
    from: process.env.EMAIL_SENDER, // sender address
    to: `"${name}" <${email}>`, // list of receivers
    subject, // Subject line
    html // html body
  });
  return info
}

export { sendEmail }