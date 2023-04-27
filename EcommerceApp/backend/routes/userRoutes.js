const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { route } = require('./productRoutes');

// Register user
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/getDetails',UserController.fetchDetails)

module.exports = router;
