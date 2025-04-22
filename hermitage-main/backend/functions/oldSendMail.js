const transporter = require('../config/nodemailer');
require('dotenv').config();

/**
* @param {string} from
* @param {string} to
* @param {string} subject
* @param {object} data
* @returns {object} info
* @description This function sends an email to the user
*/
const sendMail = async (subject, data) =>{
    const options = {
        from: process.env.MAIL_USER,
        to: process.env.MAIL_DEFAULT,
        subject,
        html: `
        <html dir="rtl" lang="he">
        <div style="width: 100%; direction: rtl; text-align: right;">
        <h1>הזמנה חדשה</h1>
        <h2>סניף: ${data.branch.name} | עבור ספק: ${data.provider.name}</h2>
        <table style="border-collapse: collapse; width: 100%; direction: rtl; text-align: center;" border="1">
        <thead>
        <tr>
        <th style="width: 10%;">מק"ט</th>
        <th style="width: 10%;">שם</th>
        <th style="width: 10%;">כמות</th>
        <th style="width: 10%;">מחיר</th>
        <th style="width: 10%;">סה"כ</th>
        </tr>
        </thead>
        <tbody>
        ${data.productsOrder.map(product => {
            return `
            <tr>
            <td>${product.number}</td>
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${product.price}</td>
            <td>${product.totalPrice}</td>
            </tr>
            `
        })}
        </tbody>
        </table>
        </div>
        </html>
        `
    }

    try {
        const info = await transporter.sendMail(options);
        return info;
    } catch (error) {
        console.log(error);
        return error;
    }
}


const verify = async () => {
    try {
        const info = await transporter.verify();
        return info;
    } catch (error) {
        console.log(error);
        return error;
    }
}

module.exports = { sendMail, verify };