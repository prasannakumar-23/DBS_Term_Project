const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Route to place an order
router.post('/', orderController.placeOrder);
router.post('/fetchOrder',orderController.fetchOrder);
router.post('/cancelOrder',orderController.handleCancel);
router.post('/fetchReturnRequests',orderController.fetchReturnRequests);
router.post('/handleDelivery',orderController.handleDelivery);
router.post('/returnDelivery',orderController.handleReturn);
router.post('/acceptReturn',orderController.acceptReturn);
router.post('/rejectReturn',orderController.rejectReturn);


module.exports = router;
