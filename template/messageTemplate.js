// Message Template Function
const messageTemplate = (title, content) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                background-color: #f8f9fa;
                color: #333;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background: #fff;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background-color: #007bff;
                color: #fff;
                padding: 20px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
            }
            .content {
                padding: 20px;
            }
            .content h2 {
                color: #007bff;
                margin-bottom: 10px;
            }
            .content p {
                margin-bottom: 15px;
            }
            .footer {
                background-color: #f1f1f1;
                color: #666;
                text-align: center;
                padding: 10px;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Career Development Center</h1>
            </div>
            <div class="content">
                <h2>${title}</h2>
                <p>${content}</p>
                <p>For more details, feel free to contact us at <a href="mailto:cdc@example.com">cdc@example.com</a>.</p>
            </div>
            <div class="footer">
                <p>Career Development Center, Your University</p>
                <p>&copy; ${new Date().getFullYear()} Career Development Center. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = messageTemplate;
