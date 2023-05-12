const {
    sequelize
} = require('../models');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const Product = require('../models').Product;
const formatRupiah = require("../helpers/formatRupiah");
const Developer = require('../models').Developer;
const fs = require("fs");
const fastCsv = require("fast-csv");
const options = {
    objectMode: true,
    delimiter: ",",
    quote: null,
    headers: true,
    renameHeaders: false,
};
const {
    Op
} = require('sequelize');
const getAll = async (req, res) => {
    var token = req.header("x-auth-token");
    dev = jwt.verify(token, process.env.JWT_KEY);
    var namaprod = req.query.nama; //buat search
    var ascdescprice = req.query.price;
    var ascdescstock = req.query.stock;
    //pagination
    var page = parseFloat(req.query.page) || 1;
    var pageSize = parseFloat(req.query.pageSize) || 10;
    var offset = (page - 1) * pageSize;
    // console.log(page + '-' + pageSize + '- ' + offset);
    if (namaprod) {
        let products = await Product.findAll({
            attributes: ['codeProduct', 'name', 'price', 'weight', 'photo', 'stock', 'description'],
            include: [{
                model: Developer,
                attributes: [
                    [sequelize.fn('CONCAT', sequelize.col('firstName'), ' ', sequelize.col('lastName')), 'developer_name']
                ]
            }],
            where: {
                developerId: dev.id,
                name: {
                    [Op.like]: '%' + namaprod + '%'
                }
            },
            limit: pageSize,
            offset: offset
        });
        products = products.map(p => {
            return {
                "Product Code": p.codeProduct,
                "Name": p.name,
                "Price": formatRupiah(p.price),
                "Weight": p.weight + " gram",
                "Photo": p.photo,
                "Stock": p.stock,
                "Description": p.description,
                "Developer Name": p["Developer"]["dataValues"]["developer_name"]
            };
        })
        return res.formatter.ok(products);
    } else {
        let products = await Product.findAll({
            attributes: ['codeProduct', 'name', 'price', 'weight', 'photo', 'stock', 'description'],
            include: [{
                model: Developer,
                attributes: [
                    [sequelize.fn('CONCAT', sequelize.col('firstName'), ' ', sequelize.col('lastName')), 'developer_name']
                ]
            }],
            where: {
                developerId: dev.id
            },
            limit: pageSize,
            offset: offset
        });
        if (ascdescprice) {
            if (ascdescprice.toUpperCase() == "ASC") {
                products = await Product.findAll({
                    attributes: ['codeProduct', 'name', 'price', 'weight', 'photo', 'stock', 'description'],
                    include: [{
                        model: Developer,
                        attributes: [
                            [sequelize.fn('CONCAT', sequelize.col('firstName'), ' ', sequelize.col('lastName')), 'developer_name']
                        ]
                    }],
                    where: {
                        developerId: dev.id
                    },
                    order: [
                        ['price', 'ASC']
                    ],
                    limit: pageSize,
                    offset: offset
                });
            } else if (ascdescprice.toUpperCase() == "DESC") {
                products = await Product.findAll({
                    attributes: ['codeProduct', 'name', 'price', 'weight', 'photo', 'stock', 'description'],
                    include: [{
                        model: Developer,
                        attributes: [
                            [sequelize.fn('CONCAT', sequelize.col('firstName'), ' ', sequelize.col('lastName')), 'developer_name']
                        ]
                    }],
                    where: {
                        developerId: dev.id
                    },
                    order: [
                        ['price', 'DESC']
                    ],
                    limit: pageSize,
                    offset: offset
                });
            }
        }

        if (ascdescstock) {
            if (ascdescstock.toUpperCase() == "ASC") {
                products = await Product.findAll({
                    attributes: ['codeProduct', 'name', 'price', 'weight', 'photo', 'stock', 'description'],
                    include: [{
                        model: Developer,
                        attributes: [
                            [sequelize.fn('CONCAT', sequelize.col('firstName'), ' ', sequelize.col('lastName')), 'developer_name']
                        ]
                    }],
                    where: {
                        developerId: dev.id
                    },
                    order: [
                        ['stock', 'ASC']
                    ],
                    limit: pageSize,
                    offset: offset
                });
            } else if (ascdescstock.toUpperCase() == "DESC") {
                products = await Product.findAll({
                    attributes: ['codeProduct', 'name', 'price', 'weight', 'photo', 'stock', 'description'],
                    include: [{
                        model: Developer,
                        attributes: [
                            [sequelize.fn('CONCAT', sequelize.col('firstName'), ' ', sequelize.col('lastName')), 'developer_name']
                        ]
                    }],
                    where: {
                        developerId: dev.id
                    },
                    order: [
                        ['stock', 'DESC']
                    ],
                    limit: pageSize,
                    offset: offset
                });
            }
        }
        products = products.map(p => {
            return {
                "Product Code": p.codeProduct,
                "Name": p.name,
                "Price": formatRupiah(p.price),
                "Weight": p.weight + " gram",
                "Photo": p.photo,
                "Stock": p.stock,
                "Description": p.description,
                "Developer Name": p["Developer"]["dataValues"]["developer_name"]
            };
        })
        return res.formatter.ok(products);
    }

}
const bulkAddProduct = async (req, res) => {
    var token = req.header("x-auth-token");
    dev = jwt.verify(token, process.env.JWT_KEY);
    const data = [];
    const readableStream = fs.createReadStream("data.csv");

}
const addProduct = async (req, res) => {
    var token = req.header("x-auth-token");
    dev = jwt.verify(token, process.env.JWT_KEY);
    var name = req.body.name;
    var price = req.body.price;
    var photo = req.file;
    var stock = req.body.stock;
    var description = req.body.description;
    var weight = req.body.weight;
    let products = await Product.findOne({
        order: [
            ["codeProduct", "DESC"]
        ],
        limit: 1,
    });
    var temp = products.codeProduct;
    var angkaterakhir = parseInt(temp.slice(4, 9));
    var code = "WSEC" + ((angkaterakhir + 1) + "").padStart(5, '0');
    var namafilephoto = code + ".jpg";
    var path = "/storage/" + dev.username + "/" + namafilephoto;
    var newProduct = await Product.create({
        codeProduct: code,
        developerId: dev.id,
        name: name,
        price: price,
        weight: weight,
        photo: path,
        stock: stock,
        description: description
    });
    newProduct = {
        "Product Code": code,
        "ID Developer": dev.id,
        "Name": name,
        "Price": formatRupiah(price),
        "Weight": weight + " gram",
        "Photo": path,
        "Stock": stock,
        "Description": description
    };
    return res.formatter.created(newProduct);
}

