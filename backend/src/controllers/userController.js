const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Ping endpoint for server health check
exports.ping = (req, res) => {
  try {
    res.status(200).json({ message: 'Server is up and running!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to ping server.' });
  }
};
