const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();


// router.use(authMiddleware); // comment until Auth0 is completed

router.get('/ping', userController.ping);


module.exports = router;
