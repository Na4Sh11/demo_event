const express = require('express');
const eventController = require('../controllers/eventController');
const { checkJwt } = require('../middlewares/authMiddleware');
const router = express.Router();



router.get('/ping', eventController.ping);
router.get('/authetication', checkJwt, eventController.getAuthentication);

router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.get('/venue/:id', eventController.getVenueById);
router.post('/', eventController.createEvent);
router.put('/:id', eventController.updateEvent);

module.exports = router;
