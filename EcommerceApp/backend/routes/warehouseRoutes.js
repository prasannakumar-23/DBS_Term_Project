const express = require('express');
const router = express.Router();
const WarehouseController = require('../controllers/warehouseController');

// Register user
router.post('/addWarehouse', WarehouseController.addWarehouse);

// Login user


module.exports = router;