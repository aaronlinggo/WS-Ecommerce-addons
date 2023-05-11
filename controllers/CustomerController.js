const Order = require('../models').Order;
const OrderDetail = require('../models').OrderDetail;
const Payment = require('../models').Payment;
const Product = require('../models').Product;
const Cart = require('../models').Cart;
const Review = require('../models').Review;


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
            attributes: [
                ['codeOrder', 'Code Order'], 
                ['origin', 'Asal'], 
                ['destination', 'Tujuan'], 
                ['address', 'Alamat'],
                ['courierJne', 'Layanan'], 
                ['costCourier', 'Ongkos Kirim']]
        }, {
            include : [{
                model : OrderDetail,
                attributes : [[]]
            }],
            where: {
                customerId: req.params.customerId
            }
        });
    } else {
        //Kalau di body ada codeOrder
        //Cari order itu saja

        result = await Order.findAll({
            attributes: [
                ['codeOrder', 'Code Order'], 
                ['origin', 'Asal'], 
                ['destination', 'Tujuan'], 
                ['address', 'Alamat'],
                ['courierJne', 'Layanan'], 
                ['costCourier', 'Ongkos Kirim']]
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
        message: `Pembayaran untuk pesanan dengan kode ${codeOrder} sudah diverifikasi. Pesanan customer sedang diproses`
    });
}

async function checkOut(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.formatter.badRequest(errors.mapped());
    }
    let { courierJne, origin, destination } = req.body;
    let { customerId } = req.params;

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
            //status 200? atau brp?
            return res.status(200).send({ message: "Cart anda kosong, minimal terdapat 1 barang di cart!" });
        }
        else {
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
                    product_weight: cart[i].Product.weight,
                    product_subtotal: formatRupiah(parseInt(cart[i].Product.price) * parseInt(cart[i].quantity)),
                    product_weight_subtotal: parseInt(cart[i].Product.weight) * parseInt(cart[i].quantity)
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
                asal: origin,
                tujuan: destination,
                // layanan: servicesCourier.cost[0].value,
                layanan: courierJne,
                berat: totalWeight,
                ongkos_kirim: formatRupiah(servicesCourier.cost[0].value),
                subtotal: formatRupiah(subtotal),
                estimasi_sampai: servicesCourier.cost[0].etd,
                total: formatRupiah(parseInt(servicesCourier.cost[0].value) + parseInt(subtotal)),
                status_order: "PENDING",
                daftar_product: arrOrderDetails,
            });

        }

    } catch (e) {
        return res.status(500).send({ message: e.toString() });
    }
}

