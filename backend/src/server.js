const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const authMiddleware = require('./middlewares/authMiddleware');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.use(authMiddleware); // Apply authentication middleware

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
