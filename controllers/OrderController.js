const Order = require('../models').Order;
const Payment = require('../models').Payment;
const Product = require('../models').Product;

const {
    validationResult
} = require("express-validator");
const order = require('../models/order');

async function viewOrder(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.formatter.badRequest(errors.mapped());
    }

    let result;
    if (!req.body.codeOrder) {
        //Kalau di body gk ada codeOrder
        //Cari semua order dari user yg login

        result = await Order.findAll({
            attributes: ['codeOrder', 'quantity', 'origin', 'destination', 'courierJne', 'costCourier']
        }, {
            where: {
                customerId: req.params.customerId
            }
        });
    } else {
        //Kalau di body ada codeOrder
        //Cari order itu saja

        result = await Order.findAll({
            attributes: ['codeOrder', 'quantity', 'origin', 'destination', 'courierJne', 'costCourier']
        }, {
            where: {
                codeOrder: req.body.codeOrder
            }
        });
    }
    return res.status(200).send({
        order: result
    });
}

async function payOrder(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.formatter.badRequest(errors.mapped());
    }

    let result;
    let {
        codeOrder
    } = req.body;
    // Ubah status di tabel payments untuk codeOrder

    await Payment.update({
        paymentStatus: 'paid'
    }, {
        where: {
            codeOrder: codeOrder
        }
    });

    //Ubah status di tabel order menjadi process

    await Order.update({
        statusOrder: 'process'
    }, {
        where: {
            codeOrder: codeOrder
        }
    });

    return res.status(200).send({
        message: `Pembayaran untuk pesanan dengan ID ${codeOrder} sudah diverifikasi. Pesanan customer sedang diproses`
    });
}

async function checkOut(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.formatter.badRequest(errors.mapped());
    }

    let result;
    let {
        codeOrder
    } = req.body;

    //Ubah status di tabel order menjadi process

    await Order.update({
        statusOrder: 'pending'
    }, {
        where: {
            codeOrder: codeOrder
        }
    });

    let orderNow = await Order.findOne({
        include: [{
            model: Product
        }],
        where: {
            codeOrder: codeOrder
        }
    });

    return res.status(200).send({
        message: `Orderan dengan kode ${req.body.codeOrder} sedang dalam proses checkout`,
        asal : orderNow.origin,
        tujuan : orderNow.destination,
        layanan : orderNow.courierJne,
        ongkos_kirim : orderNow.costCourier,
        statusOrder : orderNow.statusOrder,
        daftar_product: orderNow.Product.name,
        daftar_product2: "ceritanya daftar produk... nanti semua produk dibuat jadi 1 array"
    });
}

module.exports = {
    viewOrder,
    payOrder,
    checkOut
}