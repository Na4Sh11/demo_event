const express = require('express');
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();



router.get('/ping', eventController.ping);
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
// router.post('/', authMiddleware, eventController.createEvent); comment until Auth0 is completed
router.post('/', eventController.createEvent);

module.exports = router;
