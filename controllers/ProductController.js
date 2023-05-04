const developer = require('../models/developer');

const Product = require('../models').Product;
const Developer = require('../models').Developer;

const getAll = async (req, res) => {
    let products = await Product.findAll({
        attributes: ['codeProduct', 'name', 'price', 'photo', 'stock', 'description'],
        // include: [{
        //     model: developers,
        //     attributes: ['firstName', 'lastName']
        // }]
    });
    return res.status(200).send(products);
}

const addProduct = async (req, res) => {

}
module.exports = {
    getAll,
    addProduct
};