const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();


// router.use(authMiddleware); // comment until Auth0 is completed

router.get('/ping', userController.ping);

// User Operations
router.post('/signup', userController.signUp);
router.post('/login', userController.login);
router.get('/:id', userController.viewUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
