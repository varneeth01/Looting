const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Connect to MongoDB
mongoose.connect(config.mongo.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start the server
const PORT = config.port || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
