// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//     host:'smtp.gmail.com',
//     port: 587, 
//     secure: false,
//     auth: {
//       user: 'sulaymanibrahim64@gmail.com',
//       pass:  'tluqjesysbhyzomb'//'rpmuyugfowiisvny',
//     },
// });

// const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587, // or 465 for secure
//     secure: false, // true for 465, false for other ports
//     auth: {
//         user: process.env.EMAIL_USER, // your email
//         pass: process.env.EMAIL_PASS, // your email password or app password
//     },
// });

// const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false,
//     auth: {
//         user: 'brobotdevfsdc124@gmail.com',
//         pass: 'rpmuyugfowiisvny',  // Make sure this is an App Password
//     },
//     greetingTimeout: 10000,  // Optional timeout setting
// });

// export const sendEmail = async (to: string, subject: string, text: string) => {
//     const mailOptions = {
//         from: "brobotdevfsdc124@gmail.com",
//         to,
//         subject,
//         text,
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         return { success: true };
//     } catch (error: any) {
//         console.error('Error sending email:', error);
//         throw new Error('Email could not be sent');
//     }
// };

// @ts-ignore
import mailchimp from '@mailchimp/mailchimp_transactional'

const mailchimpClient = mailchimp(process.env.MAILCHIMP_API_KEY || 'f030ddf88ff75fe7f8281b774e5b38c7-us17');

export const sendEmail = async (to: string, subject: string, text: string) => {
  const message = {
    from_email: 'brobotdevfsdc124@gmail.com',
    subject,
    text,
    to: [
      {
        email: to,
        type: 'to',
      },
    ],
  };

  try {
    const response = await mailchimpClient.messages.send({ message });
    console.log('Mailchimp email sent successfully:', response);
    return { success: true };
  } catch (error: any) {
    console.error('Error sending email via Mailchimp:', error);
    throw new Error('Email could not be sent');
  }
};

