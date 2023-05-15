const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const Customer = require('../models').Customer;
const Developer = require('../models').Developer;
const TokenDeveloper = require('../models').TokenDeveloper;
const Subscription = require('../models').Subscription;
const nodemailer = require("nodemailer");
const {
    v4: uuidv4
} = require("uuid");
var moment = require('moment');
const {
    Op
} = require('sequelize');
const {
    sequelize
} = require('../models');

let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    service: process.env.MAIL_SERVICE,
    secure: true,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});
transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Ready for messages");
        console.log(success);
    }
});

const sendVerificationEmail = async ({
    _id,
    email
}, res) => {
    const currentUrl = "http://localhost:3000/";
    const uniqueString = uuidv4() + _id;
    const mailoptions = {
        from: process.env.MAIL_USERNAME,
        to: email,
        subject: "Verify Your Email",
        html: `<p>Verify your email address to complete the sign up and login into your account</p>
        <p> This link expires in <b> 6 hours </b>.</p> 
        <p>Press <a href=${currentUrl+ "developer/verify/" + _id + "/"+uniqueString}> here </a></p>`
    };

    const saltRounds = 10;
    let hasil = bcrypt.hashSync(uniqueString, saltRounds);
    await TokenDeveloper.create({
        developerId: _id,
        token: hasil,
        createdAt: Date.now(),
        expiredAt: Date.now() + 21600000
    });
    transporter.sendMail(mailoptions);
}

const verifyEmail = async (req, res) => {
    let {
        developerId,
        token
    } = req.params;

    let td = await TokenDeveloper.findOne({
        where: {
            developerId: developerId
        }
    });
    if (!td) {
        return res.status(404).send({
            message: "Developer Not Found!"
        });
    } else {
        const {
            expiredAt
        } = td.expiredAt;
        const hashedtoken = td.token;
        if (td.expiredAt < Date.now()) {
            let tdDes = await TokenDeveloper.destroy({
                where: {
                    developerId: td.developerId
                }
            });
            if (!tdDes) {
                let message = "Token record doesn't exist or has been verified already. Please sign up or log in.";
                return res.redirect(`/api/developer/verified/error=true&message=${message}`)
            } else {
                let tddev = await Developer.destroy({
                    where: {
                        id: td.developerId
                    }
                });
                message = "Link has expired. Please sign up again.";
                return res.redirect(`/api/developer/verified/error=true&message=${message}`);
            }
        } else {
            //valid token
            if (!bcrypt.compareSync(token, hashedtoken)) {
                message = "Token not valid";
                return res.redirect(`/api/developer/verified/error=true&message=${message}`);
            } else {
                try {
                    await Developer.update({
                        email_verified: true
                    }, {
                        where: {
                            id: td.developerId
                        }
                    });
                    await TokenDeveloper.destroy({
                        where: {
                            developerId: td.developerId
                        }
                    });
                    return res.sendFile(path.join(__dirname, "../views/verified.html"));
                } catch (error) {
                    message = "Error occured while updating user";
                    return res.redirect(`/api/developer/verified/error=true&message=${message}`);
                }

            }

        }
    }

}

const verifiedEmail = async (req, res) => {
    return res.sendFile(path.join(__dirname, "../views/verified.html"));
}
const RegisterDeveloper = async (req, res) => {
    const {
        firstName,
        lastName,
        shop,
        email,
        password,
        username
    } = req.body;
    try {
        let dev = await Developer.create({
            firstName: firstName,
            lastName: lastName,
            shop: shop,
            email: email,
            password: bcrypt.hashSync(password, 12),
            username: username,
            subscriptionId: 1,
            expiredSubscription: null,
            email_verified: false
        });
        sendVerificationEmail(dev, res);
        return res.formatter.created(dev);
    } catch (error) {
        console.log(error);
        return res.formatter.badRequest(error);
    }
};

const RegisterCustomer = async (req, res) => {
    const {
        developerId,
        firstName,
        lastName,
        email,
        phoneNumber,
        username,
        password
    } = req.body;

    try {
        let cust = await Customer.create({
            developerId: developerId,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            username: username,
            password: bcrypt.hashSync(password, 12)
        });
        return res.formatter.created(cust);
    } catch (error) {
        console.log(error);
        return res.formatter.badRequest(error);
    }
};

const LoginDeveloper = async (req, res) => {
    const {
        username,
        password
    } = req.body;

    let dev = await Developer.findOne({
        attributes: ["id", "username", "shop", "password", "email", "subscriptionId", [sequelize.fn('date', sequelize.col('expiredSubscription')), 'expiredSubscription'], "email_verified"],
        include: [{
            model: Subscription,
            attributes: [
                "type"
            ]
        }],
        where: {
            username: username
        },
    });
    if (!dev) {
        return res.formatter.notFound("Username not registered!");
    } else {
        if (!bcrypt.compareSync(password, dev.dataValues.password)) {
            return res.formatter.badRequest("Invalid Password");
        } else {
            if (dev.email_verified == false) {
                return res.formatter.badRequest("Account hasn't been verified yet, check your inbox!");
            } else {
                var token = jwt.sign({
                        "id": dev.dataValues.id,
                        "username": dev.dataValues.username,
                        "shop": dev.dataValues.username,
                        "email": dev.dataValues.email,
                        "subscription": dev.Subscription.dataValues.type,
                        "expiredSubscription": moment(dev.dataValues.expiredSubscription).format("MM-DD-YYYY")
                    },
                    process.env.JWT_KEY, {
                        expiresIn: '500m'
                    }
                );
                var response = {
                    username: dev.dataValues.username,
                    token: token
                }
                return res.formatter.ok(response);
            }
        }
    }
};

const LoginCustomer = async (req, res) => {
    const {
        username,
        password
    } = req.body;

    let cust = await Customer.findOne({
        attributes: ["id", "username", "password", "email", "developerId"],
        where: {
            username: username
        },
    });
    if (!cust) {
        return res.formatter.notFound("Username not registered!");
    } else {
        if (!bcrypt.compareSync(password, cust.dataValues.password)) {
            return res.formatter.badRequest("Invalid Password");
        } else {
            var token = jwt.sign({
                    "id": cust.dataValues.id,
                    "username": cust.dataValues.username,
                    "email": cust.dataValues.email,
                    "developerId": cust.dataValues.developerId
                },
                process.env.JWT_KEY, {
                    expiresIn: '500m'
                }
            );
            var response = {
                username: cust.dataValues.username,
                token: token
            }
            return res.formatter.ok(response);
        }
    }
};

module.exports = {
    RegisterDeveloper,
    RegisterCustomer,
    LoginDeveloper,
    LoginCustomer,
    verifyEmail,
    verifiedEmail
};