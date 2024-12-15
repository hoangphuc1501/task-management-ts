import nodemailer from "nodemailer";

export const sendMail = (email:string, subject:string, text:string) => {
    // Create a transporter object
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // use false for STARTTLS; true for SSL on port 465
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });
    // Configure the mailoptions object
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: text
    };
    // Send the email
    transporter.sendMail(mailOptions, function (error:any, info:any) {
        if (error) {
            console.log('Error:', error);
        } else {
            console.log('Email sent: ', info.response);
        }
    });
}

export const contactMail = (email:string, subject:string, text:string) => {
    // Create a transporter object
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // use false for STARTTLS; true for SSL on port 465
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });
    // Configure the mailoptions object
    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: subject,
        text: text
    };
    // Send the email
    transporter.sendMail(mailOptions, function (error:any, info:any) {
        if (error) {
            console.log('Error:', error);
        } else {
            console.log('Email sent: ', info.response);
        }
    });
}