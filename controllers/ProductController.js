const {
    sequelize
} = require('../models');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const Product = require('../models').Product;
const formatRupiah = require("../helpers/formatRupiah");
const Developer = require('../models').Developer;
const fs = require("fs");
const developer = require('../models/developer');

const getAll = async (req, res) => {
    let products = await Product.findAll({
        attributes: ['codeProduct', 'name', 'price', 'photo', 'stock', 'description'],
        include: [{
            model: Developer,
            attributes: [
                [sequelize.fn('CONCAT', sequelize.col('firstName'), ' ', sequelize.col('lastName')), 'developer_name']
            ]
        }]
    });
    products = products.map(p => {
        return {
            "Product Code": p.codeProduct,
            "Name": p.name,
            "Price": formatRupiah(p.price),
            "Photo": p.photo,
            "Stock": p.stock,
            "Description": p.description,
            "Developer Name": p["Developer"]["dataValues"]["developer_name"]
        };
    })
    return res.status(200).send(products);
}

const addProduct = async (req, res) => {
    var token = req.header("x-auth-token");
    dev = jwt.verify(token, process.env.JWT_KEY);
    var name = req.body.name;
    var price = req.body.price;
    var photo = req.file;
    var stock = req.body.stock;
    var description = req.body.description;
    let products = await Product.findAll();
    var code = "WSEC" + ((products.length + 1) + "").padStart(5, '0');
    var newProduct = await Product.create({
        codeProduct: code,
        developerId: dev.id,
        name: name,
        price: price,
        photo: photo.originalname,
        stock: stock,
        description: description
    });
    newProduct = {
        "Product Code": code,
        "ID Developer": dev.id,
        "Name": name,
        "Price": formatRupiah(price),
        "Photo": photo.originalname,
        "Stock": stock,
        "Description": description
    };
    return res.status(200).send(newProduct);
}

const editProduct = async (req, res) => {
    var codeProduct = req.params.id;
    var name = req.body.name;
    var price = req.body.price;
    var photo = req.file;
    var stock = req.body.stock;
    var description = req.body.description;
    var photos = photo.originalname;
    let product = await Product.findOne({
        attributes: ['photo'],
        where: {
            codeProduct: codeProduct
        }
    });
    
    let namafile = product.photo;
    fs.unlinkSync('./assets/' + namafile);

    await Product.update({
        name: name,
        price: price,
        photo: photos,
        stock: stock,
        description: description
    }, {
        where: {
            codeProduct: codeProduct
        }
    });
    product = await Product.findOne({
        attributes: ['codeProduct', 'name', 'price', 'photo', 'stock', 'description'],
        include: [{
            model: Developer,
            attributes: [
                [sequelize.fn('CONCAT', sequelize.col('firstName'), ' ', sequelize.col('lastName')), 'developer_name']
            ]
        }],
        where: {
            codeProduct: codeProduct
        }
    });
    let editedProduct = {
        "Product Code": product.codeProduct,
        "Developer": product["Developer"]["dataValues"]["developer_name"],
        "Name": name,
        "Price": formatRupiah(price),
        "Photo": photo.originalname,
        "Stock": stock,
        "Description": description
    };
    return res.status(200).send(editedProduct);
}

const deleteProduct = async (req, res) => {
    var codeProduct = req.params.id;
    let product = await Product.findOne({
        attributes: ['photo'],
        where: {
            codeProduct: codeProduct
        }
    });
    let namafile = product.photo;
    fs.unlinkSync('./assets/' + namafile);
    await Product.destroy({
        where: {
            codeProduct: codeProduct
        }
    });
    var hasil = {
        message: "Delete Successful"
    };
    return res.status(200).send(hasil);
}

const getDetailProduct = async (req, res) => {
    var codeProduct = req.params.id;
    let product = await Product.findOne({
        attributes: ['codeProduct', 'name', 'price', 'photo', 'stock', 'description'],
        include: [{
            model: Developer,
            attributes: [
                [sequelize.fn('CONCAT', sequelize.col('firstName'), ' ', sequelize.col('lastName')), 'developer_name']
            ]
        }],
        where: {
            codeProduct: codeProduct
        }
    });
    var hasil = {
        "Product Code": product.codeProduct,
        "Developer": product["Developer"]["dataValues"]["developer_name"],
        "Name": product.name,
        "Price": formatRupiah(product.price),
        "Photo": product.photo,
        "Stock": product.stock,
        "Description": product.description
    };
    return res.status(200).send(hasil);
}

module.exports = {
    getAll,
    addProduct,
    editProduct,
    deleteProduct,
    getDetailProduct
};