"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passwordResetTemplate = (resetUrl) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            text-align: center;
            padding: 20px;
        }
        .container {
            max-width: 500px;
            background: white;
            padding: 20px;
            margin: 20px auto;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .button {
            background-color: #007bff;
            color: white;
            padding: 15px 25px;
            text-decoration: none;
            font-size: 16px;
            font-weight: bold;
            border-radius: 5px;
            display: inline-block;
            margin-top: 20px;
        }
        .button:hover {
            background-color: #0056b3;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Password Reset Request</h2>
        <p>Click the button below to reset your password.</p>
        <a href="${resetUrl}" class="button">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
        <p class="footer">Egwinch Team</p>
    </div>
</body>
</html>
`;
exports.default = passwordResetTemplate;
