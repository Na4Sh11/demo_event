const express = require('express');
const userController = require('../controllers/userController');
const { checkJwt } = require('../middlewares/authMiddleware');
const router = express.Router();



router.get('/ping', userController.ping);
router.get('/authentication', checkJwt, userController.getAuthentication);

// User Operations
router.post('/signup', userController.signUp);
router.post('/login', userController.login);
router.get('/:id', userController.viewUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
