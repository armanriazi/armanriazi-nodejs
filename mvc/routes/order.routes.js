const express = require("express");
const orderController = require("../controllers/order.controller");

const router = express.Router();

router.get("/", orderController.getOrders);
router.post("/neworder", orderController.createNewOrder);

module.exports = router;
 