const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const Customer = require('../models').Customer;
const Developer = require('../models').Developer;
const TokenDeveloper = require('../models').TokenDeveloper;
const TokenCustomer = require('../models').TokenCustomer;
const Subscription = require('../models').Subscription;
const nodemailer = require("nodemailer");
const path = require("path");
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

const sendVerificationEmailDeveloper = async ({
    id,
    email
}, res) => {
    const currentUrl = `http://addonstore.masuk.id/`;
    const uniqueString = uuidv4() + id;
    const mailoptions = {
        from: process.env.MAIL_USERNAME,
        to: email,
        subject: "Verify Your Email",
        html: `<!DOCTYPE html>
<html>

<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <style type="text/css">
        @media screen {
            @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 400;
                src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 700;
                src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: italic;
                font-weight: 400;
                src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: italic;
                font-weight: 700;
                src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
            }
        }

        /* CLIENT-SPECIFIC STYLES */
        body,
        table,
        td,
        a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table,
        td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        img {
            -ms-interpolation-mode: bicubic;
        }

        /* RESET STYLES */
        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }

        table {
            border-collapse: collapse !important;
        }

        body {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
        }

        /* iOS BLUE LINKS */
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        /* MOBILE STYLES */
        @media screen and (max-width:600px) {
            h1 {
                font-size: 32px !important;
                line-height: 32px !important;
            }
        }

        /* ANDROID CENTER FIX */
        div[style*="margin: 16px 0;"] {
            margin: 0 !important;
        }
    </style>
</head>

<body style="background-color: #6096B4; margin: 0 !important; padding: 0 !important;">
    <div
        style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        We're thrilled to have you here! Get ready to dive into your new account.
    </div>
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <!-- LOGO -->
        <tr>
            <td bgcolor="#6096B4" align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#6096B4" align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#ffffff" align="center" valign="top"
                            style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                            <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome!</h1> <img
                                src="${currentUrl}assets/logo1.png" width="125" height="120"
                                style="display: block; border: 0px;" />
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#ffffff" align="left"
                            style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;">We're excited to have you get started. First, you need to verify your
                                email. Just press the button below.</p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                        <table border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td align="center" style="border-radius: 3px;" bgcolor="#6096B4"><a
                                                        href=${currentUrl+ "api/auth/verifyDeveloper/" + id + "/" +uniqueString}
                                                        target="_blank"
                                                        style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #6096B4; display: inline-block;">Verify
                                                        Email Now</a></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left"
                            style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;">Cheers,<br>WS Add On E-Commerce</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#f4f4f4" align="left"
                            style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;">
                            <br>
                            <p style="margin: 0;"></p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
    };

    const saltRounds = 10;
    let hasil = bcrypt.hashSync(uniqueString, saltRounds);
    await TokenDeveloper.create({
        developerId: id,
        token: hasil,
        createdAt: Date.now(),
        expiredAt: Date.now() + 21600000
    });
    transporter.sendMail(mailoptions);
}

const sendVerificationEmailCustomer = async ({
    id,
    email
}, res) => {
    const currentUrl = `http://addonstore.masuk.id/`;
    const uniqueString = uuidv4() + id;
    const mailoptions = {
        from: process.env.MAIL_USERNAME,
        to: email,
        subject: "Verify Your Email",
        html: `<!DOCTYPE html>
<html>

<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <style type="text/css">
        @media screen {
            @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 400;
                src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 700;
                src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: italic;
                font-weight: 400;
                src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: italic;
                font-weight: 700;
                src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
            }
        }

        /* CLIENT-SPECIFIC STYLES */
        body,
        table,
        td,
        a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table,
        td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        img {
            -ms-interpolation-mode: bicubic;
        }

        /* RESET STYLES */
        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }

        table {
            border-collapse: collapse !important;
        }

        body {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
        }

        /* iOS BLUE LINKS */
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        /* MOBILE STYLES */
        @media screen and (max-width:600px) {
            h1 {
                font-size: 32px !important;
                line-height: 32px !important;
            }
        }

        /* ANDROID CENTER FIX */
        div[style*="margin: 16px 0;"] {
            margin: 0 !important;
        }
    </style>
</head>

<body style="background-color: #6096B4; margin: 0 !important; padding: 0 !important;">
    <div
        style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        We're thrilled to have you here! Get ready to dive into your new account.
    </div>
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <!-- LOGO -->
        <tr>
            <td bgcolor="#6096B4" align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#6096B4" align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#ffffff" align="center" valign="top"
                            style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                            <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome!</h1> <img
                                src="${currentUrl}assets/logo1.png" width="125" height="120"
                                style="display: block; border: 0px;" />
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#ffffff" align="left"
                            style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;">We're excited to have you get started. First, you need to verify your
                                email. Just press the button below.</p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                        <table border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td align="center" style="border-radius: 3px;" bgcolor="#6096B4"><a
                                                        href=${currentUrl+ "api/auth/verifyCustomer/" + id + "/" +uniqueString}
                                                        target="_blank"
                                                        style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #6096B4; display: inline-block;">Verify
                                                        Email Now</a></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left"
                            style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;">Cheers,<br>WS Add On E-Commerce</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#f4f4f4" align="left"
                            style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;">
                            <br>
                            <p style="margin: 0;"></p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
    };

    const saltRounds = 10;
    let hasil = bcrypt.hashSync(uniqueString, saltRounds);
    await TokenCustomer.create({
        customerId: id,
        token: hasil,
        createdAt: Date.now(),
        expiredAt: Date.now() + 21600000
    });
    transporter.sendMail(mailoptions);
}

const verifyEmailDeveloper = async (req, res) => {
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
        const hashedtoken = td.token;
        if (td.expiredAt < Date.now()) {
            let tdDes = await TokenDeveloper.destroy({
                where: {
                    developerId: td.developerId
                }
            });
            if (!tdDes) {
                let message = "Token record doesn't exist or has been verified already. Please sign up or log in.";
                return res.redirect(`/api/auth/verified/error=true&message=${message}`)
            } else {
                let tddev = await Developer.destroy({
                    where: {
                        id: td.developerId
                    }
                });
                message = "Link has expired. Please sign up again.";
                return res.redirect(`/api/auth/verified/error=true&message=${message}`);
            }
        } else {
            //valid token
            if (!bcrypt.compareSync(token, hashedtoken)) {
                message = "Token not valid";
                return res.redirect(`/api/auth/verified/error=true&message=${message}`);
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
                    return res.redirect(`/api/auth/verified?error=true&message=${message}`);
                }

            }

        }
    }

}

const verifyEmailCustomer = async (req, res) => {
    let {
        customerId,
        token
    } = req.params;

    let tc = await TokenCustomer.findOne({
        where: {
            customerId: customerId
        }
    });
    if (!tc) {
        return res.status(404).send({
            message: "Customer Not Found!"
        });
    } else {
        const hashedtoken = tc.token;
        if (tc.expiredAt < Date.now()) {
            let tcDes = await TokenCustomer.destroy({
                where: {
                    customerId: tc.customerId
                }
            });
            if (!tcDes) {
                let message = "Token record doesn't exist or has been verified already. Please sign up or log in.";
                return res.redirect(`/api/auth/verified/error=true&message=${message}`)
            } else {
                let tdcust = await Customer.destroy({
                    where: {
                        id: tc.customerId
                    }
                });
                message = "Link has expired. Please sign up again.";
                return res.redirect(`/api/auth/verified/error=true&message=${message}`);
            }
        } else {
            //valid token
            if (!bcrypt.compareSync(token, hashedtoken)) {
                message = "Token not valid";
                return res.redirect(`/api/auth/verified/error=true&message=${message}`);
            } else {
                try {
                    await Customer.update({
                        email_verified: true
                    }, {
                        where: {
                            id: tc.customerId
                        }
                    });
                    await TokenCustomer.destroy({
                        where: {
                            customerId: tc.customerId
                        }
                    });
                    return res.sendFile(path.join(__dirname, "../views/verified.html"));
                } catch (error) {
                    message = "Error occured while updating user";
                    return res.redirect(`/api/auth/verified?error=true&message=${message}`);
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
        sendVerificationEmailDeveloper(dev, res);
        return res.formatter.created({message: "Register successfully, please check your email!"});
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
        sendVerificationEmailCustomer(cust, res);
        return res.formatter.created({message: "Register successfully, please check your email!"});
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
                        "subscriptionId": dev.dataValues.subscriptionId,
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
        attributes: ["id", "username", "password", "email", "developerId", "email_verified"],
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
            if (cust.email_verified == false) {
                return res.formatter.badRequest("Account hasn't been verified yet, check your inbox!");
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
    }
};

module.exports = {
    RegisterDeveloper,
    RegisterCustomer,
    LoginDeveloper,
    LoginCustomer,
    verifyEmailDeveloper,
    verifyEmailCustomer,
    verifiedEmail
};