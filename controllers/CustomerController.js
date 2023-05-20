const Order = require('../models').Order;
const OrderDetail = require('../models').OrderDetail;
const Payment = require('../models').Payment;
const Product = require('../models').Product;
const Cart = require('../models').Cart;
const Review = require('../models').Review;
const Customer = require("../models").Customer;
const Developer = require("../models").Developer;
const axios = require("axios").default;
const jwt = require('jsonwebtoken');

require("dotenv").config();
const formatRupiah = require('../helpers/formatRupiah');
const {
    validationResult
} = require("express-validator");
const {
    Op
} = require('sequelize');
const {
    sequelize
} = require('../models');

async function viewOrder(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.formatter.badRequest(errors.mapped());
    }
    
    var token = req.header("x-auth-token");
    let cust = jwt.verify(token, process.env.JWT_KEY);
    
    let customerId = cust.id;
    let { codeOrder, statusOrder } = req.body;
    let { sortStatusOrder, sortStatusPayment, sortSubtotal } = req.query;


    let result;
    try {
        if (!sortStatusOrder) {
            sortStatusOrder = "ASC";
        }
        if (!sortStatusPayment) {
            sortStatusPayment = "ASC";
        }
        if (!sortSubtotal) {
            sortSubtotal = "ASC";
        }
        if (!req.body.codeOrder) {
            //Kalau di body gk ada codeOrder
            //Cari semua order dari user yg login

            if (statusOrder) {
                result = await Payment.findAll({
                    attributes: [['paymentStatus', 'Payment Status']],
                    include: [
                        {
                            model: Order,
                            attributes: [
                                ['codeOrder', 'Code Order'],
                                ['origin', 'Asal'],
                                ['destination', 'Tujuan'],
                                ['address', 'Alamat'],
                                ['courierJne', 'Layanan'],
                                ['costCourier', 'Ongkos Kirim'],
                                ['statusOrder', 'Status'],
                                ['subtotal', 'Subtotal (Belum Termasuk Ongkir)']
                            ],
                            include: [{
                                model: OrderDetail,
                                attributes: [['quantity', 'Quantity']],
                                include: [{
                                    model: Product,
                                    attributes: [
                                        ['name', 'Nama Product'],
                                        ['price', 'Harga Product'],
                                        ['weight', 'Berat Product']
                                    ]
                                }]
                            }],
                            where: {
                                customerId: customerId,                                
                                statusOrder: statusOrder
                            },
                            order: [
                                ['statusOrder', sortStatusOrder],
                                ['subtotal', sortSubtotal]
                            ]
                        }],
                        order : [
                            ['paymentStatus',sortStatusPayment]
                        ]
                });
            } else {
                result = await Payment.findAll({
                    attributes: [['paymentStatus', 'Payment Status']],
                    include: [
                        {
                            model: Order,
                            attributes: [
                                ['codeOrder', 'Code Order'],
                                ['origin', 'Asal'],
                                ['destination', 'Tujuan'],
                                ['address', 'Alamat'],
                                ['courierJne', 'Layanan'],
                                ['costCourier', 'Ongkos Kirim'],
                                ['statusOrder', 'Status'],
                                ['subtotal', 'Subtotal (Belum Termasuk Ongkir)']
                            ],
                            include: [{
                                model: OrderDetail,
                                attributes: [['quantity', 'Quantity']],
                                include: [{
                                    model: Product,
                                    attributes: [
                                        ['name', 'Nama Product'],
                                        ['price', 'Harga Product'],
                                        ['weight', 'Berat Product']
                                    ]
                                }]
                            }],
                            where: {
                                customerId: customerId
                            },
                            order: [
                                ['statusOrder', sortStatusOrder],
                                ['subtotal', sortSubtotal]
                            ]
                        }],
                        order : [
                            ['paymentStatus',sortStatusPayment]
                        ]
                });
            }
        } else {
            //Kalau di body ada codeOrder
            //Cari order itu saja

            //Cek yang login benar punya orderan itu

            let checkOrder = await Order.findOne({
                where: {
                    codeOrder: codeOrder,
                    customerId: customerId
                }
            });

            if (!checkOrder) {
                return res.formatter.badRequest({
                    message: "Kamu tidak memesan orderan ini!"
                });
            }

            if (statusOrder) {                
                result = await Payment.findAll({
                    attributes: [['paymentStatus', 'Payment Status']],
                    include: [
                        {
                            model: Order,
                            attributes: [
                                ['codeOrder', 'Code Order'],
                                ['origin', 'Asal'],
                                ['destination', 'Tujuan'],
                                ['address', 'Alamat'],
                                ['courierJne', 'Layanan'],
                                ['costCourier', 'Ongkos Kirim'],
                                ['statusOrder', 'Status'],
                                ['subtotal', 'Subtotal (Belum Termasuk Ongkir)']
                            ],
                            include: [{
                                model: OrderDetail,
                                attributes: [['quantity', 'Quantity']],
                                include: [{
                                    model: Product,
                                    attributes: [
                                        ['name', 'Nama Product'],
                                        ['price', 'Harga Product'],
                                        ['weight', 'Berat Product']
                                    ]
                                }]
                            }],
                            where: {
                                statusOrder : statusOrder,
                                codeOrder : codeOrder
                            },
                            order: [
                                ['statusOrder', sortStatusOrder],
                                ['subtotal', sortSubtotal]
                            ]
                        }],
                        order : [
                            ['paymentStatus',sortStatusPayment]
                        ]
                });
            } else {
                result = await Payment.findAll({
                    attributes: [['paymentStatus', 'Payment Status']],
                    include: [
                        {
                            model: Order,
                            attributes: [
                                ['codeOrder', 'Code Order'],
                                ['origin', 'Asal'],
                                ['destination', 'Tujuan'],
                                ['address', 'Alamat'],
                                ['courierJne', 'Layanan'],
                                ['costCourier', 'Ongkos Kirim'],
                                ['statusOrder', 'Status'],
                                ['subtotal', 'Subtotal (Belum Termasuk Ongkir)']
                            ],
                            include: [{
                                model: OrderDetail,
                                attributes: [['quantity', 'Quantity']],
                                include: [{
                                    model: Product,
                                    attributes: [
                                        ['name', 'Nama Product'],
                                        ['price', 'Harga Product'],
                                        ['weight', 'Berat Product']
                                    ]
                                }]
                            }],
                            where: {
                                codeOrder : codeOrder
                            },
                            order: [
                                ['statusOrder', sortStatusOrder],
                                ['subtotal', sortSubtotal]
                            ]
                        }],
                        order : [
                            ['paymentStatus',sortStatusPayment]
                        ]
                });
            }
        }
        if (result.length == 0) {
            result = "Hasil pencarian tidak menemukan orderan apapun!";
        }
        return res.formatter.ok({
            order: result
        });
    } catch (e) {
        return res.status(500).send({
            message: e.toString()
        });
    }
}

