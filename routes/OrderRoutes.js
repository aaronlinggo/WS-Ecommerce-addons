const { response } = require("express");
const express = require("express");
const { Op } = require("sequelize");
const COrder = require("../controllers/OrderController");

const router = express.Router();

//router.get("/viewOrder/:customerId",COrder.viewOrder);


module.exports = router;