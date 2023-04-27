const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/addToCart', cartController.addToCart);
router.post('/modifyCart', cartController.modifyCart);
router.post('/emptyCart', cartController.emptyCart);
router.post('/displayCart',cartController.displayCart)


module.exports = router;
