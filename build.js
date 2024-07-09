const fs = require('fs');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

let htmlContent = fs.readFileSync('index.template.html', 'utf8');
htmlContent = htmlContent.replace('CLIENT_ID_PLACEHOLDER', clientId);
htmlContent = htmlContent.replace('CLIENT_SECRET_PLACEHOLDER', clientSecret);

fs.writeFileSync('index.html', htmlContent, 'utf8');
console.log('Build completed');
