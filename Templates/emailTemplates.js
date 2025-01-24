const emailTemplate = (url) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #000000; /* Pure black background */
                color: #ffffff;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: auto;
                background: black; /* Ensure container also has pure black */
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
                position: relative;
            }
            h2 {
                color: #4CAF50;
            }
            .btn {
                display: inline-block;
                padding: 10px 20px;
                margin: 20px 0;
                color: white;
                background-color: #4CAF50;
                border-radius: 5px;
                text-decoration: none;
            }
            .footer {
                margin-top: 20px;
                font-size: 0.9em;
                color: #aaaaaa;
            }
            .logo {
                text-align: center;
                margin-bottom: 20px;
            }
            .logo img {
                max-width: 150px;
            }
        </style>
    </head>
    <body>
        <div class="container">
           

            <h1>CAREER DEVELOPMENT CENTER</h1>
            <h2>Password Reset Request from CDC </h2>
            <p>You requested a password reset. Click the button below to reset your password:</p>
            <a href="${url}" class="btn">Reset Password</a>
            <p>If you did not request this, please ignore this email.</p>
            <div class="footer">
                <p>Thank you,</p>
                <p>Team Nexier</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = emailTemplate;
