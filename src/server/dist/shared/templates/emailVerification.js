"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emailVerificationTemplate = (emailVerificationToken) => {
    const formattedCode = emailVerificationToken
        .toString()
        .split("")
        .map((digit) => `<span class="digit-box">${digit}</span>`)
        .join("");
    return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verify Your Email - EgWinch</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 30px auto;
                        background: #fff;
                        padding: 25px;
                        border-radius: 12px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                        text-align: center;
                    }
                    .header {
                        background: linear-gradient(135deg, #3d5a80, #283845);
                        color: white;
                        padding: 20px;
                        font-size: 26px;
                        font-weight: bold;
                        border-radius: 12px 12px 0 0;
                        letter-spacing: 1px;
                    }
                    .content {
                        padding: 20px;
                        font-size: 18px;
                        color: #333;
                        line-height: 1.6;
                    }
                    .code-container {
                        display: flex;
                        justify-content: center;
                        gap: 12px; /* Increased spacing */
                        margin: 25px 0;
                    }
                    .digit-box {
                        font-size: 22px;
                        font-weight: bold;
                        border: 2px solid #3d5a80;
                        color: #3d5a80;
                        padding: 10px;
                        display: inline-block;
                        border-radius: 8px;
                        width: 50px;
                        height: 50px;
                        line-height: 50px;
                        text-align: center;
                        background: white;
                        transition: all 0.3s ease;
                    }
                    .digit-box:hover {
                        background: #3d5a80;
                        color: white;
                    }
                    .footer {
                        font-size: 14px;
                        color: #777;
                        margin-top: 25px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        EgWinch
                    </div>
                    <div class="content">
                        <p>Welcome to <strong>EgWinch</strong>! To complete your registration, please use the verification code below.</p>
                        <div class="code-container">${formattedCode}</div>
                        <p>If you didn’t request this, you can safely ignore this email.</p>
                    </div>
                    <div class="footer">
                        &copy; ${new Date().getFullYear()} EgWinch. All rights reserved.
                    </div>
                </div>
            </body>
            </html>
          `;
};
exports.default = emailVerificationTemplate;
