const Order = require('../models').Order;
const OrderDetail = require('../models').OrderDetail;
const Payment = require('../models').Payment;
const Product = require('../models').Product;
const Cart = require('../models').Cart;

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
            attributes: [['codeOrder','Code Order'], ['origin','Asal'], ['destination','Tujuan'], ['courierJne','Layanan'], ['costCourier','Ongkos Kirim']]
        }, {
            where: {
                customerId: req.params.customerId
            }
        });
    } else {
        //Kalau di body ada codeOrder
        //Cari order itu saja

        result = await Order.findAll({
            attributes: [['codeOrder','Code Order'], ['origin','Asal'], ['destination','Tujuan'], ['courierJne','Layanan'], ['costCourier','Ongkos Kirim']]
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
    let { codeOrder,courierJne,origin,destination,costCourier } = req.body;
    let { customerId } = req.params;

    //Pindah barang dari cart ke order
    let order = Order.findAll();
    let id = "OR";
    let panjang;
    if(order.length<10){
        panjang="0000"+order.length+1;
    }
    else if(order.length<100){
        panjang="000"+order.length+1;
    }
    else if(order.length<1000){
        panjang="00"+order.length+1;

    }
    else if(order.length<10000){
        panjang="0"+order.length+1;
    }
    else if(order.length<100000){
        panjang=order.length+1;
    }
    id = id+panjang;
    
    let cart = Cart.findAll({
        include: [{
            model: Product
        }],
        where :{
            customerId : customerId
        }
    });

    

    let subtotal=0;

    for (let i = 0; i < cart.length; i++) {
        subtotal+=cart[i].Product.price * cart[i].quantity;
    }

    await Order.create({
        codeOrder : id,
        customerId : customerId,
        courierJne : courierJne,
        origin : origin,
        destination : destination,
        weight : 5,
        costCourier : costCourier,
        subtotal
    });


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

    let orderDetails = await OrderDetail.findAll({
        include: [{
            model: Product
        }],
        where : {
            codeOrder : req.body.codeOrder
        }
    });

    return res.status(200).send({
        message: `Orderan dengan kode ${req.body.codeOrder} sedang dalam proses checkout`,
        Asal : orderNow.origin,
        Tujuan : orderNow.destination,
        Layanan : orderNow.courierJne,
        Ongkos_Kirim : orderNow.costCourier,
        Status_Order : orderNow.statusOrder,
        Daftar_Product: orderNow.Product.name,
        daftar_product2: "ceritanya daftar produk... nanti semua produk dibuat jadi 1 array"
    });
}

module.exports = {
    viewOrder,
    payOrder,
    checkOut
}