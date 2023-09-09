// domain.com/verifytoken/afasfsda // Better for SSR
// domain.com/verifytoken?token=adadsa // Better for CSR

import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';

export const sendEmail = async({email, emailType, userId}: any) => {
    try {
        // create a hashed token
        const hashedToken = await bcryptjs.hash(userId.toString(),10)

        if(emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId,
                {verifyToken: hashedToken,
                verifyTokenExpiry: Date.now()+ 3600000})
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId,
                {forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now()+ 3600000})
        }

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "c9b368e4533a94",
              pass: "c67762d672a355"
              //TODO add these credentials to env file
            }
          });

          const mailOptions = {
            from: 'rajinish77@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.domain}/
            verifyemail?token=${hashedToken}">here<a/> to ${emailType === "VERIFY" ? "verify your email" :"reset your password"}
            or copy and paste the link below in your browser.
            <br> ${process.env.domain}/verifyemail?token=${hashedToken}
            </p>`
   
        }

        const mailresponse = await transport.sendMail(
            mailOptions);
            return mailresponse;
    }
    // We don't know the type of the error so we are simply annotating it as any 
    catch (error:any) {
        throw new Error(error.message);
    }
}
