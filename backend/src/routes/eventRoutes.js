const express = require('express');
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/', authMiddleware, eventController.createEvent);

module.exports = router;
