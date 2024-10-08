const express = require('express');
const cors = require('cors');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');


const app = express();

app.use(cors());
app.use(express.json());

app.use('/events', eventRoutes);
app.use('/users', userRoutes);

app.get('/ping', (req, res) => {
  res.send('Server is up and running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
