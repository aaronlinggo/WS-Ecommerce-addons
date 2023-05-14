const fs = require("fs");
const PDFDocument = require("pdfkit");
const Customer = require("../models").Customer;
const Order = require("../models").Order;
const OrderDetail = require("../models").OrderDetail;
const Product = require("../models").Product;
const formatRupiah = require("../helpers/formatRupiah");
const jwt = require('jsonwebtoken');
require("dotenv").config();
const {
    sequelize
} = require('../models');

const exportInvoice = async (req, res) => {
    var token = req.header("x-auth-token");
    cust = jwt.verify(token, process.env.JWT_KEY);
    let order = await Order.findOne({
        attributes: [
            'customerId',
            'codeOrder',
            'origin',
            'destination',
            'address',
            'courierJne',
            'costCourier',
            'statusOrder',
            'subtotal',
            [sequelize.fn('date', sequelize.col('`Order`.`createdAt`')), 'createdAt']
        ],
        include: [{
            model: OrderDetail,
            attributes: [
                'quantity'
            ],
            include: [{
                model: Product,
                attributes: [
                    'name',
                    'price'
                ],
            }]
        },{
            model: Customer,
            attributes: [
                'firstName', 'lastName'
            ],
        },
        ],
        where: {
            codeOrder: "OR00001",
            customerId: cust.id
        }, 
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=INVOICE-${order.codeOrder}.pdf`);

    try {
        let doc = new PDFDocument({ size: "A4", margin: 50 });
    
        generateHeader(doc);
        generateCustomerInformation(doc, order);
        generateInvoiceTable(doc, order);
        generateFooter(doc);

        doc.pipe(res);
        doc.end();
    } catch (err) {
        console.log(err);
        return res.send({
            status: "error",
            message: "Something went wrong",
        });
    }
}

function generateHeader(doc) {
    doc
        .image("./assets/logo.png", 50, 45, { width: 50 })
        .fillColor("#444444")
        .fontSize(20)
        .fontSize(10)
        .text("ADDONSTORE", 200, 50, { align: "right" })
        .text("ISTTS", 200, 65, { align: "right" })
        .moveDown();
}

function generateCustomerInformation(doc, invoice) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("Invoice", 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
        .fontSize(10)
        .text("Invoice Number:", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(invoice.codeOrder, 150, customerInformationTop)
        .font("Helvetica")
        .text("Invoice Date:", 50, customerInformationTop + 15)
        .text(invoice.createdAt, 150, customerInformationTop + 15)
        .text("Balance Due:", 50, customerInformationTop + 30)
        .text(
            formatRupiah(invoice.subtotal + invoice.costCourier),
            150,
            customerInformationTop + 30
        )

        .font("Helvetica-Bold")
        .text(invoice.Customer.firstName + ' ' + invoice.Customer.lastName, 300, customerInformationTop)
        .font("Helvetica")
        .text(invoice.address, 300, customerInformationTop + 15)
        .moveDown();

    generateHr(doc, 252);
}

function generateInvoiceTable(doc, invoice) {
    let i;
    const invoiceTableTop = 330;

    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        invoiceTableTop,
        "Item",
        "Unit Cost",
        "Quantity",
        "Line Total"
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");

    for (i = 0; i < invoice.OrderDetails.length; i++) {
        const item = invoice.OrderDetails[i];
        const position = invoiceTableTop + (i + 1) * 30;
        generateTableRow(
            doc,
            position,
            item.Product.name,
            formatRupiah(item.Product.price),
            item.quantity,
            formatRupiah(item.quantity * item.Product.price)
        );

        generateHr(doc, position + 20);
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
        doc,
        subtotalPosition,
        "",
        "Subtotal",
        "",
        formatRupiah(invoice.subtotal)
    );

    const costCourierPosition = subtotalPosition + 20;
    generateTableRow(
        doc,
        costCourierPosition,
        "",
        "Cost Courier",
        "",
        formatRupiah(invoice.costCourier)
    );

    const duePosition = costCourierPosition + 25;
    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        duePosition,
        "",
        "Balance Due",
        "",
        formatRupiah(invoice.subtotal + invoice.costCourier)
    );
    doc.font("Helvetica");
}

function generateFooter(doc) {
    doc
        .fontSize(10)
        .text(
            "Thank you for your business.",
            50,
            780,
            { align: "center", width: 500 }
        );
}

function generateTableRow(
    doc,
    y,
    item,
    unitCost,
    quantity,
    lineTotal
) {
    doc
        .fontSize(10)
        .text(item, 50, y)
        .text(unitCost, 280, y, { width: 90, align: "right" })
        .text(quantity, 370, y, { width: 90, align: "right" })
        .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + "/" + month + "/" + day;
}

module.exports = {
    exportInvoice
};