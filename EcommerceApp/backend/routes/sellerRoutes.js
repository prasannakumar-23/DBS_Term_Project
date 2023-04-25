const express = require('express');
const router = express.Router();
const SellerController = require('../controllers/sellerController');

// Register seller
router.post('/register', SellerController.register);

// Login seller
router.post('/login', SellerController.login);

module.exports = router;
