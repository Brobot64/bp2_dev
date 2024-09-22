import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port: 587, 
    secure: false,
    auth: {
      user: 'brobotdevfsdc124@gmail.com',
      pass:  'rpmuyugfowiisvny',
    },
});

// const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587, // or 465 for secure
//     secure: false, // true for 465, false for other ports
//     auth: {
//         user: process.env.EMAIL_USER, // your email
//         pass: process.env.EMAIL_PASS, // your email password or app password
//     },
// });


export const sendEmail = async (to: string, subject: string, text: string) => {
    const mailOptions = {
        from: "brobotdevfsdc124@gmail.com",
        to,
        subject,
        text,
    }

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error: any) {
        console.error('Error sending email:', error);
        throw new Error('Email could not be sent');
    }
}
