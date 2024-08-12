const express = require('express');
const userController = require('../controllers/userController');
const { checkJwt } = require('../middlewares/authMiddleware');
const router = express.Router();



router.get('/ping', userController.ping);
router.get('/authentication', checkJwt, userController.getAuthentication);

// User Operations
router.post('/signup', userController.signUp);
router.post('/login', userController.login);
router.post('/addToFavourites', checkJwt, userController.addEventToFavorites);
router.post('/getUserHistory', checkJwt, userController.getUserHistory);
router.post('/getEventsPosted', checkJwt, userController.getEventsPosted);
router.post('/buyTickets', checkJwt, userController.buyTickets);
router.post('/updateUserEventStatus', checkJwt,userController.updateUserEventStatus);
router.get('/:id' ,checkJwt, userController.viewUser);
router.put('/:id', checkJwt, userController.updateUser);
router.delete('/:id', checkJwt, userController.deleteUser);

module.exports = router;
