export function generateOtpEmailTemplate(companyName: string, otp: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${companyName} - Verify Your Email</title>

        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Montserrat', sans-serif;
                line-height: 1.6;
                color: #2c1810;
            }

            body {
                background-color: #faf5f2;
                padding: 20px;
            }

            .container {
                max-width: 600px;
                margin: 30px auto;
                background: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 8px 24px rgba(22, 101, 52, 0.1);
                border: 1px solid #f0e6e0;
            }

            .header {
                background: linear-gradient(135deg, #166534 0%, #15803d 100%);
                padding: 40px 20px;
                text-align: center;
                color: white;

                position: relative;
                overflow: hidden;
            }

            .header::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 8px;
                background: linear-gradient(90deg, #15803d, #166534);
            }

            .header img {
                max-width: 180px;
                width: 100%;
                height: auto;
            }

            .header p {
                font-size: 14px;
                opacity: 0.9;
                font-weight: 300;
                letter-spacing: 0.5px;
            }

            .content {
                padding: 40px;
                background: #fff;
            }

            .message-box {
                background: #fefcfb;
                border-left: 4px solid #15803d;
                border-radius: 6px;
                padding: 25px;
                margin: 30px 0;
                line-height: 1.7;
                color: #2c1810;
                box-shadow: 0 2px 8px rgba(22, 101, 52, 0.05);
                text-align: center;
            }

            .otp-box {
                margin: 20px 0;
                padding: 16px 24px;
                border-radius: 12px;
                background-color: #ecfdf3;
                border: 1px solid #bbf7d0;
                display: inline-block;
                font-size: 28px;
                font-weight: 700;
                letter-spacing: 6px;
                color: #166534;
            }

            .signature {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #f0e6e0;
                text-align: right;
            }

            .company-name {
                font-family: 'Playfair Display', serif;
                font-weight: 600;
                color: #166534;
                font-size: 18px;
                margin-top: 5px;
            }

            .footer {
                text-align: center;
                padding: 25px 20px;
                font-size: 13px;
                color: #8c8c8c;
                background-color: #faf5f2;
                border-top: 1px solid #f0e6e0;
            }

            .copyright {
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px solid #f0e6e0;
                color: #8c8c8c;
                font-size: 12px;
            }

            @media (max-width: 640px) {
                body {
                    padding: 10px;
                }

                .container {
                    margin: 15px auto;
                    border-radius: 12px;
                }

                .header {
                    padding: 30px 15px;
                }

                .header img {
                    max-width: 120px;
                }

                .content {
                    padding: 25px 20px;
                }

                .message-box {
                    padding: 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://res.cloudinary.com/dlpetmfks/image/upload/v1763571880/earnly_yqxotp.png" alt="${companyName} logo" />
                <p>Email Verification Code</p>
            </div>

            <div class="content">
                <div class="message-box">
                    <p>Use the one-time password (OTP) below to verify your email address for <strong>${companyName}</strong>.</p>
                    <div class="otp-box">${otp}</div>
                    <p>This code will expire shortly. If you did not request this code, you can safely ignore this email.</p>
                </div>

                <div class="signature">
                    <div>Warm regards,</div>
                    <div class="company-name">The ${companyName} Team</div>
                </div>
            </div>

            <div class="footer">
                <p>If you did not request this email, please ignore it.</p>
                <p class="copyright">&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
            </div>
        </div>

    </body>
    </html>
  `;
}