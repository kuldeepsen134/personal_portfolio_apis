const { default: mongoose } = require('mongoose');
const nodemailer = require('nodemailer');
const { SMPT_EMAIL_HOST, SMPT_EMAIL_PORT, SMPT_EMAIL_USER, SMPT_EMAIL_PASSWORD, SMPT_EMAIL_FROM, FRONTEND_URL } = require('../config/config');


exports.handleResponse = (res, data, message, status = 200,) => res.status(status).send({ ...data, message, error: false });

exports.handleError = (error, status = 400, res,) => {
    if (error.details) {
        const data = {};
        error?.details.forEach(v => {
            data[v.context?.key] = [v.message.replace(/"/g, '')];
        });

        return res.status(status).send({ error: true, message: data, });
    }

    return res.status(status).send({
        error: true,
        message: error.message ? error.message : error,
    })
};

exports.getPagination = async (query, fetchedData, totalCount) => {
    const { page = 1, limit = 10, sort = 1, } = query;

    let paginatedData;
    let totalItems;

    if (Array.isArray(fetchedData)) {
        paginatedData = fetchedData.slice((page - 1) * limit, page * limit);
        totalItems = fetchedData.length;

    } else if (fetchedData instanceof mongoose.Query) {
        paginatedData = await fetchedData
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -sort })
            .exec();
        totalItems = await fetchedData.countDocuments();

    } else {
        throw new Error("Unsupported data type for pagination");
    }

    const paginationInfo = {
        data: paginatedData,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        totalItems: totalItems
    };

    return paginationInfo;
};

exports.sendMailer = async (email, subject, message, res) => {

    const transporter = nodemailer.createTransport({
        host: `${SMPT_EMAIL_HOST}`,
        port: `${SMPT_EMAIL_PORT}`,
        auth: {
            user: `${SMPT_EMAIL_USER}`,
            pass: `${SMPT_EMAIL_PASSWORD}`
        },
        secure: false
    })

    const data = {
        from: `${SMPT_EMAIL_FROM}`,
        to: `${email}`,
        subject: `${subject} - College`,
        html: `${message}`,
    }

    transporter.sendMail(data, (error, info) => {
        if (error) {
            console.log('error>>>>>>', error);
            res.status(error.responseCode).send(error)
        }
    })

    return
};

exports.createUUID = () => {
    var dt = new Date().getTime()
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0
        dt = Math.floor(dt / 16)
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })

    return uuid
};



exports.generateResetPasswordEmail = (token) => {

    return `<div style="margin:auto width:70%">
                <div style="font-family: Helvetica,Arial,sans-serifmin-width:1000pxoverflow:autoline-height:2">
                <div style="margin:50px autowidth:60%padding:20px 0">
                <p style="font-size:25px">Hello,</p>
                <p>Use the code below to recover access to your College account.</p>
                <div style="border-bottom:1px solid #eee">
                <a href=${FRONTEND_URL}/reset-password?token=${token} style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Click the link and reset your password</a>
                </div>
                <p>The recovery code is only valid for 24 hours after it’s generated. If your code has already expired, you can restart the recovery process and generate a new code.
                If you haven't initiated an account recovery or password reset in the last 24 hours, ignore this message.</p>
                <p style="font-size:0.9em">Best Regards,<br />College</p>
                </div>
                </div>
            </div>`;
}



exports.sendNotification = (subscription, payload) => {
    webpush.sendNotification(subscription, payload).catch(err => console.error(err));
};

// const PDFDocument = require('pdfkit');
// const fs = require('fs');
// const path = require('path'); // Import the path module



// exports.generateInvoice = () => {
//     // Create a new PDF document
//     const doc = new PDFDocument();

//     // File path to save the generated PDF
//     const filePath = path.join(__dirname, "../invoices", 'example.pdf');

//     // Pipe the PDF document to a write stream
//     doc.pipe(fs.createWriteStream(filePath));

//     // Add content to the PDF
//     doc
//         .fontSize(27)
//         .text('Invoice', { align: 'center' })
//         .moveDown(); // Move down one line

//     // Add invoice details
//     doc
//         .fontSize(12)
//         .text('Invoice Date: January 1, 2024', 50, 120)
//         .text('Invoice Number: #123456789', 50, 140)
//         .moveDown(); // Move down one line

//     // Add customer information
//     doc
//         .fontSize(14)
//         .text('Customer Information:', 50, 180)
//         .fontSize(12)
//         .text('Name: John Doe', 50, 200)
//         .text('Email: john@example.com', 50, 220)
//         .moveDown(); // Move down one line

//     // Add order details
//     doc
//         .fontSize(14)
//         .text('Order Details:', 50, 260)
//         .fontSize(12)
//         .text('Product 1: $50', 50, 280)
//         .text('Product 2: $30', 50, 300)
//         .moveDown(); // Move down one line

//     // Add total amount
//     doc
//         .fontSize(16)
//         .text('Total Amount: $80', 50, 340);

//     // Finalize PDF file
//     doc.end();
// }


// exports.downloadInvoice = (orders) => {
//     // Create a new PDF document
//     const doc = new PDFDocument();

//     // File path to save the generated PDF
//     const filePath = path.join(__dirname, "../invoices", 'example.pdf');

//     // Pipe the PDF document to a write stream
//     doc.pipe(fs.createWriteStream(filePath));

//     // Add content to the PDF
//     doc
//         .fontSize(27)
//         .text('Invoice', { align: 'center' })
//         .moveDown(); // Move down one line

//     // Add invoice details
//     doc
//         .fontSize(12)
//         .text(`Invoice Date: ${orders.createdAt}`, 50, 120)
//         .text('Invoice Number: #123456789', 50, 140)
//         .moveDown(); // Move down one line

//     // Add customer information
//     doc
//         .fontSize(14)
//         .text('Customer Information:', 50, 180)
//         .fontSize(12)
//         .text('Name: John Doe', 50, 200)
//         .text('Email: john@example.com', 50, 220)
//         .moveDown(); // Move down one line

//     // Add order details

//     orders?.products?.map((item) => {
//         doc
//             .fontSize(14)
//             .text('Order Details:', 50, 260)
//             .fontSize(12)
//             .text(`Product 1: ${item.price}`, 50, 280)
//             .moveDown(); // Move down one line
//     })



//     // Add total amount
//     doc
//         .fontSize(16)
//         .text('Total Amount: $80', 50, 340);

//     // Finalize PDF file
//     doc.end();
// }