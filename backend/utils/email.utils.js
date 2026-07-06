import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTP = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "ChatLoop <onboarding@resend.dev>",
      to: email,
      subject: "ChatLoop Password Reset OTP",
      html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #e5e7eb;border-radius:10px">

        <h2 style="color:#c026d3;text-align:center">
          ChatLoop Password Reset
        </h2>

        <p>Hello,</p>

        <p>Your One-Time Password (OTP) is:</p>

        <div style="text-align:center;margin:30px 0">
          <span
            style="
              font-size:32px;
              font-weight:bold;
              letter-spacing:6px;
              color:#4c1d95;
              background:#f3e8ff;
              padding:15px 30px;
              border-radius:8px;
              display:inline-block;
            "
          >
            ${otp}
          </span>
        </div>

        <p>This OTP is valid for <b>10 minutes</b>.</p>

        <p>Do not share this OTP with anyone.</p>

        <hr>

        <p style="font-size:13px;color:gray">
          If you didn't request this, ignore this email.
        </p>

      </div>
      `,
    });

    if (error) {
      console.log(error);
      return false;
    }

    console.log("Email Sent Successfully");
    console.log(data);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};