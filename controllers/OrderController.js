const Order = require('../models').Order;
const Payment = require('../models').Payment;

const { validationResult } = require("express-validator");

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
    }
    else {
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
    return res.status(200).send({ order: result });
}

async function payOrder(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.formatter.badRequest(errors.mapped());
    }

    let result;
    let { codeOrder } = req.body;
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

    return res.status(200).send({ message: `Pembayaran untuk pesanan dengan ID ${codeOrder} sudah diverifikasi. Pesanan customer sedang diproses` });
}

async function checkOut(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.formatter.badRequest(errors.mapped());
    }

    let result;
<<<<<<< Updated upstream
    let { codeOrder } = req.body;

    //Ubah status di tabel order menjadi process

    await Order.update({
        statusOrder: 'pending'
    }, {
        where: {
            codeOrder: codeOrder
        }
    });

    let orderNow = Order.findOne({
=======
    let { courierJne,origin,destination,costCourier } = req.body;
    let { customerId } = req.params;

    //Pindah barang dari cart ke order
    let order = await Order.findAll();
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
    
    let cart = await Cart.findAll({
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

    //wEIGHT MASIH PATEN
    await Order.create({
        codeOrder : id,
        customerId : customerId,
        courierJne : courierJne,
        origin : origin,
        destination : destination,
        weight : 5,
        costCourier : costCourier,
        subtotal : subtotal,
        statusOrder : "PROCESS",
        createdAt : new Date(),
        updatedAt : new Date()
    });


    //Ubah status di tabel order menjadi process

    let orderNow = await Order.findOne({
        include: [{
            model: Product
        }],
>>>>>>> Stashed changes
        where: {
            codeOrder: codeOrder
        }
    });

    return res.status(200).send({ 
        message: `Orderan dengan kode ${req.body.codeOrder} sedang dalam proses checkout`,
        nama_product : orderNow.nama
    }
    );
}

module.exports = {
    viewOrder,
    payOrder,
    checkOut
}