async function addToCart(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.formatter.badRequest(errors.mapped());
    }

    let { quantity, codeProduct, nameProduct } = req.body;
    let { customerId } = req.params;

    if(!req.body.codeProduct && !req.body.nameProduct){
        return res.status(400).send({message : "Salah satu codeProduct atau namaProduct harus diisi!"});
    }
    if(req.body.codeProduct && req.body.nameProduct){
        return res.status(400).send({message : "Hanya boleh mengisi salah satu codeProduct atau namaProduct, tidak dapat diisi keduanya!"});
    }

    try {
        //result
        let isiCart=[];

        let panjangQty = quantity.split(",");
        // return res.status(400).send(panjangQty[1]);
        if(req.body.codeProduct){
            let panjangCode = codeProduct.split(",");
            //Cek panjang quantity = codeProduct
            if(panjangCode.length!=panjangQty.length){
                return res.status(400).send({message : "Panjang quantity dan panjang codeProduct tidak sama!"});
            }
            //Pengecekan
            for (let i = 0; i < panjangCode.length; i++) {
                let cekCode = await Product.findOne({
                    where : {
                        codeProduct : panjangCode[i]
                    }
                });    
                //Cek codeProduct benar ada gak 
                if(!cekCode){
                    return res.status(404).send({message : `Produk dengan code ${panjangCode[i]} tidak ditemukan`});
                }
                //Cek stok cukup gak
                if(quantity[i]>cekCode.stock){
                    return res.status(400).send({message : `Stok ${panjangCode[i]} hanya terdapat ${cekCode.stock}`});
                }
            }     

            //Masukin Cart
            for (let i = 0; i < panjangCode.length; i++) {
                let cekCode = await Product.findOne({
                    where : {
                        codeProduct : panjangCode[i]
                    }
                });    
                let cekInCart = await Cart.findOne({
                    where :{
                        customerId : customerId,
                        codeProduct : codeProduct
                    }
                });
                //Cek barang sudah masuk cart gk
                //Kalau blm insert 
                if(!cekInCart){
                    await Cart.create({
                        customerId : customerId,
                        codeProduct : panjangCode[i],
                        quantity : panjangQty[i],
                        createdAt : new Date(),
                        updatedAt : new Date()
                    });    
                }
                //Kalau sdh update
                else{                    
                    await Cart.update({
                        quantity : (cekInCart.quantity+parseInt(panjangQty[i])),
                        updatedAt : new Date()
                    },{
                        where : {
                            customerId : customerId,
                            codeProduct : panjangCode[i]
                        }
                    });    
                }
                let produkNow = await Product.findOne({
                    where : {
                        codeProduct : panjangCode[i]
                    }
                });    
                let newObj = {
                    product_code : produkNow.codeProduct,
                    product_name : produkNow.name,
                    product_price : formatRupiah(produkNow.price),
                    product_weight : produkNow.weight,
                    quantity : panjangQty[i],
                    subtotal : formatRupiah(parseInt(produkNow.price)*parseInt(panjangQty[i])),
                    subtotal_weight : (parseInt(produkNow.weight)*parseInt(panjangQty[i]))
                }
                isiCart.push(newObj);
                //Kurangi stok
                await Product.update({
                    stock : (parseInt(cekCode.stock)-parseInt(panjangQty[i]))
                },{
                    where : {
                        codeProduct : cekCode.codeProduct
                    }
                });                
            }
        }
        if(req.body.nameProduct){
            let panjangNama = nameProduct.split(",");
            //Cek panjang quantity = codeProduct
            if(panjangNama.length!=panjangQty.length){
                return res.status(400).send({message : "Panjang quantity dan panjang nameProduct tidak sama!"});
            }
            //Pengecekan
            for (let i = 0; i < panjangNama.length; i++) {
                let cekCode = await Product.findOne({
                    where : {
                        name : panjangNama[i]
                    }
                });    
                //Cek codeProduct benar ada gak 
                if(!cekCode){
                    return res.status(404).send({message : `Produk dengan nama ${panjangNama[i]} tidak ditemukan`});
                }
                //Cek stok cukup gak
                if(quantity[i]>cekCode.stock){
                    return res.status(400).send({message : `Stok ${panjangNama[i]} hanya terdapat ${cekCode.stock}`});
                }
            } 
            //Masukin ke cart
            for (let i = 0; i < panjangNama.length; i++) {
                let cekCode = await Product.findOne({
                    where : {
                        name : panjangNama[i]
                    }
                });   
                let cekInCart = await Cart.findOne({
                    where :{
                        customerId : customerId,
                        codeProduct : cekCode.codeProduct
                    }
                });
                //Cek barang sudah masuk cart gk
                //Kalau blm insert    
                if(!cekInCart){
                    await Cart.create({
                        customerId : customerId,
                        codeProduct : cekCode.codeProduct,
                        quantity : panjangQty[i],
                        createdAt : new Date(),
                        updatedAt : new Date()
                    });    
                }
                //Kalau sdh update
                else{        
                    await Cart.update({
                        quantity : (cekInCart.quantity+parseInt(panjangQty[i])),
                        updatedAt : new Date()
                    },{
                        where : {
                            customerId : customerId,
                            codeProduct : cekCode.codeProduct
                        }
                    });    
                }
                
                let produkNow = await Product.findOne({
                    where : {
                        name : panjangNama[i]
                    }
                });    
                let newObj = {
                    product_code : produkNow.codeProduct,
                    product_name : produkNow.name,
                    product_price : formatRupiah(produkNow.price),
                    product_weight : produkNow.weight,
                    quantity : panjangQty[i],
                    subtotal : formatRupiah(parseInt(produkNow.price)*parseInt(panjangQty[i])),
                    subtotal_weight : (parseInt(produkNow.weight)*parseInt(panjangQty[i]))
                }
                isiCart.push(newObj);   
                //Kurangi stok
                await Product.update({
                    stock : (parseInt(cekCode.stock)-parseInt(panjangQty[i]))
                },{
                    where : {
                        codeProduct : cekCode.codeProduct
                    }
                });
                
            }    
        }

        return res.status(200).send({
            message: `Barang berhasil dimasukkan ke dalam cart`,
            new_item : isiCart
        });
    } catch (e) {
        return res.status(500).send({
            message: e.toString()
        });
    }
}

async function addReview(req,res){
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.formatter.badRequest(errors.mapped());
    }

    try{
        let {customerId} = req.params;
        let {codeOrderDetail,rating,comment} = req.body;

        //Cek customer yang review benar telah pesan produk
        let checkPesanan = await OrderDetail.findAll({
            include : [{
                model : Order,
                where : {
                    customerId : customerId
                },
                required : true
            }],
            where :{
                codeOrderDetail : codeOrderDetail,
            }
        });


        if(checkPesanan.length==0){
            return res.status(400).send({
                message : "Kamu tidak memesan produk ini!"
            });
        }

        //Review Product
        //Kalau sdh pernah gk bisa review lagi 

        let sudahReview = await Review.findOne({
            where : {
                customerId : customerId,
                codeOrderDetail : codeOrderDetail
            }
        });
        // return res.status(400).send({
        //     msg : sudahReview
        // });

        if(sudahReview){
            return res.status(400).send({
                message : `Anda sudah pernah review produk ini di orderan ini!`
            });
        }

        //Kalau blm pernah review buat review baru

        // await Review.create({
        //     rating : rating,
        //     customerId : customerId,
        //     comment : comment,
        //     createdAt : new Date(),
        //     updatedAt : new Date(),
        //     codeOrderDetail : codeOrderDetail
        // });

        let produkNow = await Product.findAll({
            // include : [{
            //     model : OrderDetail,
            //     where : {
            //         codeOrderDetail : codeOrderDetail
            //     },
            //     required : true
            // }]
        });

        let a = await Product.findAll({
            // include : [{
            //     model : OrderDetail,
                // where : {
                //     codeProduct : "WSEC00001"
                // },
            //     required : true
            // }]
        });

        return res.status(201).send({msg : a});

        return res.status(201).send({
            message : `Berhasil submit review untuk produk ${produkNow.name} dengan rating ${rating}/5 `,
            comment : comment
        });

    }catch(e){
        return res.status(500).send({
            message : e.toString()
        });
    }
}

module.exports = {
    viewOrder,
    payOrder,
    checkOut,
    addToCart,
    addReview
}