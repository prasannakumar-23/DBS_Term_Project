const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');

router.post('/', controller.postProduct);
router.get('/fetchProductCat', controller.fetchProductCat);
router.get('/fetchProduct', controller.fetchProduct);
module.exports = router;
