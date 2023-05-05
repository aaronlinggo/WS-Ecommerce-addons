const {
    sequelize
} = require('../models');

const Product = require('../models').Product;
const Developer = require('../models').Developer;

const getAll = async (req, res) => {
    let products = await Product.findAll({
        attributes: ['codeProduct', 'name', 'price', 'photo', 'stock', 'description'],
        include: [{
            model: Developer,
            attributes: [
                [sequelize.fn('CONCAT', sequelize.col('firstName'), ' ', sequelize.col('lastName')), 'Developer Name']
            ]
        }]
    });
    return res.status(200).send(products);
}

const addProduct = async (req, res) => {
    var developerId = req.body.developerId;
    var name = req.body.name;
    var price = req.body.price;
    var photo = req.file;
    var stock = req.body.stock;
    var description = req.body.description;
    let products = await Product.findAll();
    var code = "WSEC" + (products.length + "").padStart(5, '0');
    var newProduct = await Product.create({
        codeProduct: code,
        developerId: developerId,
        name: name,
        price: price,
        photo: photo.originalname,
        stock: stock,
        description: description
    });
    newProduct = {
        "Product Code": code,
        "ID Developer": developerId,
        "Name": name,
        "Price": price,
        "Photo": photo.originalname,
        "Stock": stock,
        "Description": description
    };
    return res.status(200).send(newProduct);
}
module.exports = {
    getAll,
    addProduct
};