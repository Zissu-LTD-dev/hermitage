const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const puppeteer = require('puppeteer');

async function generatePDF(html, outputPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({ path: outputPath, format: 'A4' });
  await browser.close();
}

function generateEmailHtml(message) {
  const {
    orderNumber,
    userName,
    branchEDI,
    branchNumber,
    HP,
    companyName,
    branchName,
    branchAddress,
    branchCity,
    branchMail,
    branchPhone,
    providerName,
    orderLines,
    returnLines,
    totalOrderQty,
    totalOrderAmount,
    noteProvider,
  } = message;

  let orderHtml = "";
  if (orderLines.products.length > 0) {
    orderHtml += '<h3 style="color: #082a3a;" >הזמנות : </h3>';
    orderHtml += `
      <table style="width: 70%; margin-bottom: 20px;">
        <tr style="text-align: right;">
          <th>שם מוצר</th>
          <th>בר קוד</th>
          <th>כמות</th>
        </tr>
    `;
    orderLines.products.forEach((product) => {
      orderHtml += `
        <tr>
          <td>${product.name}</td>
          <td>${product.barcode}</td>
          <td>${product.quantity} יחידות</td>
        </tr>
      `;
    });
    orderHtml += `</table><p style="font-weight: bold;" >סה"כ מוצרים: ${orderLines.quantity} </p>`;
  } else {
    orderHtml +=
      '<h3 style="color: #082a3a;" >הזמנות</h3><p style="font-weight: bold;" >אין מוצרים להזמנה</p>';
  }

  let returnHtml = "";
  if (returnLines.products.length > 0) {
    returnHtml += '<h3 style="color: #082a3a;" >החזרות : </h3>';
    returnHtml += `
    <table style="width: 70%; margin-bottom: 20px;">
      <tr style="text-align: right;">
          <th>שם מוצר</th>
          <th>בר קוד</th>
          <th>כמות</th>
        </tr>
    `;
    returnLines.products.forEach((product) => {
      returnHtml += `
        <tr>
          <td>${product.name}</td>
          <td>${product.barcode}</td>
          <td>${product.quantity} יחידות</td>
        </tr>
      `;
    });
    returnHtml += `</table><p style="font-weight: bold;" >סה"כ מוצרים להחזרה: ${returnLines.quantity}</p>`;
  } else {
    returnHtml +=
      '<h3 style="color: #082a3a;" >החזרות</h3><p>אין מוצרים להחזרה</p>';
  }

  return `
    <html>
      <head>
        <style>
          h1, h3 {
            color: #082a3a;
          }
          ul {
            list-style-type: none;
            padding: 0;
          }
          li {
            margin-bottom: 10px;
          }
          p {
            font-weight: bold;
          }
        </style>
      </head>
      <body style="font-family: Arial, sans-serif; direction: rtl;">
        <h1 style="color: #082a3a;">פרטי הזמנה</h1>
        <p style="font-weight: bold;" >מספר הזמנה: ${orderNumber}</p>
        <p style="font-weight: bold;" >שם מבצע ההזמנה : ${userName}</p>
        <p style="font-weight: bold;" >פרטי סניף : </p>  
        <ul style="padding: 0 20px;">
          <li><span><b>EDI: </b></span> <span style="display: inline-block; direction: ltr; unicode-bidi: embed;">${branchEDI ? branchEDI : 'לא קיים'}</span></li>
          <li><b>מספר סניף: </b> ${branchNumber}</li>
          <li><b>שם סניף: </b> ${branchName}</li>
          <li><b>ח.פ: </b> ${HP ? HP : 'לא קיים'}</li>
          <li><b>שם חברה: </b> ${companyName ? companyName : 'לא קיים'}</li>
          <li><b>כתובת: </b> ${branchAddress ? branchAddress : 'לא קיימת' } ${branchCity ? ', ' + branchCity : ''}</li>
          <li><b>מייל: </b> <span style="display: inline-block; direction: ltr; unicode-bidi: embed;">${branchMail ? branchMail : 'לא קיים'}</span></li>
          <li><b>טלפון: </b> ${branchPhone ? branchPhone : 'לא קיים'}</li> 
        </ul>
        <p style="font-weight: bold;" >עבור ספק: ${providerName}</p>
        <hr>
        ${orderHtml}
        <hr>
        ${returnHtml}
        <hr>
        ${ noteProvider ?  '<h3>הערה :</h3><p>' + noteProvider + '</p>' : '' }
      </body>
    </html>
  `;
}

const weezmoMail = async (data) => {
  let { target, message, subjectLine, senderName } = data;
  const emailHtml = generateEmailHtml(message);

  // Ensure 'uploads' directory exists
  const uploadsDir = path.join(__dirname, 'orders');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  // Generate PDF
  const pdfPath = path.join(uploadsDir, `order_${message.orderNumber}.pdf`);
  await generatePDF(emailHtml, pdfPath);

  // Create FormData and append fields
  const form = new FormData();
  form.append('Target', target);
  form.append('Message', emailHtml);
  form.append('SubjectLine', subjectLine);
  form.append('SenderName', senderName);
  form.append('AttachedFiles', fs.createReadStream(pdfPath));

  // Set up the request configuration
  const config = {
    method: 'post',
    url: 'https://api-core.weezmo.com/v3/External/SendEmailWithAttachments',
    headers: {
      'accept': 'application/json',
      'XApiKey': `${process.env.WEEZMO_KEY}`
    },
    data: form
  };

  try {
    const response = await axios(config);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    // Clean up: remove the temporary PDF file
    // fs.unlinkSync(pdfPath);
    console.log('PDF generated at:', pdfPath);
    
  }
};

module.exports = weezmoMail;