const editProduct = async (req, res) => {
    var token = req.header("x-auth-token");
    dev = jwt.verify(token, process.env.JWT_KEY);
    var codeProduct = req.params.id;
    var name = req.body.name;
    var price = req.body.price;
    var weight = req.body.weight;
    var photo = req.file;
    var stock = req.body.stock;
    var description = req.body.description;
    var photos = codeProduct + ".jpg";
    var path = "/storage/" + dev.username + "/" + photos;
    let product = await Product.findOne({
        attributes: ['photo'],
        where: {
            codeProduct: codeProduct
        }
    });

    //untuk hapus foto
    // let namafile = product.photo;
    // fs.unlinkSync('.' + namafile);

    await Product.update({
        name: name,
        price: price,
        weight: weight,
        photo: path,
        stock: stock,
        description: description
    }, {
        where: {
            codeProduct: codeProduct,
            developerId: dev.id
        }
    });

    product = await Product.findOne({
        attributes: ['codeProduct', 'name', 'price', 'weight', 'photo', 'stock', 'description'],
        include: [{
            model: Developer,
            attributes: [
                [sequelize.fn('CONCAT', sequelize.col('firstName'), ' ', sequelize.col('lastName')), 'developer_name']
            ]
        }],
        where: {
            codeProduct: codeProduct,
            developerId: dev.id
        }
    });
    let editedProduct = {
        "Product Code": product.codeProduct,
        "Developer": product["Developer"]["dataValues"]["developer_name"],
        "Name": name,
        "Price": formatRupiah(price),
        "Weight": weight + " gram",
        "Photo": product.photo,
        "Stock": stock,
        "Description": description
    };
    return res.formatter.ok(editedProduct);
}

const deleteProduct = async (req, res) => {
    var token = req.header("x-auth-token");
    dev = jwt.verify(token, process.env.JWT_KEY);
    var codeProduct = req.params.id;
    let product = await Product.findOne({
        attributes: ['photo'],
        where: {
            codeProduct: codeProduct,
            developerId: dev.id
        }
    });
    let namafile = product.photo;
    // fs.unlinkSync('.' + namafile);
    await Product.destroy({
        where: {
            codeProduct: codeProduct,
            developerId: dev.id
        }
    });
    var hasil = {
        message: "Delete Successful"
    };
    return res.formatter.ok(hasil);
}

const getDetailProduct = async (req, res) => {
    var token = req.header("x-auth-token");
    dev = jwt.verify(token, process.env.JWT_KEY);
    var codeProduct = req.params.id;
    let product = await Product.findOne({
        attributes: ['codeProduct', 'name', 'price', 'weight', 'photo', 'stock', 'description'],
        include: [{
            model: Developer,
            attributes: [
                [sequelize.fn('CONCAT', sequelize.col('firstName'), ' ', sequelize.col('lastName')), 'developer_name']
            ]
        }],
        where: {
            codeProduct: codeProduct,
            developerId: dev.id
        }
    });
    if (product.length <= 0) {
        var hasil = {
            message: "Product Not Found!"
        }
        return res.formatter.notFound(hasil);
    }
    var hasil = {
        "Product Code": product.codeProduct,
        "Developer": product["Developer"]["dataValues"]["developer_name"],
        "Name": product.name,
        "Price": formatRupiah(product.price),
        "Weight": product.weight + " gram",
        "Photo": product.photo,
        "Stock": product.stock,
        "Description": product.description
    };
    return res.formatter.ok(hasil);
}

module.exports = {
    getAll,
    addProduct,
    bulkAddProduct,
    editProduct,
    deleteProduct,
    getDetailProduct
};