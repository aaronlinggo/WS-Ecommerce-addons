const cron = require('node-cron');
const moment = require('moment');
const express = require("express");
const app = express();
const {
    sequelize
} = require("./models");
const Developer = require("./models").Developer;
const auth = require("./routes/AuthRoutes");
const {
    responseEnhancer
} = require('express-response-formatter');
const customer = require("./routes/CustomerRoutes");
const product = require("./routes/ProductRoutes");
const review_routes = require("./routes/review_routes");
const order_routes = require("./routes/order_routes");
const subscription = require("./routes/SubscriptionRoutes");
const rajaongkir = require("./routes/RajaOngkirRoutes");
const developer = require("./routes/DeveloperRoutes");
const invoice = require("./routes/InvoiceRoutes");

const port = 3000;

app.use(responseEnhancer());

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use("/api/auth", auth);
app.use("/api/customer", customer);
app.use("/api/product", product);
app.use("/api/reviewRoutes", review_routes);
app.use("/api/orderRoutes", order_routes);
app.use("/api/subscription", subscription);
app.use("/api/rajaongkir", rajaongkir);
app.use("/api/developer/order", developer);
app.use("/api/invoice", invoice);
app.use('/images', express.static(__dirname + '/storage'));
app.use('/assets', express.static(__dirname + '/assets'));

cron.schedule('0 0 * * *', async function () {
    console.log("Checking expired subscription!");
    let dev = await Developer.findAll({
        attributes: ["id", "subscriptionId", "expiredSubscription"]
    });
    for (let i = 0; i < dev.length; i++) {
        if (dev[i].dataValues.subscriptionId == 2) {
            if (moment(dev[i].dataValues.expiredSubscription).format("MM-DD-YYYY") == moment().format("MM-DD-YYYY")) {
                await Developer.update({
                    subscriptionId: 1,
                    expiredSubscription: null
                }, {
                    where: {
                        id: dev[i].id
                    }
                });
                console.log(`Developer ID ${dev[i].id} subscription expired!`);
            }
        }
    }
});

app.listen(port, async function () {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
        return console.log(`Listening on port ${port}`);
    } catch (error) {
        console.log("Unable to connect to the database");
    }
})

module.exports = app;