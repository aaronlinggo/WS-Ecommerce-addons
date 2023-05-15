const {
    Op
} = require('sequelize');
const {
    sequelize
} = require('../models');
const Customer = require('../models').Customer;
const Developer = require('../models').Developer;
const Order = require('../models').Order;
const excelJS = require("exceljs");
const jwt = require('jsonwebtoken');
require("dotenv").config();

const ExportOrder = async (req, res) => {
    var token = req.header("x-auth-token");
    dev = jwt.verify(token, process.env.JWT_KEY);

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("My Order")
    
    worksheet.columns = [
        { header: "Code Order", key: "codeOrder", width: 15 },
        { header: "Customer", key: "customer", width: 20 },
        { header: "Courier", key: "courier", width: 10 },
        { header: "Address", key: "address", width: 30 },
        { header: "Weight", key: "weight", width: 10 },
        { header: "Cost Courier", key: "costCourier", width: 15 },
        { header: "Subtotal", key: "subtotal", width: 10 },
        { header: "Order Date", key: "createdAt", width: 20 },
        { header: "Status Order", key: "statusOrder", width: 15 },
    ];
    
    let orders = await Order.findAll({
        attributes: ["codeOrder", "courierJne", "address", "weight", "costCourier", "subtotal", [sequelize.fn('DATE_FORMAT', sequelize.col('`Order`.`createdAt`'), "%d-%m-%Y %H:%i:%s"), 'orderDate'], "statusOrder"],
        include: [{
            model: Customer,
            attributes: ["id", "firstName", "lastName", "developerId"]
        }],
        where: {
            '$developerId$': dev.id
        },
    });

    orders.forEach((o) => {
        let new_row = {
            codeOrder: o.codeOrder,
            customer: o.Customer.firstName + ' ' + o.Customer.lastName,
            courier: "JNE" + " - " + o.courierJne,
            address: o.address,
            weight: o.weight.toString(),
            costCourier: o.costCourier,
            subtotal: o.subtotal,
            createdAt: o.dataValues.orderDate,
            statusOrder: o.statusOrder,
        }
        worksheet.addRow(new_row);
    });

    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
    });
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "orders.xlsx"
    );
    res.setHeader('Content-Length', '1111');
    try {
        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
          });
        // const data = await workbook.xlsx.writeFile(`${path}/orders.xlsx`)
        //     .then(() => {
        //         return res.send({
        //             status: "success",
        //             message: "file successfully downloaded",
        //             path: `${path}/orders.xlsx`,
        //         });
        //     });
    } catch (err) {
        res.send({
            status: "error",
            message: "Something went wrong",
        });
    }
};

module.exports = { ExportOrder };