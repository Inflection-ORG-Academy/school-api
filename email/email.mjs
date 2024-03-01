import nodemailer from "nodemailer"

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "73ed0a088f23ea",
    pass: "ec0e81fdd1213b"
  }
});

const sendEmail = async (name, email, subject, html) => {
  const info = await transport.sendMail({
    from: '"Vidyalaya" <admin@school.com>', // sender address
    to: `"${name}" <${email}>`, // list of receivers
    subject, // Subject line
    html // html body
  });
  return info
}

export { sendEmail }