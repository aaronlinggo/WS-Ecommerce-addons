const Order = require('../models').Order;
const OrderDetail = require('../models').OrderDetail;
const Payment = require('../models').Payment;
const Product = require('../models').Product;
const Cart = require('../models').Cart;
const axios = require("axios").default;
require("dotenv").config();
const formatRupiah = require('../helpers/formatRupiah');

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
            attributes: [['codeOrder', 'Code Order'], ['origin', 'Asal'], ['destination', 'Tujuan'], ['courierJne', 'Layanan'], ['costCourier', 'Ongkos Kirim']]
        }, {
            where: {
                customerId: req.params.customerId
            }
        });
    } else {
        //Kalau di body ada codeOrder
        //Cari order itu saja

        result = await Order.findAll({
            attributes: [['codeOrder', 'Code Order'], ['origin', 'Asal'], ['destination', 'Tujuan'], ['courierJne', 'Layanan'], ['costCourier', 'Ongkos Kirim']]
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

    //Ubah status di tabel order menjadi process


    //Pindah barang dari cart ke order
    let { courierJne, origin, destination } = req.body;
    let { customerId } = req.params;

    //Buat id order
    let order = await Order.findAll();
    let id = "OR" + ((order.length + 1) + "").padStart(5, '0');

    let cart = await Cart.findAll({
        include: [{
            model: Product
        }],
        where: {
            customerId: customerId
        }
    });

    let subtotal = 0;
    let totalWeight = 0;

    for (let i = 0; i < cart.length; i++) {
        subtotal += cart[i].Product.price * cart[i].quantity;
        totalWeight += cart[i].Product.weight;
    }

    const costResult = await axios.post(
        "https://api.rajaongkir.com/starter/cost", {
        "origin": origin,
        "destination": destination,
        "weight": totalWeight,
        "courier": "jne"
    },
        {
            headers: {
                key: process.env.RAJAONGKIR_KEY,
            }
        }
    );

    var servicesCourier = costResult.data.rajaongkir.results[0].costs.find((s) => {
        if (s.service == courierJne)
            return s
    });

    subtotal += servicesCourier.cost[0].value;

    await Order.create({
        codeOrder: id,
        customerId: customerId,
        courierJne: courierJne,
        origin: origin,
        destination: destination,
        weight: totalWeight,
        costCourier: servicesCourier.cost[0].value,
        subtotal: subtotal,
        statusOrder: "PENDING",
        createdAt: new Date(),
        updatedAt: new Date()
    });


    //Tambah detail orders

    //Pindah barang dari cart ke order
    let arrOrderDetails = [];
    for (let i = 0; i < cart.length; i++) {
        let orderDetails = await OrderDetail.create({
            codeOrder: id,
            codeProduct: cart[i].Product.codeProduct,
            quantity: cart[i].quantity,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        let newObj = {
            product_code : cart[i].Product.codeProduct,
            product_name : cart[i].Product.name,
            product_price : formatRupiah(cart[i].Product.price),
            product_quantity : cart[i].quantity,
            product_subtotal : formatRupiah(parseInt(cart[i].Product.price)*parseInt(cart[i].quantity))
        }
        arrOrderDetails.push(newObj);
    }

    //Hapus yang di cart
    await Cart.destroy({
        where: {
            customerId: customerId
        }
    });

    //Bikin payment
    let idPayment = "INVOICEORDER" + ((order.length + 1) + "").padStart(5, '0');

    await Payment.create({
        codePayment: idPayment,
        codeOrder: id,
        subtotal: subtotal,
        paymentStatus: "unpaid",
        createdAt: new Date(),
        updatedAt: new Date()
    });

    return res.status(200).send({
        message: `Order dengan kode pembayaran ${idPayment} sedang dalam status PENDING`,
        asal : origin,
        tujuan : destination,
        layanan : servicesCourier.cost[0].value,
        berat: totalWeight,
        ongkos_kirim : formatRupiah(servicesCourier.cost[0].value),
        subtotal : formatRupiah(subtotal),
        estimasi_sampai: servicesCourier.cost[0].etd,
        total : formatRupiah(parseInt(costCourier)+parseInt(subtotal)),
        status_order : "PENDING",
        daftar_product: arrOrderDetails,
    });
}

module.exports = {
    viewOrder,
    payOrder,
    checkOut
}