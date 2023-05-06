const cron = require('node-cron');
const moment = require('moment');
const express = require("express");
const app = express();
const { sequelize } = require("./models");
const Developer = require("./models").Developer;
const auth = require("./routes/AuthRoutes");
const {responseEnhancer}  = require('express-response-formatter');
const customer = require("./routes/CustomerRoutes");
const order = require("./routes/OrderRoutes");
const product = require("./routes/ProductRoutes");
const review = require("./routes/review_routes");
const order_routes = require("./routes/order_routes");
const subscription = require("./routes/SubscriptionRoutes");

const port = 3000;

app.use(responseEnhancer());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use("/api/auth", auth);
app.use("/api/customer", customer);
app.use("/api/order", order);
app.use("/api/product", product);
app.use("/api/review", review);
app.use("/api/order_routes", order_routes);
app.use("/api/subscription", subscription);

cron.schedule('0 0 * * *', async function() {
    console.log("Checking expired subscription!");
    let dev = await Developer.findAll({
        attributes: ["id", "subscriptionId", "expiredSubscription"]
    });
    for (let i = 0; i < dev.length; i++) {
        if (dev[i].dataValues.subscriptionId == 2){
            if (moment(dev[i].dataValues.expiredSubscription).format("MM-DD-YYYY") == moment().format("MM-DD-YYYY")){
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

app.listen(port, async function (){
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
        return console.log(`Listening on port ${port}`);
    } catch (error) {
        console.log("Unable to connect to the database");
    }
})

module.exports = app;