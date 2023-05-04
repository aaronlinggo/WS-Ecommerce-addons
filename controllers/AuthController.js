const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const Customer = require('../models').Customer;
const Developer = require('../models').Developer;
const {
    Op
} = require('sequelize');

const RegisterDeveloper = async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password,
        username
    } = req.body;

    if (!firstName, !lastName, !email, !password, !username){
        return res.status(400).send("field kosong");
    }
    else{
        try {
            let dev = await Developer.create({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: bcrypt.hashSync(password, 12),
                username: username
            });
            return res.status(201).send(dev);
        } catch (error) {
            console.log(error);
            return res.status(400).send(error);
        }
    }
    
};

// self.RegisterCustomer = async (developerId, firstName, lastName, email, phoneNumber, username, password) => {
//     let cust = await Customer.create({
//         developerId: developerId,
//         firstName: firstName,
//         lastName: lastName,
//         email: email,
//         phoneNumber: phoneNumber,
//         username: username,
//         password: bcrypt.hashSync(password, 12)
//     });
//     return cust;
// };

// self.LoginDeveloper = async (username, password) => {
//     let dev = await Developer.findOne({
//         attributes: ["username"],
//         where: {
//             username: username,
//             password: password
//         },
//     });

//     if (!bcrypt.compareSync(req.body.password, dev.password)) {
//         return res.status(400).send("Invalid Password");
//     } else {
//         var token = jwt.sign({
//                 "nrp": nrp,
//                 "role": result[0].role
//             },
//             jwt_key, {
//                 expiresIn: '500m'
//             }
//         );
//         return res.status(200).send(result[0]);
//     }

//     return dev;
// };

// self.checkUsernameDeveloper = async (username) => {
//     const check = await Developer.findOne({
//         where:{
//             username: username,

//         }
//     });

//     if (check)
//         return true;
//     else
//         return false;
// };

// self.checkEmailDeveloper = async (email) => {
//     const check = await Developer.findOne({
//         where:{
//             email: email,

//         }
//     });

//     if (check)
//         return true;
//     else
//         return false;
// };

// self.checkUsernameCustomer = async (username) => {
//     const check = await Customer.findOne({
//         where:{
//             username: username,

//         }
//     });

//     if (check)
//         return true;
//     else
//         return false;
// };

// self.checkEmailCustomer = async (email) => {
//     const check = await Customer.findOne({
//         where:{
//             email: email,

//         }
//     });

//     if (check)
//         return true;
//     else
//         return false;
// };

module.exports = { RegisterDeveloper };