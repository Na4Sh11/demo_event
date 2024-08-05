const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events.' });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ error: 'Event not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event.' });
  }
};

// Create a new event
exports.createEvent = async (req, res) => {
  const { title, description, date, location, category, no_of_tickets, ticket_price } = req.body;
  try {
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        category,
        no_of_tickets,
        ticket_price,
        postedById: req.user.id
      }
    });
    res.json(newEvent);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create event.' });
  }
};

// Ping endpoint for server health check
exports.ping = (req, res) => {
  try {
    res.status(200).json({ message: 'Server is up and running!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to ping server.' });
  }
};
