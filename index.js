const express = require("express");
const app = express();
const { sequelize } = require("./models");
const auth = require("./routes/AuthRoutes");
const {responseEnhancer}  = require('express-response-formatter');
const customer = require("./routes/CustomerRoutes");
const order = require("./routes/OrderRoutes");
const product = require("./routes/ProductRoutes");
const review = require("./routes/review_routes");
const order_routes = require("./routes/order_routes");
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
app.use("/api/orderRoutes", order_routes);

app.listen(port, async function (){
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
        return console.log(`Listening on port ${port}`);
    } catch (error) {
        console.log("Unable to connect to the database");
    }
})

// //routes:
// const auth = require("./routes/AuthRoutes");

// app.use("/auth", auth);

// const port = 3000;
// app.listen(port, function () {
//     console.log(`Listening on port ${3000}`);
// });

module.exports = app;