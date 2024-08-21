// process.env.WEEZMO_KEY
const sdk = require("@api/weezmo");
sdk.auth(process.env.WEEZMO_KEY);

function generateEmailHtml(message) {
  const {
    orderNumber,
    userName,
    branchEDI,
    branchNumber,
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
          <li><span><b>EDI: </b></span> ${branchEDI}</li>
          <li><b>מספר סניף: </b> ${branchNumber}</li>
          <li><b>שם סניף: </b> ${branchName}</li>
          <li><b>כתובת: </b> ${branchAddress} ${branchCity}</li>
          <li><b>מייל: </b> ${branchMail}</li>
          <li><b>טלפון: </b> ${branchPhone}</li>
        </ul>
        <p style="font-weight: bold;" >עבור ספק: ${providerName}</p>
        <hr>
        ${orderHtml}
        <hr>
        ${returnHtml}
      </body>
    </html>
  `;
}

const weezmoMail = async (data) => {
  let { target, message, subjectLine, senderName } = data;
  const emailHtml = generateEmailHtml(message);

  try {
    return sdk
      .postV3ExternalSendemail({
        Target: target,
        Message: emailHtml,
        SubjectLine: subjectLine,
        SenderName: senderName,
      })
      .then(({ data }) => {
        console.log(data);
        return data;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = weezmoMail;
