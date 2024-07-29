import { createTransport } from 'nodemailer';

export const sendEmail = async (receiver: string, subject: string, text: string) => {
    var transporter = createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
        }
    });
    
    var mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: receiver,
        subject: subject,
        text: text
    };
    let success = false;
    await transporter.sendMail(mailOptions).then(() => {
        success = true;
    }).catch((err) => {
        console.log(err);
        success = false;
    });
    return success;
}