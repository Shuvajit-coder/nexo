import nodemailer from "nodemailer"
import dotenv from 'dotenv'
dotenv.config()

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});
const sendMail = async(to,otp)=>{
 try {
  const info = await transporter.sendMail({
    from: `${process.env.EMAIL}`, // sender address
    to, // list of recipients
    subject: "Reset Your Password", // subject line
    html: `<p>Your OTP for password reset is <b>${otp}</b>.
    It expires in 5 minutes.</p>`, // HTML body
  });
//   console.log(process.env.EMAIL)
// console.log(process.env.EMAIL_PASS)

} catch (err) {
  console.error("Error while sending mail:", err);
}
}

export default sendMail