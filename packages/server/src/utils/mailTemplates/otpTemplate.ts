// ---------------------------------------------------------------------------
// OTP email HTML template
// ---------------------------------------------------------------------------

export const generateOtpEmailTemplate = (otp: string, name: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify your email</title>
  <style>
    body { margin: 0; padding: 0; background: #f4f4f7; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; }
    .wrapper { max-width: 520px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,.08); }
    .header  { background: linear-gradient(135deg, #7c3aed, #4f46e5); padding: 36px 40px; text-align: center; }
    .header h1 { margin: 0; color: #fff; font-size: 24px; font-weight: 700; letter-spacing: -.5px; }
    .body    { padding: 36px 40px; }
    .body p  { margin: 0 0 16px; font-size: 15px; color: #374151; line-height: 1.6; }
    .otp-box { display: block; width: fit-content; margin: 28px auto; padding: 18px 40px;
               background: #f5f3ff; border: 2px dashed #7c3aed; border-radius: 10px;
               font-size: 34px; font-weight: 800; letter-spacing: 10px; color: #7c3aed; text-align: center; }
    .note    { margin-top: 24px; font-size: 13px; color: #9ca3af; text-align: center; }
    .footer  { background: #f9fafb; padding: 20px 40px; text-align: center; font-size: 12px; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header"><h1>Verify Your Email</h1></div>
    <div class="body">
      <p>Hi <strong>${name}</strong>,</p>
      <p>Use the verification code below to confirm your email address. It expires in <strong>10 minutes</strong>.</p>
      <span class="otp-box">${otp}</span>
      <p>If you didn't request this, you can safely ignore this email.</p>
      <p class="note">Do not share this code with anyone.</p>
    </div>
    <div class="footer">© ${new Date().getFullYear()} Portfolio — Sent with ❤️</div>
  </div>
</body>
</html>
`;