async function payOrder(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.formatter.badRequest(errors.mapped());
    }

    var token = req.header("x-auth-token");
    let cust = jwt.verify(token, process.env.JWT_KEY);
    
    let customerId = cust.id;
    let {
        codeOrder
    } = req.body;
    // Ubah status di tabel payments untuk codeOrder

    //Cek yang login benar punya orderan itu

    let checkOrder = await Order.findOne({
        where: {
            codeOrder: codeOrder,
            customerId: customerId
        }
    });

    if (!checkOrder) {
        return res.formatter.badRequest({
            message: "Kamu tidak memesan orderan ini!"
        });
    }

    await Payment.update({
        paymentStatus: 'paid'
    }, {
        where: {
            codeOrder: codeOrder
        }
    });

    //Ubah status di tabel order menjadi process

    // await Order.update({
    //     statusOrder: 'process'
    // }, {
    //     where: {
    //         codeOrder: codeOrder
    //     }
    // });

    return res.formatter.ok({
        message: `Pembayaran untuk pesanan dengan kode ${codeOrder} sudah diverifikasi. Pesanan customer sedang diproses`
    });
}

async function checkOut(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.formatter.badRequest(errors.mapped());
    }
    let {
        courierJne,
        origin,
        destination,
        address
    } = req.body;
    var token = req.header("x-auth-token");
    let cust = jwt.verify(token, process.env.JWT_KEY);
    
    let customerId = cust.id;

    try {
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

        if (cart.length == 0) {
            return res.formatter.notFound({
                message: "Cart anda kosong, minimal terdapat 1 barang di cart!"
            });
        } else {
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
            }, {
                headers: {
                    key: process.env.RAJAONGKIR_KEY,
                }
            }
            );

            var servicesCourier = costResult.data.rajaongkir.results[0].costs.find((s) => {
                if (s.service == courierJne) {
                    // console.log(s);
                    return s
                }
            });

            await Order.create({
                codeOrder: id,
                customerId: customerId,
                courierJne: courierJne,
                address: address,
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
                await OrderDetail.create({
                    codeOrder: id,
                    codeProduct: cart[i].Product.codeProduct,
                    quantity: cart[i].quantity,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                let newObj = {
                    product_code: cart[i].Product.codeProduct,
                    product_name: cart[i].Product.name,
                    product_price: formatRupiah(cart[i].Product.price),
                    product_quantity: cart[i].quantity,
                    product_weight: cart[i].Product.weight + " gram",
                    product_subtotal: formatRupiah(parseInt(cart[i].Product.price) * parseInt(cart[i].quantity)),
                    product_weight_subtotal: parseInt(cart[i].Product.weight) * parseInt(cart[i].quantity) + " gram"
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

            return res.formatter.ok({
                message: `Order dengan kode pembayaran ${idPayment} sedang dalam status PENDING`,
                asal: origin,
                tujuan: destination,
                // layanan: servicesCourier.cost[0].value,
                layanan: courierJne,
                berat: totalWeight + " gram",
                ongkos_kirim: formatRupiah(servicesCourier.cost[0].value),
                subtotal: formatRupiah(subtotal),
                estimasi_sampai: servicesCourier.cost[0].etd,
                total: formatRupiah(parseInt(servicesCourier.cost[0].value) + parseInt(subtotal)),
                status_order: "PENDING",
                daftar_product: arrOrderDetails,
            });

        }

    } catch (e) {
        return res.status(500).send({
            message: e.toString()
        });
    }
}

async function addToCart(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.formatter.badRequest(errors.mapped());
    }

    let {
        quantity,
        codeProduct,
        nameProduct
    } = req.body;
    var token = req.header("x-auth-token");
    let cust = jwt.verify(token, process.env.JWT_KEY);
    
    let customerId = cust.id;

    if (!req.body.codeProduct && !req.body.nameProduct) {
        return res.formatter.badRequest({
            message: "Salah satu codeProduct atau namaProduct harus diisi!"
        });
    }
    if (req.body.codeProduct && req.body.nameProduct) {
        return res.formatter.badRequest({
            message: "Hanya boleh mengisi salah satu codeProduct atau namaProduct, tidak dapat diisi keduanya!"
        });
    }

    try {
        //result
        let isiCart = [];

        let panjangQty = quantity.split(",");
        if (req.body.codeProduct) {
            let panjangCode = codeProduct.split(",");
            //Cek panjang quantity = codeProduct
            if (panjangCode.length != panjangQty.length) {
                return res.formatter.badRequest({
                    message: "Panjang quantity dan panjang codeProduct tidak sama!"
                });
            }
            //Pengecekan
            for (let i = 0; i < panjangCode.length; i++) {
                let cekCode = await Product.findOne({
                    where: {
                        codeProduct: panjangCode[i],
                        developerId: cust.developerId
                    }
                });
                //Cek codeProduct benar ada gak 
                if (!cekCode) {
                    return res.formatter.notFound({
                        message: `Produk dengan code ${panjangCode[i]} tidak ditemukan`
                    });
                }
                //Cek stok cukup gak
                if (quantity[i] > cekCode.stock) {
                    return res.formatter.badRequest({
                        message: `Stok ${panjangCode[i]} hanya terdapat ${cekCode.stock}`
                    });
                }
            }

            //Masukin Cart
            for (let i = 0; i < panjangCode.length; i++) {
                let cekCode = await Product.findOne({
                    where: {
                        codeProduct: panjangCode[i],
                        developerId: cust.developerId
                    }
                });
                let cekInCart = await Cart.findOne({
                    where: {
                        customerId: customerId,
                        codeProduct: panjangCode[i]
                    }
                });
                //Cek barang sudah masuk cart gk
                //Kalau blm insert 
                if (!cekInCart) {
                    await Cart.create({
                        customerId: customerId,
                        codeProduct: panjangCode[i],
                        quantity: panjangQty[i],
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                }
                //Kalau sdh update
                else {
                    await Cart.update({
                        quantity: (cekInCart.quantity + parseInt(panjangQty[i])),
                        updatedAt: new Date()
                    }, {
                        where: {
                            customerId: customerId,
                            codeProduct: panjangCode[i]
                        }
                    });
                }
                let produkNow = await Product.findOne({
                    where: {
                        codeProduct: panjangCode[i]
                    }
                });
                let newObj = {
                    product_code: produkNow.codeProduct,
                    product_name: produkNow.name,
                    product_price: formatRupiah(produkNow.price),
                    product_weight: produkNow.weight + " gram",
                    quantity: panjangQty[i],
                    subtotal: formatRupiah(parseInt(produkNow.price) * parseInt(panjangQty[i])),
                    subtotal_weight: (parseInt(produkNow.weight) * parseInt(panjangQty[i])) + " gram"
                }
                isiCart.push(newObj);
                //Kurangi stok
                await Product.update({
                    stock: (parseInt(cekCode.stock) - parseInt(panjangQty[i]))
                }, {
                    where: {
                        codeProduct: cekCode.codeProduct
                    }
                });
            }
        }
        if (req.body.nameProduct) {
            let panjangNama = nameProduct.split(",");
            //Cek panjang quantity = codeProduct
            if (panjangNama.length != panjangQty.length) {
                return res.formatter.badRequest({
                    message: "Panjang quantity dan panjang nameProduct tidak sama!"
                });
            }
            //Pengecekan
            for (let i = 0; i < panjangNama.length; i++) {
                let cekCode = await Product.findOne({
                    where: {
                        name: panjangNama[i]
                    }
                });
                //Cek codeProduct benar ada gak 
                if (!cekCode) {
                    return res.formatter.notFound({
                        message: `Produk dengan nama ${panjangNama[i]} tidak ditemukan`
                    });
                }
                //Cek stok cukup gak
                if (quantity[i] > cekCode.stock) {
                    return res.formatter.badRequest({
                        message: `Stok ${panjangNama[i]} hanya terdapat ${cekCode.stock}`
                    });
                }
            }
            //Masukin ke cart
            for (let i = 0; i < panjangNama.length; i++) {
                let cekCode = await Product.findOne({
                    where: {
                        name: panjangNama[i]
                    }
                });
                let cekInCart = await Cart.findOne({
                    where: {
                        customerId: customerId,
                        codeProduct: cekCode.codeProduct
                    }
                });
                //Cek barang sudah masuk cart gk
                //Kalau blm insert    
                if (!cekInCart) {
                    await Cart.create({
                        customerId: customerId,
                        codeProduct: cekCode.codeProduct,
                        quantity: panjangQty[i],
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                }
                //Kalau sdh update
                else {
                    await Cart.update({
                        quantity: (cekInCart.quantity + parseInt(panjangQty[i])),
                        updatedAt: new Date()
                    }, {
                        where: {
                            customerId: customerId,
                            codeProduct: cekCode.codeProduct
                        }
                    });
                }

                let produkNow = await Product.findOne({
                    where: {
                        name: panjangNama[i]
                    }
                });
                let newObj = {
                    product_code: produkNow.codeProduct,
                    product_name: produkNow.name,
                    product_price: formatRupiah(produkNow.price),
                    product_weight: produkNow.weight + " gram",
                    quantity: panjangQty[i],
                    subtotal: formatRupiah(parseInt(produkNow.price) * parseInt(panjangQty[i])),
                    subtotal_weight: (parseInt(produkNow.weight) * parseInt(panjangQty[i])) + " gram"
                }
                isiCart.push(newObj);
                //Kurangi stok
                await Product.update({
                    stock: (parseInt(cekCode.stock) - parseInt(panjangQty[i]))
                }, {
                    where: {
                        codeProduct: cekCode.codeProduct
                    }
                });

            }
        }

        return res.formatter.ok({
            message: `Barang berhasil dimasukkan ke dalam cart`,
            new_item: isiCart
        });
    } catch (e) {
        return res.status(500).send({
            message: e.toString()
        });
    }
}

async function addReview(req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.formatter.badRequest(errors.mapped());
    }

    try {
        var token = req.header("x-auth-token");
        let cust = jwt.verify(token, process.env.JWT_KEY);
        
        let customerId = cust.id;
        let {
            codeOrderDetail,
            rating,
            comment
        } = req.body;

        //Cek customer yang review benar telah pesan produk
        let checkPesanan = await OrderDetail.findAll({
            include: [{
                model: Order,
                where: {
                    customerId: customerId
                },
                required: true
            }],
            where: {
                codeOrderDetail: codeOrderDetail,
            }
        })

        if (checkPesanan.length == 0) {
            return res.formatter.badRequest({
                message: "Kamu tidak memesan produk ini!"
            });
        }

        //Cek status order deliverd atau tidak
        //Kalau blm delivered gak bisa review
        let checkStatusOrder = await Order.findAll({
            include : [{
                model : OrderDetail,
                where : {
                    codeOrderDetail : codeOrderDetail
                }
            }],
            where : {
                statusOrder : "DELIVERED"
            }
        });

        if (checkStatusOrder.length == 0) {
            return res.formatter.badRequest({
                message: "Pesanan kamu belum selesai!"
            });
        }

        //Review Product
        //Kalau sdh pernah gk bisa review lagi 

        let sudahReview = await Review.findOne({
            where: {
                customerId: customerId,
                codeOrderDetail: codeOrderDetail
            }
        });

        if (sudahReview) {
            return res.formatter.badRequest({
                message: `Anda sudah pernah review produk ini di orderan ini!`
            });
        }

        //Kalau blm pernah review buat review baru

        await Review.create({
            rating: rating,
            customerId: customerId,
            comment: comment,
            createdAt: new Date(),
            updatedAt: new Date(),
            codeOrderDetail: codeOrderDetail
        });

        let produkNow = await Product.findOne({
            include: [{
                model: OrderDetail,
                where: {
                    codeOrderDetail: codeOrderDetail
                },
                required: true
            }]
        });

        return res.formatter.created({
            message: `Berhasil submit review untuk produk ${produkNow.name} dengan rating ${rating}/5 `,
            comment: comment
        });

    } catch (e) {
        return res.status(500).send({
            message: e.toString()
        });
    }
}

async function viewCart(req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.formatter.badRequest(errors.mapped());
    }

    try {
        var token = req.header("x-auth-token");
        let cust = jwt.verify(token, process.env.JWT_KEY);
        
        let customerId = cust.id;

        //View Cart
        //Kalau sdh pernah gk bisa review lagi 

        let result = await Cart.findAll({
            attributes :[
                ['quantity','Quantity_in_cart']
            ],
            include : [{
                model : Product,
                as : 'Product',
                attributes : [
                    ['codeProduct','Product Code'],
                    ['name','Product Name'],
                    ['price','Product Price'],
                    ['weight','Product Weight'],
                ]
            }],
            where: {
                customerId: customerId
            }
        });

        if(result.length==0){
            return res.formatter.notFound({
                message: "Cart kamu kosong!"
            });    
        }
        return res.formatter.ok({
            cart: result
        });

    } catch (e) {
        return res.status(500).send({
            message: e.toString()
        });
    }
}

async function removeFromCart(req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.formatter.badRequest(errors.mapped());
    }
    
    if (!req.body.codeProduct && !req.body.nameProduct) {
        return res.formatter.badRequest({
            message: "Salah satu codeProduct atau namaProduct harus diisi!"
        });
    }
    if (req.body.codeProduct && req.body.nameProduct) {
        return res.formatter.badRequest({
            message: "Hanya boleh mengisi salah satu codeProduct atau namaProduct, tidak dapat diisi keduanya!"
        });
    }

    let {
        quantity,
        codeProduct,
        nameProduct
    } = req.body;

    
    try {
        var token = req.header("x-auth-token");
        let cust = jwt.verify(token, process.env.JWT_KEY);
        
        let customerId = cust.id;
        //result
        let isiCart = [];

        let panjangQty = quantity.split(","); 
        if (req.body.codeProduct) {
            let panjangCode = codeProduct.split(",");
            //Cek panjang quantity = codeProduct
            if (panjangCode.length != panjangQty.length) {
                return res.formatter.badRequest({
                    message: "Panjang quantity dan panjang codeProduct tidak sama!"
                });
            }
            //Pengecekan
            for (let i = 0; i < panjangCode.length; i++) {
                let cekCart = await Cart.findOne({
                    where : {
                        customerId : customerId,
                        codeProduct : panjangCode[i]
                    }
                });
                if(!cekCart){
                    return res.formatter.notFound({
                        message : `Product dengan code ${panjangCode[i]} tersebut tidak ada di cart anda!`
                    });
                }
                if(parseInt(cekCart.quantity)-parseInt(panjangQty[i])>0){
                    await Cart.update({
                        quantity : parseInt(cekCart.quantity)-parseInt(panjangQty[i])
                    },
                    {                        
                        where : {
                            customerId : customerId,
                            codeProduct : panjangCode[i]
                        },
                        force : true
                    });
                }
                else{
                    await Cart.destroy({
                        where : {
                            customerId : customerId,
                            codeProduct : panjangCode[i]
                        },
                        force : true
                    });
                }
                let produkNow = await Product.findOne({
                    where : {
                        codeProduct : panjangCode[i]
                    }
                });
                let newObj = {                    
                    product_code: produkNow.codeProduct,
                    product_name: produkNow.name,
                    product_price: formatRupiah(produkNow.price),
                    product_weight: produkNow.weight + " gram",
                    quantity: panjangQty[i],
                    subtotal: formatRupiah(parseInt(produkNow.price) * parseInt(panjangQty[i])),
                    subtotal_weight: (parseInt(produkNow.weight) * parseInt(panjangQty[i])) + " gram"
                }
                isiCart.push(newObj);
            }
        }
        if (req.body.nameProduct) {
            let panjangNama = nameProduct.split(",");
            //Cek panjang quantity = codeProduct
            if (panjangNama.length != panjangQty.length) {
                return res.formatter.badRequest({
                    message: "Panjang quantity dan panjang nameProduct tidak sama!"
                });
            }
            //Pengecekan
            for (let i = 0; i < panjangNama.length; i++) {
                let produkNow = await Product.findOne({
                    where : {
                        name : panjangNama[i]
                    }
                });

                let cekCart = await Cart.findOne({
                    where : {
                        customerId : customerId,
                        codeProduct : produkNow.codeProduct
                    }
                });

                if(!cekCart){
                    return res.formatter.notFound({
                        message : `Product dengan nama ${panjangNama[i]} tersebut tidak ada di cart anda!`
                    });
                }
                if(parseInt(cekCart.quantity)-parseInt(panjangQty[i])>0){
                    await Cart.update({
                        quantity : parseInt(cekCart.quantity)-parseInt(panjangQty[i])
                    },
                    {                        
                        where : {
                            customerId : customerId,
                            codeProduct : produkNow.codeProduct
                        },
                        force : true
                    });
                }
                else{
                    await Cart.destroy({
                        where : {
                            customerId : customerId,
                            codeProduct : produkNow.codeProduct
                        },
                        force : true
                    });
                }
                produkNow = await Product.findOne({
                    where : {
                        codeProduct : produkNow.codeProduct
                    }
                });
                let newObj = {                    
                    product_code: produkNow.codeProduct,
                    product_name: produkNow.name,
                    product_price: formatRupiah(produkNow.price),
                    product_weight: produkNow.weight + " gram",
                    quantity: panjangQty[i],
                    subtotal: formatRupiah(parseInt(produkNow.price) * parseInt(panjangQty[i])),
                    subtotal_weight: (parseInt(produkNow.weight) * parseInt(panjangQty[i])) + " gram"
                }
                isiCart.push(newObj);
            }
        }

        return res.formatter.ok({
            removed_product : isiCart
        });
    } catch (e) {
        return res.status(500).send({
            message: e.toString()
        });
    }
}

const getAll = async (req, res) => {
    var token = req.header("x-auth-token");
    dev = jwt.verify(token, process.env.JWT_KEY);
    var username = req.query.username;
    var email = req.query.email;
    var sortUsername = req.query.sortByUsername;
    let customers = await Customer.findAll({
        attributes: ['id', 'Customer.firstName', 'Customer.lastName', 'email', 'phoneNumber', 'username'],
        include: [{
            model: Developer,
            attributes: [
                [sequelize.fn('CONCAT', sequelize.col('Developer.firstName'), ' ', sequelize.col('Developer.lastName')), 'developer_name']
            ]
        }],
        where: {
            developerId: dev.id
        },
    });
    if (!sortUsername) {
        if (username) {
            customers = await Customer.findAll({
                attributes: ['id', 'Customer.firstName', 'Customer.lastName', 'email', 'phoneNumber', 'username'],
                include: [{
                    model: Developer,
                    attributes: [
                        [sequelize.fn('CONCAT', sequelize.col('Developer.firstName'), ' ', sequelize.col('Developer.lastName')), 'developer_name']
                    ]
                }],
                where: {
                    developerId: dev.id,
                    username: {
                        [Op.like]: '%' + username + '%'
                    }
                },
            });
        } else if (email) {
            customers = await Customer.findAll({
                attributes: ['id', 'Customer.firstName', 'Customer.lastName', 'email', 'phoneNumber', 'username'],
                include: [{
                    model: Developer,
                    attributes: [
                        [sequelize.fn('CONCAT', sequelize.col('Developer.firstName'), ' ', sequelize.col('Developer.lastName')), 'developer_name']
                    ]
                }],
                where: {
                    developerId: dev.id,
                    email: {
                        [Op.like]: '%' + email + '%'
                    }
                },
            });
        }
    } else if (sortUsername) {
        if (username) {
            if (sortUsername.toLowerCase() == "asc") {
                customers = await Customer.findAll({
                    attributes: ['id', 'Customer.firstName', 'Customer.lastName', 'email', 'phoneNumber', 'username'],
                    include: [{
                        model: Developer,
                        attributes: [
                            [sequelize.fn('CONCAT', sequelize.col('Developer.firstName'), ' ', sequelize.col('Developer.lastName')), 'developer_name']
                        ]
                    }],
                    where: {
                        developerId: dev.id,
                        username: {
                            [Op.like]: '%' + username + '%'
                        }
                    },
                    order: [
                        ['username', 'ASC']
                    ]
                });
            } else if (sortUsername.toLowerCase() == "desc") {
                customers = await Customer.findAll({
                    attributes: ['id', 'Customer.firstName', 'Customer.lastName', 'email', 'phoneNumber', 'username'],
                    include: [{
                        model: Developer,
                        attributes: [
                            [sequelize.fn('CONCAT', sequelize.col('Developer.firstName'), ' ', sequelize.col('Developer.lastName')), 'developer_name']
                        ]
                    }],
                    where: {
                        developerId: dev.id,
                        username: {
                            [Op.like]: '%' + username + '%'
                        }
                    },
                    order: [
                        ['username', 'DESC']
                    ]
                });
            }

        } else if (email) {
            if (sortUsername.toLowerCase() == "asc") {
                customers = await Customer.findAll({
                    attributes: ['id', 'Customer.firstName', 'Customer.lastName', 'email', 'phoneNumber', 'username'],
                    include: [{
                        model: Developer,
                        attributes: [
                            [sequelize.fn('CONCAT', sequelize.col('Developer.firstName'), ' ', sequelize.col('Developer.lastName')), 'developer_name']
                        ]
                    }],
                    where: {
                        developerId: dev.id,
                        email: {
                            [Op.like]: '%' + email + '%'
                        }
                    },
                    order: [
                        ['username', 'ASC']
                    ]
                });
            } else if (sortUsername.toLowerCase() == "desc") {
                customers = await Customer.findAll({
                    attributes: ['id', 'Customer.firstName', 'Customer.lastName', 'email', 'phoneNumber', 'username'],
                    include: [{
                        model: Developer,
                        attributes: [
                            [sequelize.fn('CONCAT', sequelize.col('Developer.firstName'), ' ', sequelize.col('Developer.lastName')), 'developer_name']
                        ]
                    }],
                    where: {
                        developerId: dev.id,
                        email: {
                            [Op.like]: '%' + email + '%'
                        }
                    },
                    order: [
                        ['username', 'DESC']
                    ]
                });
            }
        }
    }
    return res.formatter.ok(customers);
}



module.exports = {
    viewOrder,
    payOrder,
    checkOut,
    addToCart,
    addReview,
    getAll,
    viewCart,
    removeFromCart
}