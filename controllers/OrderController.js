const Order = require('../models').Order;
const { validationResult } = require("express-validator");

async function viewOrder(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.formatter.badRequest(errors.mapped());
    }

    let result;
    if(!req.body.codeOrder){
        //Kalau di body gk ada codeOrder
        //Cari semua order dari user yg login

        result = await Order.findAll({
            attributes:['codeOrder','quantity','origin','destination','courierJne','costCourier']
        },{
            where : {
                customerId : req.params.customerId
            }
        });
    }
    else{
        //Kalau di body ada codeOrder
        //Cari order itu saja
        
        result = await Order.findAll({
            attributes:['codeOrder','quantity','origin','destination','courierJne','costCourier']
        },{
            where : {
                codeOrder : req.body.codeOrder
            }
        });
    }
    return res.status(200).send({order : result});
}

async function payOrder(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.formatter.badRequest(errors.mapped());
    }
    
    let result;
    let {codeOrder} = req.body;
    return res.status(200).send({order : result});
}

module.exports = {
    viewOrder,
    payOrder
}