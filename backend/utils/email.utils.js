import nodemailer from 'nodemailer';

export const sendOTP = async (email, otp) => {
    try {
        // Create a transporter using SMTP
        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can change this to your preferred email service
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Setup email data
        const mailOptions = {
            from: `"ChatLoop Support" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Your Password Reset OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    <h2 style="color: #c026d3; text-align: center;">ChatLoop Password Reset</h2>
                    <p style="font-size: 16px; color: #333;">Hello,</p>
                    <p style="font-size: 16px; color: #333;">We received a request to reset the password for your ChatLoop account. Your One-Time Password (OTP) is:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4c1d95; background-color: #f3e8ff; padding: 15px 25px; border-radius: 8px;">${otp}</span>
                    </div>
                    <p style="font-size: 16px; color: #333;">This code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
                    <p style="font-size: 14px; color: #64748b; margin-top: 30px;">If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
                </div>
            `,
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};
